import type { APIEmbed } from 'discord-api-types/v10'
import type {
  Awaitable,
  BaseMessageComponentOptions,
  BufferResolvable,
  FileOptions,
  InteractionReplyOptions,
  Message,
  MessageActionRow,
  MessageActionRowOptions,
  MessageAttachment,
  MessageEmbed,
  MessageEmbedOptions,
} from 'discord.js'
import type { Stream } from 'node:stream'
import type { JSXString, OnError } from '../../../_utils.js'
import { arrayify, normalize } from '../../../_utils.js'
import type { CustomPayload } from './_hander.js'
import { CustomResponse } from './_hander.js'

export interface ReplyProps extends Omit<InteractionReplyOptions, 'content' | 'embeds' | 'components' | 'attachments' | 'files'> {
  embeds?: (MessageEmbed | MessageEmbedOptions | APIEmbed)[] | JSX.Element
  components?: (MessageActionRow | (Required<BaseMessageComponentOptions> & MessageActionRowOptions))[] | JSX.Element
  attachments?: MessageAttachment[] | JSX.Element
  files?: (FileOptions | BufferResolvable | Stream | MessageAttachment)[] | JSX.Element
  onFetchReply?: (message: Message) => Awaitable<unknown>
  onError?: OnError
  children?: JSXString
}

export function Reply(props: ReplyProps): CustomPayload {
  return {
    $$type: CustomResponse,
    onError: props.onError,
    handle: async interaction => {
      const { children, embeds, components, attachments, onFetchReply, files, ...payload } = props
      const fetchReply = typeof onFetchReply === 'function'

      const opts: InteractionReplyOptions = {
        ...payload,
        fetchReply,
        embeds: embeds && arrayify(embeds),
        attachments: attachments && arrayify(attachments as MessageAttachment),
        components: components && arrayify(components as MessageActionRow),
        files: files && arrayify(files as FileOptions),
        content: children !== undefined
          ? normalize(children)
          : children,
      }

      if (interaction.deferred) {
        await interaction.editReply(opts)
      } else {
        const reply = await interaction.reply(opts as InteractionReplyOptions & { fetchReply: true })
        if (fetchReply) {
          await onFetchReply(reply as Message)
        }
      }
    },
  }
}
