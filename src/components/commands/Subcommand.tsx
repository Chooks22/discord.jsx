import type { APICommand } from '../../_utils.js'
import { arrayify, CommandType, permissionify } from '../../_utils.js'
import type { CommandContainer, OptionContainer } from '../_utils.js'
import type { BaseCommand, WithDescription, WithOptions } from './_utils.js'
import { validateBaseCommand, validateOptions } from './_utils.js'

export interface SlashSubcommandProps extends BaseCommand, WithDescription {
  children: JSX.Element | JSX.Element[]
}

export interface SlashSubcommand extends Omit<SlashSubcommandProps, 'children'>, WithOptions<OptionContainer<'Subcommand'>> {
  type: CommandType.ChatInput
}

function validate(command: Omit<SlashSubcommand, 'type'>) {
  const prefix = 'slash subcommand'
  validateBaseCommand(prefix, command)
  validateOptions(prefix, command)
  return command
}

function serialize(data: Omit<SlashSubcommand, 'type'>): APICommand {
  return {
    type: CommandType.ChatInput as number,
    name: data.name,
    name_localizations: data.nameLocalizations,
    description: data.description,
    description_localizations: data.descriptionLocalizations,
    options: data.options.map(opt => opt.toJSON()),
    default_member_permissions: permissionify(data.defaultMemberPermissions),
    dm_permission: data.dmPermission,
  }
}

export function SlashSubcommand(command: SlashSubcommandProps): CommandContainer {
  const data = validate({
    ...command,
    options: arrayify(command.children as OptionContainer<'Subcommand'>),
  })

  return {
    *getExecute() {
      const ns = 'cmd'
      for (const group of data.options) {
        yield* group.getExecute(ns, command.name)
      }
    },
    toJSON: () => serialize(data),
  }
}
