import type { APIOption } from '../../_utils.js'
import { OptionType } from '../../_utils.js'
import type { OptionContainer } from '../_utils.js'
import type { BaseOption } from './_utils.js'
import { validateBaseOption } from './_utils.js'

export interface BooleanOptionProps extends BaseOption {
}

export interface BooleanOption extends BooleanOptionProps {
  type: OptionType.Boolean
}

function validate(option: Omit<BooleanOption, 'type'>) {
  validateBaseOption('boolean option', option)
  return option
}

function serialize(option: Omit<BooleanOption, 'type'>): APIOption {
  return {
    type: OptionType.Boolean as number,
    name: option.name,
    name_localizations: option.nameLocalizations,
    description: option.description,
    description_localizations: option.descriptionLocalizations,
    required: option.required,
  }
}

export function BooleanOption(option: BooleanOptionProps): OptionContainer<'Option'> {
  const data = validate(option)
  return {
    *getExecute() {
      // no execute
    },
    toJSON: () => serialize(data),
  }
}
