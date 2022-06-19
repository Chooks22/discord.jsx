import type { CommandInteraction } from 'discord.js'
import type { APICommand, InteractionHandler } from '../../_utils.js'
import { arrayify, CommandType, permissionify } from '../../_utils.js'
import type { CommandContainer, OptionContainer } from '../_utils.js'
import type { BaseCommand, WithDescription, WithExecute } from './_utils.js'
import { validateBaseCommand, validateDescription, validateExecute } from './_utils.js'

export interface SlashCommandProps extends BaseCommand, WithDescription, WithExecute<CommandInteraction> {
  options?: JSX.Element
}

export interface SlashCommand extends Omit<SlashCommandProps, 'options'> {
  options?: OptionContainer<'Option'>[]
  type: CommandType.ChatInput
}

function validate(command: Omit<SlashCommand, 'type'>) {
  const prefix = 'slash command'
  validateBaseCommand(prefix, command)
  validateDescription(prefix, command)
  validateExecute(prefix, command)
  return command
}

function serialize(data: Omit<SlashCommand, 'type'>): APICommand {
  return {
    type: CommandType.ChatInput as number,
    name: data.name,
    name_localizations: data.nameLocalizations,
    description: data.description,
    description_localizations: data.descriptionLocalizations,
    options: data.options?.map(opt => opt.toJSON()),
    default_member_permissions: permissionify(data.defaultMemberPermissions),
    dm_permission: data.dmPermission,
  }
}

export function SlashCommand(props: SlashCommandProps): CommandContainer {
  const data = validate({
    ...props,
    options: props.options && arrayify(props.options as OptionContainer<'Option'>),
  })

  return {
    *getExecute() {
      const ns = 'cmd'
      yield [`${ns}::${data.name}`, data.onExecute as InteractionHandler]

      if (data.options !== undefined) {
        for (const option of data.options) {
          yield* option.getExecute(ns, data.name)
        }
      }
    },
    toJSON: () => serialize(data),
  }
}
