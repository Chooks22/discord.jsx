import type { LocalizationMap } from 'discord-api-types/v10'
import type { CommandInteraction, PermissionResolvable } from 'discord.js'
import type { InteractionHandler } from '../utils.js'
import { arrayify, CommandType, permissionify } from '../utils.js'
import type { BaseOptionWithType } from './options/_utils.js'
import type { CommandContainer } from './_utils.js'

export interface SlashSubcommandProps {
  name: string
  nameLocalizations?: LocalizationMap
  description: string
  descriptionLocalizations?: LocalizationMap
  onExecute: InteractionHandler<CommandInteraction>
  defaultMemberPermission?: PermissionResolvable
  dmPermission?: boolean
  options: JSX.Element
}

interface SlashSubcommand extends SlashSubcommandProps {
  type: CommandType.ChatInput
}

// @todo: parser
function validate(command: SlashSubcommand) {
  return command
}

export function SlashSubcommand(command: SlashSubcommandProps): CommandContainer<SlashSubcommand> {
  const data = validate({
    ...command,
    options: arrayify(command.options),
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
      options: arrayify(data.options as BaseOptionWithType),
      default_member_permissions: permissionify(data.defaultMemberPermission),
      dm_permission: data.dmPermission,
    }),
  }
}
