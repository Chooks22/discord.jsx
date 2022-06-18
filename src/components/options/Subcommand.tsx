import type { CommandInteraction } from 'discord.js'
import { arrayify, OptionType } from '../../_utils.js'
import type { WithExecute, WithOptions } from '../commands/_utils.js'
import { validateExecute, validateOptions } from '../commands/_utils.js'
import type { BasicOption } from './types.js'
import type { BaseOption, OptionContainer } from './_utils.js'
import { validateBaseOption } from './_utils.js'

export interface SubcommandProps extends BaseOption, WithExecute<CommandInteraction> {
  children?: JSX.Element | JSX.Element[]
}

export interface Subcommand extends Omit<SubcommandProps, 'children'>, Partial<WithOptions<OptionContainer<BasicOption>>> {
  type: OptionType.Subcommand
}

function validate(command: Subcommand) {
  const prefix = 'subcommand'
  validateBaseOption(prefix, command)
  validateExecute(prefix, command)
  if (command.options) {
    validateOptions(prefix, command as Required<Subcommand>)
  }
  return command
}

export function Subcommand(command: SubcommandProps): OptionContainer<Subcommand> {
  const data = validate({
    ...command,
    options: command.children && arrayify(command.children as OptionContainer<BasicOption>),
    type: OptionType.Subcommand as const,
  })

  return {
    data,
    toJSON: () => ({
      type: data.type as number,
      name: data.name,
      name_localizations: data.nameLocalizations,
      description: data.description,
      description_localizations: data.descriptionLocalizations,
      options: data.options?.map(opt => opt.toJSON()),
      required: data.required,
    }),
  }
}
