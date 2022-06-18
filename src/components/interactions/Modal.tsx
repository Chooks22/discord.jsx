import type { MessageActionRow, TextInputStyle } from 'discord.js'
import { Modal as _Modal, TextInputComponent } from 'discord.js'
import type { JSXString } from '../../_utils.js'
import { arrayify, normalize } from '../../_utils.js'
import { ActionRow } from './Row.js'

export interface ModalProps {
  customId: string
  title: string
  children: JSX.Element | JSX.Element[]
}

export function Modal(props: ModalProps): _Modal {
  return new _Modal()
    .setCustomId(props.customId)
    .setTitle(props.title)
    .setComponents(...arrayify(props.children as MessageActionRow<TextInputComponent>))
}

export interface InputProps {
  customId: string
  children: JSXString
  minLength?: number
  maxLength?: number
  placeholder?: string
  required?: boolean
  type?: Lowercase<TextInputStyle>
  value?: string
}

export function Input(props: InputProps): JSX.Element {
  const input = new TextInputComponent()
    .setCustomId(props.customId)
    .setLabel(normalize(props.children))
    .setStyle((props.type ?? 'short').toUpperCase() as TextInputStyle)

  if (props.minLength !== undefined) {
    input.setMinLength(props.minLength)
  }

  if (props.maxLength !== undefined) {
    input.setMaxLength(props.maxLength)
  }

  if (props.placeholder !== undefined) {
    input.setPlaceholder(props.placeholder)
  }

  if (props.required !== undefined) {
    input.setRequired(props.required)
  }

  if (props.value !== undefined) {
    input.setValue(props.value)
  }

  return <ActionRow>{input}</ActionRow>
}
