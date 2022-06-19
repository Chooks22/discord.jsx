import type { UserContextMenuInteraction } from 'discord.js'
import type { APICommand, InteractionHandler } from '../../_utils.js'
import { CommandType, permissionify } from '../../_utils.js'
import type { CommandContainer } from '../_utils.js'
import type { BaseCommand, WithExecute } from './_utils.js'
import { validateBaseCommand, validateExecute } from './_utils.js'

export interface UserCommandProps extends BaseCommand, WithExecute<UserContextMenuInteraction> {
}

export interface UserCommand extends UserCommandProps {
  type: CommandType.User
}

function validate(command: Omit<UserCommand, 'type'>) {
  const prefix = 'user command'
  validateBaseCommand(prefix, command)
  validateExecute(prefix, command)
  return command
}

function serialize(data: Omit<UserCommand, 'type'>): APICommand {
  return {
    type: CommandType.User as number,
    name: data.name,
    name_localizations: data.nameLocalizations,
    description: '',
    default_member_permissions: permissionify(data.defaultMemberPermissions),
    dm_permission: data.dmPermission,
  }
}

export function UserCommand(command: UserCommandProps): CommandContainer {
  const data = validate(command)
  return {
    *getExecute() {
      yield [`usr::${command.name}`, command.onExecute as InteractionHandler]
    },
    toJSON: () => serialize(data),
  }
}
