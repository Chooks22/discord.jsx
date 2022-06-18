import { arrayify, OptionType } from '../../_utils.js'
import { validateNumber } from '../commands/_utils.js'
import type { BaseOption, OptionContainer, WithAutocomplete } from './_utils.js'
import { validateAutocomplete, validateBaseOption } from './_utils.js'

export interface IntegerOptionProps extends BaseOption, WithAutocomplete {
  minValue?: number
  maxValue?: number
}

export interface IntegerOption extends IntegerOptionProps {
  type: OptionType.Integer
}

function validate(option: IntegerOption) {
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

export function IntegerOption(option: IntegerOptionProps): OptionContainer<IntegerOption> {
  const _option = { ...option, type: OptionType.Integer as const }
  if (option.choices !== undefined) {
    _option.choices = arrayify(option.choices)
  }
  const data = validate(_option)
  return {
    data,
    toJSON: () => ({
      type: data.type as number,
      name: data.name,
      name_localizations: data.nameLocalizations,
      description: data.description,
      description_localizations: data.descriptionLocalizations,
      autocomplete: typeof data.autocomplete === 'function',
      min_value: data.minValue,
      max_value: data.maxValue,
      required: data.required,
    }),
  }
}
