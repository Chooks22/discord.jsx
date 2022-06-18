import type { MessageActionRowComponentResolvable } from 'discord.js'
import { MessageActionRow } from 'discord.js'
import { arrayify } from '../../_utils.js'

export interface ActionRowProps {
  children: JSX.Element | JSX.Element[]
}

export function ActionRow(props: ActionRowProps): MessageActionRow {
  return new MessageActionRow()
    .addComponents(arrayify(props.children as MessageActionRowComponentResolvable))
}
