import { OptionType } from '../../utils.js'
import { validateNumber } from '../_utils.js'
import type { OptionContainer, OptionWithAutocomplete } from './_utils.js'
import { validateOptionWithAutocomplete } from './_utils.js'

export interface NumberOptionProps extends OptionWithAutocomplete {
  minValue?: number
  maxValue?: number
}

interface NumberOption extends NumberOptionProps {
  type: OptionType.Number
}

function validate(option: NumberOption) {
  validateOptionWithAutocomplete('number option', option)
  if (option.minValue !== undefined) {
    validateNumber('number option min value', option.minValue)
  }
  if (option.maxValue !== undefined) {
    validateNumber('number option max value', option.maxValue)
  }
  return option
}

export function NumberOption(option: NumberOptionProps): OptionContainer<NumberOption> {
  const _option = { ...option, type: OptionType.Number as const }
  if (option.choices !== undefined) {
    _option.choices = [option.choices].flat()
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
