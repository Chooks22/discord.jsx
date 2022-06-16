import { OptionType } from '../../utils.js'
import { validateNumber } from '../_utils.js'
import type { OptionContainer, OptionWithAutocomplete } from './_utils.js'
import { validateOptionWithAutocomplete } from './_utils.js'

export interface IntegerOptionProps extends OptionWithAutocomplete {
  minValue?: number
  maxValue?: number
}

interface IntegerOption extends IntegerOptionProps {
  type: OptionType.Integer
}

function validate(option: IntegerOption) {
  validateOptionWithAutocomplete('integer option', option)
  if (option.minValue !== undefined) {
    validateNumber('integer option min value', option.minValue)
  }
  if (option.maxValue !== undefined) {
    validateNumber('integer option max value', option.maxValue)
  }
  return option
}

export function IntegerOption(option: IntegerOptionProps): OptionContainer<IntegerOption> {
  const _option = { ...option, type: OptionType.Integer as const }
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
      required: data.required,
    }),
  }
}
