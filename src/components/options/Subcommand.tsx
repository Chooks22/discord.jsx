import type { CommandInteraction } from 'discord.js'
import type { APICommandOption, InteractionHandler } from '../../_utils.js'
import { arrayify, OptionType } from '../../_utils.js'
import type { WithExecute, WithOptions } from '../commands/_utils.js'
import { validateExecute, validateOptions } from '../commands/_utils.js'
import type { OptionContainer } from '../_utils.js'
import type { BaseOption } from './_utils.js'
import { validateBaseOption } from './_utils.js'

export interface SubcommandProps extends BaseOption, WithExecute<CommandInteraction> {
  children?: JSX.Element | JSX.Element[]
}

export interface Subcommand extends Omit<SubcommandProps, 'children'>, Partial<WithOptions<OptionContainer<'Option'>>> {
  type: OptionType.Subcommand
}

function validate(command: Omit<Subcommand, 'type'>) {
  const prefix = 'subcommand'
  validateBaseOption(prefix, command)
  validateExecute(prefix, command)

  if (command.options) {
    validateOptions(prefix, command as Required<Subcommand>)
  }

  return command
}

function serialize(command: Omit<Subcommand, 'type'>): APICommandOption {
  return {
    type: OptionType.Subcommand as number,
    name: command.name,
    name_localizations: command.nameLocalizations,
    description: command.description,
    description_localizations: command.descriptionLocalizations,
    options: command.options?.map(opt => opt.toJSON()),
    required: command.required,
  }
}

export function Subcommand(command: SubcommandProps): OptionContainer<'Subcommand'> {
  const data = validate({
    ...command,
    options: command.children && arrayify(command.children as OptionContainer<'Option'>),
  })

  return {
    *getExecute(ns, parentKey) {
      const key = `${parentKey}:${data.name}`
      yield [`${ns}::${key}`, data.onExecute as InteractionHandler]

      if (data.options !== undefined) {
        for (const option of data.options) {
          yield* option.getExecute(ns, key)
        }
      }
    },
    toJSON: () => serialize(data),
  }
}
