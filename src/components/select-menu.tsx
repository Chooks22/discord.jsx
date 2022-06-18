import type { EmojiIdentifierResolvable, MessageSelectOptionData } from 'discord.js'
import { MessageSelectMenu } from 'discord.js'
import type { JSXString } from '../utils.js'
import { arrayify, normalize } from '../utils.js'
import { ActionRow } from './rows.js'

export interface SelectMenuProps {
  customId: string
  children: JSX.Element | JSX.Element[]
  disabled?: boolean
  maxValues?: number
  minValues?: number
  placeholder?: string
}

export function SelectMenu(props: SelectMenuProps): JSX.Element {
  const menu = new MessageSelectMenu()
    .setCustomId(props.customId)
    .setOptions(arrayify(props.children as MessageSelectOptionData))

  return <ActionRow>{menu}</ActionRow>
}

export interface OptionProps {
  value: string
  children: JSXString
  selected?: boolean
  description?: string
  emoji?: EmojiIdentifierResolvable
}

export function Option(props: OptionProps): MessageSelectOptionData {
  return {
    value: props.value,
    label: normalize(props.children),
    default: props.selected,
    description: props.description,
    emoji: props.emoji,
  }
}
