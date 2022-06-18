import type { MessageContextMenuInteraction } from 'discord.js'
import { CommandType, permissionify } from '../../_utils.js'
import type { BaseCommand, CommandContainer, WithExecute } from './_utils.js'
import { validateBaseCommand, validateExecute } from './_utils.js'

export interface MessageCommandProps extends BaseCommand, WithExecute<MessageContextMenuInteraction> {
}

export interface MessageCommand extends MessageCommandProps {
  type: CommandType.Message
}

function validate(command: MessageCommand) {
  const prefix = 'message command'
  validateBaseCommand(prefix, command)
  validateExecute(prefix, command)
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
