import type { CommandInteraction } from 'discord.js'
import type { InteractionHandler } from '../utils.js'
import { arrayify, CommandType, permissionify } from '../utils.js'
import type { OptionContainer } from './options/_utils.js'
import type { CommandContainer, CommandWithDescription } from './_utils.js'

export interface SlashCommandProps extends CommandWithDescription {
  onExecute: InteractionHandler<CommandInteraction>
  options?: JSX.Element
}

export interface SlashCommand extends SlashCommandProps {
  type: CommandType.ChatInput
}

// @todo: validation
function validate(command: SlashCommand) {
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
