import { arrayify, OptionType } from '../../utils.js'
import type { WithOptions } from '../_utils.js'
import { validateOptions } from '../_utils.js'
import type { Subcommand } from './subcommand.js'
import type { BaseOption, OptionContainer } from './_utils.js'
import { validateBaseOption } from './_utils.js'

export interface SubcommandGroupProps extends BaseOption {
  children: JSX.Element | JSX.Element[]
}

export interface SubcommandGroup extends Omit<SubcommandGroupProps, 'children'>, WithOptions<OptionContainer<Subcommand>> {
  type: OptionType.SubcommandGroup
}

function validate(command: SubcommandGroup) {
  const prefix = 'subcommand group'
  validateBaseOption(prefix, command)
  validateOptions(prefix, command)
  return command
}

export function SubcommandGroup(option: SubcommandGroupProps): OptionContainer<SubcommandGroup> {
  const { children, ..._option } = option
  const data = validate({
    ..._option,
    options: arrayify(children as OptionContainer<Subcommand>),
    type: OptionType.SubcommandGroup,
  })

  return {
    data,
    toJSON: () => ({
      type: data.type as number,
      name: data.name,
      name_localizations: data.nameLocalizations,
      description: data.description,
      description_localizations: data.descriptionLocalizations,
      options: data.options.map(opt => opt.toJSON()),
      required: data.required,
    }),
  }
}
