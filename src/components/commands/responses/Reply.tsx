import type {
  Awaitable,
  InteractionReplyOptions,
  Message,
  MessageActionRow,
  MessageAttachment,
  MessageEmbed,
} from 'discord.js'
import type { Stream } from 'node:stream'
import type { JSXString, MaybeArray, OnError } from '../../../_utils.js'
import { arrayify, normalize } from '../../../_utils.js'
import type { CustomPayload } from './_handler.js'
import { CustomResponse } from './_handler.js'

export interface ReplyProps extends Omit<InteractionReplyOptions, 'content' | 'embeds' | 'components' | 'attachments' | 'files'> {
  onError?: OnError
  onFetchReply?: (message: Message) => Awaitable<unknown>
  children?: JSXString | MaybeArray<JSX.Element>
}

export function Reply(props: ReplyProps): CustomPayload {
  return {
    $$type: CustomResponse,
    onError: props.onError,
    handle: async interaction => {
      const { children, onFetchReply, ...payload } = props
      const fetchReply = typeof onFetchReply === 'function'

      const opts: InteractionReplyOptions = {
        ...payload,
        fetchReply,
      }

      if (children !== undefined) {
        const options = arrayify(children as JSX.Element)
        const childOpts = options.filter(opt => opt !== null && typeof opt === 'object')

        if (childOpts.length > 0) {
          Object.assign(opts, ...childOpts)
        } else {
          opts.content = normalize(options as JSXString)
        }
      }

      if (interaction.deferred) {
        await interaction.editReply(opts)
      } else {
        const reply = await interaction.reply(opts)
        if (fetchReply) {
          await onFetchReply(reply as unknown as Message)
        }
      }
    },
  }
}

export interface ReplyEmbedProps {
  children: MaybeArray<MessageEmbed | JSX.Element>
}

Reply.Embeds = function Embeds(props: ReplyEmbedProps): Pick<InteractionReplyOptions, 'embeds'> {
  return { embeds: arrayify(props.children) }
}

export interface ReplyAttachmentProps {
  children: MaybeArray<MessageAttachment | Stream | JSX.Element>
}

Reply.Attachments = function Attachments(props: ReplyAttachmentProps): Pick<InteractionReplyOptions, 'attachments'> {
  return { attachments: arrayify(props.children as MessageAttachment) }
}

export interface ReplyComponentProps {
  children: MaybeArray<MessageActionRow | JSX.Element>
}

Reply.Components = function Components(props: ReplyComponentProps): Pick<InteractionReplyOptions, 'components'> {
  return { components: arrayify(props.children as MessageActionRow) }
}

export interface ReplyContentProps {
  children: JSXString
}

Reply.Content = function Content(props: ReplyContentProps): Pick<InteractionReplyOptions, 'content'> {
  return { content: normalize(props.children) }
}
