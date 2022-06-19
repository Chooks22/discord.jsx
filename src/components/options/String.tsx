import type { APIOption, InteractionHandler } from '../../_utils.js'
import { arrayify, OptionType } from '../../_utils.js'
import type { OptionContainer } from '../_utils.js'
import type { BaseOption, WithAutocomplete } from './_utils.js'
import { validateAutocomplete, validateBaseOption } from './_utils.js'

export interface StringOptionProps extends BaseOption, WithAutocomplete {
}

export interface StringOption extends StringOptionProps {
  type: OptionType.String
}

function validate(option: Omit<StringOption, 'type'>) {
  const prefix = 'string option'
  validateBaseOption(prefix, option)
  validateAutocomplete(prefix, option)
  return option
}

function serialize(data: Omit<StringOption, 'type'>): APIOption {
  return {
    type: OptionType.String as number,
    name: data.name,
    name_localizations: data.nameLocalizations,
    description: data.description,
    description_localizations: data.descriptionLocalizations,
    autocomplete: typeof data.autocomplete === 'function',
    required: data.required,
  }
}

export function StringOption(props: StringOptionProps): OptionContainer<'Option'> {
  const data = validate({
    ...props,
    choices: props.choices && arrayify(props.choices),
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
