import type { EmojiIdentifierResolvable, MessageButtonOptions } from 'discord.js'
import { MessageButton } from 'discord.js'
import type { JSXString } from '../../_utils.js'
import { normalize } from '../../_utils.js'

export interface ButtonProps {
  customId: string
  children?: JSXString
  emoji?: EmojiIdentifierResolvable
  disabled?: boolean
}

export interface LinkButtonProps extends ButtonProps {
  href: string
}

function Button(props: (ButtonProps | LinkButtonProps) & Pick<MessageButtonOptions, 'style'>) {
  const button = new MessageButton()
    .setCustomId(props.customId)
    .setStyle(props.style)

  if ('href' in props) {
    button.setURL(props.href)
    return button
  }

  if (props.emoji !== undefined) {
    button.setEmoji(props.emoji)
  }

  if (props.children !== undefined) {
    button.setLabel(normalize(props.children))
  }

  if ('disabled' in props) {
    button.setDisabled(props.disabled)
  }

  return button
}

export function PrimaryButton(props: ButtonProps): JSX.Element {
  return <Button {...props} style="PRIMARY" />
}

export function SecondaryButton(props: ButtonProps): JSX.Element {
  return <Button {...props} style="SECONDARY" />
}

export function SuccessButton(props: ButtonProps): JSX.Element {
  return <Button {...props} style="SUCCESS" />
}

export function DangerButton(props: ButtonProps): JSX.Element {
  return <Button {...props} style="DANGER" />
}

export function LinkButton(props: LinkButtonProps): JSX.Element {
  return <Button {...props} style="LINK" />
}
