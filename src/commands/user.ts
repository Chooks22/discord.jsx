import type { UserContextMenuInteraction } from 'discord.js'
import type { InteractionHandler } from '../utils.js'
import { CommandType, permissionify } from '../utils.js'
import type { BaseCommand, CommandContainer } from './_utils.js'

export interface UserCommandProps extends BaseCommand {
  onExecute: InteractionHandler<UserContextMenuInteraction>
}

interface UserCommand extends UserCommandProps {
  type: CommandType.User
}

// @todo: validation
function validate(command: UserCommand) {
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
