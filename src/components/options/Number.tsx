import type { APIOption, InteractionHandler } from '../../_utils.js'
import { arrayify, OptionType } from '../../_utils.js'
import { validateNumber } from '../commands/_utils.js'
import type { OptionContainer } from '../_utils.js'
import type { BaseOption, WithAutocomplete } from './_utils.js'
import { validateAutocomplete, validateBaseOption } from './_utils.js'

export interface NumberOptionProps extends BaseOption, WithAutocomplete {
  minValue?: number
  maxValue?: number
}

export interface NumberOption extends NumberOptionProps {
  type: OptionType.Number
}

function validate(option: Omit<NumberOption, 'type'>) {
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

function serialize(option: Omit<NumberOption, 'type'>): APIOption {
  return {
    type: OptionType.Number as number,
    name: option.name,
    name_localizations: option.nameLocalizations,
    description: option.description,
    description_localizations: option.descriptionLocalizations,
    autocomplete: typeof option.autocomplete === 'function',
    min_value: option.minValue,
    max_value: option.maxValue,
    required: true,
  }
}

export function NumberOption(option: NumberOptionProps): OptionContainer<'Option'> {
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
