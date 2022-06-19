import type { APICommandOption } from '../../_utils.js'
import { arrayify, OptionType } from '../../_utils.js'
import type { WithOptions } from '../commands/_utils.js'
import { validateOptions } from '../commands/_utils.js'
import type { OptionContainer } from '../_utils.js'
import type { BaseOption } from './_utils.js'
import { validateBaseOption } from './_utils.js'

export interface SubcommandGroupProps extends BaseOption {
  children: JSX.Element | JSX.Element[]
}

export interface SubcommandGroup extends Omit<SubcommandGroupProps, 'children'>, WithOptions<OptionContainer<'Option'>> {
  type: OptionType.SubcommandGroup
}

function validate(command: Omit<SubcommandGroup, 'type'>) {
  const prefix = 'subcommand group'
  validateBaseOption(prefix, command)
  validateOptions(prefix, command)
  return command
}

function serialize(data: Omit<SubcommandGroup, 'type'>): APICommandOption {
  return {
    type: OptionType.SubcommandGroup as number,
    name: data.name,
    name_localizations: data.nameLocalizations,
    description: data.description,
    description_localizations: data.descriptionLocalizations,
    options: data.options.map(opt => opt.toJSON()),
    required: data.required,
  }
}

export function SubcommandGroup(option: SubcommandGroupProps): OptionContainer<'Subcommand'> {
  const data = validate({
    ...option,
    options: arrayify(option.children as OptionContainer<'Option'>),
  })

  return {
    *getExecute(ns, parentKey) {
      const key = `${parentKey}:${data.name}`
      for (const subcommand of data.options) {
        yield* subcommand.getExecute(ns, key)
      }
    },
    toJSON: () => serialize(data),
  }
}
