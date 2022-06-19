import type { MessageContextMenuInteraction } from 'discord.js'
import type { APICommand, InteractionHandler } from '../../_utils.js'
import { CommandType, permissionify } from '../../_utils.js'
import type { CommandContainer } from '../_utils.js'
import type { BaseCommand, WithExecute } from './_utils.js'
import { validateBaseCommand, validateExecute } from './_utils.js'

export interface MessageCommandProps extends BaseCommand, WithExecute<MessageContextMenuInteraction> {
}

export interface MessageCommand extends MessageCommandProps {
  type: CommandType.Message
}

function validate(command: Omit<MessageCommand, 'type'>) {
  const prefix = 'message command'
  validateBaseCommand(prefix, command)
  validateExecute(prefix, command)
  return command
}

function serialize(data: Omit<MessageCommand, 'type'>): APICommand {
  return {
    type: CommandType.Message as number,
    name: data.name,
    name_localizations: data.nameLocalizations,
    description: '',
    default_member_permissions: permissionify(data.defaultMemberPermissions),
    dm_permission: data.dmPermission,
  }
}

export function MessageCommand(props: MessageCommandProps): CommandContainer {
  const data = validate(props)
  return {
    *getExecute() {
      yield [`msg::${data.name}`, data.onExecute as InteractionHandler]
    },
    toJSON: () => serialize(data),
  }
}
