import { arrayify, CommandType, permissionify } from '../utils.js'
import type { SubcommandOption } from './options/index.js'
import type { OptionContainer } from './options/_utils.js'
import type { BaseCommand, CommandContainer, WithDescription, WithOptions } from './_utils.js'
import { validateBaseCommand, validateOptions } from './_utils.js'

export interface SlashSubcommandProps extends BaseCommand, WithDescription {
  children: JSX.Element | JSX.Element[]
}

export interface SlashSubcommand extends Omit<SlashSubcommandProps, 'children'>, WithOptions<OptionContainer<SubcommandOption>> {
  type: CommandType.ChatInput
}

function validate(command: SlashSubcommand) {
  const prefix = 'slash subcommand'
  validateBaseCommand(prefix, command)
  validateOptions(prefix, command)
  return command
}

export function SlashSubcommand(command: SlashSubcommandProps): CommandContainer<SlashSubcommand> {
  const data = validate({
    ...command,
    options: arrayify(command.children as OptionContainer<SubcommandOption>),
    type: CommandType.ChatInput,
  })

  return {
    data,
    toJSON: () => ({
      type: CommandType.ChatInput as number,
      name: data.name,
      name_localizations: data.nameLocalizations,
      description: data.description,
      description_localizations: data.descriptionLocalizations,
      options: arrayify(data.options).map(opt => opt.toJSON()),
      default_member_permissions: permissionify(data.defaultMemberPermissions),
      dm_permission: data.dmPermission,
    }),
  }
}
