import { OptionType } from '../../utils.js'
import type { OptionContainer, OptionWithAutocomplete } from './_utils.js'
import { validateOptionWithAutocomplete } from './_utils.js'

export interface StringOptionProps extends OptionWithAutocomplete {
}

interface StringOption extends StringOptionProps {
  type: OptionType.String
}

function validate(option: StringOption) {
  validateOptionWithAutocomplete('string option', option)
  return option
}

export function StringOption(option: StringOptionProps): OptionContainer<StringOption> {
  const _option = { ...option, type: OptionType.String as const }
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
      required: data.required,
    }),
  }
}
