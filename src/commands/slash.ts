import type { CommandInteraction } from 'discord.js'
import { arrayify, CommandType, permissionify } from '../utils.js'
import type { OptionContainer } from './options/_utils.js'
import type { BaseCommand, CommandContainer, WithDescription, WithExecute } from './_utils.js'
import { validateBaseCommand, validateDescription, validateExecute } from './_utils.js'

export interface SlashCommandProps extends BaseCommand, WithDescription, WithExecute<CommandInteraction> {
  options?: JSX.Element
}

export interface SlashCommand extends SlashCommandProps {
  type: CommandType.ChatInput
}

function validate(command: SlashCommand) {
  const prefix = 'slash command'
  validateBaseCommand(prefix, command)
  validateDescription(prefix, command)
  validateExecute(prefix, command)
  return command
}

export function SlashCommand(command: SlashCommandProps): CommandContainer<SlashCommand> {
  const data = validate({ ...command, type: CommandType.ChatInput })
  return {
    data,
    toJSON: () => ({
      type: CommandType.ChatInput as number,
      name: data.name,
      name_localizations: data.nameLocalizations,
      description: data.description,
      description_localizations: data.descriptionLocalizations,
      options: arrayify(data.options as OptionContainer).map(opt => opt.toJSON()),
      default_member_permissions: permissionify(data.defaultMemberPermissions),
      dm_permission: data.dmPermission,
    }),
  }
}
