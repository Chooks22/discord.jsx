import type { UserContextMenuInteraction } from 'discord.js'
import { CommandType, permissionify } from '../utils.js'
import type { BaseCommand, CommandContainer, WithExecute } from './_utils.js'
import { validateBaseCommand, validateExecute } from './_utils.js'

export interface UserCommandProps extends BaseCommand, WithExecute<UserContextMenuInteraction> {
}

interface UserCommand extends UserCommandProps {
  type: CommandType.User
}

function validate(command: UserCommand) {
  const prefix = 'user command'
  validateBaseCommand(prefix, command)
  validateExecute(prefix, command)
  return command
}

export function UserCommand(command: UserCommandProps): CommandContainer<UserCommand> {
  const data = validate({ ...command, type: CommandType.User })
  return {
    data,
    toJSON: () => ({
      type: CommandType.User as number,
      name: data.name,
      name_localizations: data.nameLocalizations,
      description: '',
      default_member_permissions: permissionify(data.defaultMemberPermissions),
      dm_permission: data.dmPermission,
    }),
  }
}
