import type { MessageContextMenuInteraction } from 'discord.js'
import type { InteractionHandler } from '../utils.js'
import { CommandType, permissionify } from '../utils.js'
import type { BaseCommand, CommandContainer } from './_utils.js'

export interface MessageCommandProps extends BaseCommand {
  onExecute: InteractionHandler<MessageContextMenuInteraction>
}

interface MessageCommand extends MessageCommandProps {
  type: CommandType.Message
}

// @todo: validate
function validate(command: MessageCommand) {
  return command
}

export function MessageCommand(command: MessageCommandProps): CommandContainer<MessageCommand> {
  const data = validate({ ...command, type: CommandType.Message })
  return {
    data,
    toJSON: () => ({
      type: CommandType.Message as number,
      name: data.name,
      name_localizations: data.nameLocalizations,
      description: '',
      default_member_permissions: permissionify(data.defaultMemberPermissions),
      dm_permission: data.dmPermission,
    }),
  }
}
