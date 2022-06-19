import type { BufferResolvable } from 'discord.js'
import { MessageAttachment } from 'discord.js'
import type { Stream } from 'node:stream'
import type { JSXString } from '../_utils.js'
import { normalize } from '../_utils.js'

export interface AttachmentProps {
  attachment: BufferResolvable | Stream
  name?: string
  spoiler?: boolean
  children?: JSXString
}

export function Attachment(props: AttachmentProps): MessageAttachment {
  const attachment = new MessageAttachment(props.attachment, props.name)

  if (props.spoiler !== undefined) {
    attachment.setSpoiler(props.spoiler)
  }

  if (props.children !== undefined) {
    attachment.setDescription(normalize(props.children))
  }

  return attachment
}
