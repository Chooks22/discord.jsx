import type { APIOption, InteractionHandler } from '../../_utils.js'
import { arrayify, OptionType } from '../../_utils.js'
import { validateNumber } from '../commands/_utils.js'
import type { OptionContainer } from '../_utils.js'
import type { BaseOption, WithAutocomplete } from './_utils.js'
import { validateAutocomplete, validateBaseOption } from './_utils.js'

export interface IntegerOptionProps extends BaseOption, WithAutocomplete {
  minValue?: number
  maxValue?: number
}

export interface IntegerOption extends IntegerOptionProps {
  type: OptionType.Integer
}

function validate(option: Omit<IntegerOption, 'type'>) {
  const prefix = 'integer option'
  validateBaseOption(prefix, option)
  validateAutocomplete(prefix, option)

  if (option.minValue !== undefined) {
    validateNumber(`${prefix} min value`, option.minValue)
  }

  if (option.maxValue !== undefined) {
    validateNumber(`${prefix} max value`, option.maxValue)
  }

  return option
}

function serialize(data: Omit<IntegerOption, 'type'>): APIOption {
  return {
    type: OptionType.Integer as number,
    name: data.name,
    name_localizations: data.nameLocalizations,
    description: data.description,
    description_localizations: data.descriptionLocalizations,
    autocomplete: typeof data.autocomplete === 'function',
    min_value: data.minValue,
    max_value: data.maxValue,
    required: data.required,
  }
}

export function IntegerOption(option: IntegerOptionProps): OptionContainer<'Option'> {
  const data = validate({
    ...option,
    choices: option.choices && arrayify(option.choices),
  })

  return {
    *getExecute(ns, parentKey) {
      if (data.autocomplete !== undefined) {
        yield [`auto::${parentKey}:${data.name}`, data.autocomplete as InteractionHandler]
      }
    },
    toJSON: () => serialize(data),
  }
}
