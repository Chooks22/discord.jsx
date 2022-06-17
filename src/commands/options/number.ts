import { arrayify, OptionType } from '../../utils.js'
import { validateNumber } from '../_utils.js'
import type { BaseOption, OptionContainer, WithAutocomplete } from './_utils.js'
import { validateAutocomplete, validateBaseOption } from './_utils.js'

export interface NumberOptionProps extends BaseOption, WithAutocomplete {
  minValue?: number
  maxValue?: number
}

export interface NumberOption extends NumberOptionProps {
  type: OptionType.Number
}

function validate(option: NumberOption) {
  const prefix = 'number option'
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

export function NumberOption(option: NumberOptionProps): OptionContainer<NumberOption> {
  const _option = { ...option, type: OptionType.Number as const }
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
      required: true,
    }),
  }
}
