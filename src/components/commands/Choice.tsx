import type { APIChoice } from '../../_utils.js'
import type { WithName } from './_utils.js'
import { validateLocales, validateString } from './_utils.js'

function validate(choice: ChoiceProps): ChoiceProps | never {
  validateString('choice name', choice.name, 1, 100)

  if (choice.nameLocalizations !== undefined) {
    validateLocales('choice', choice.nameLocalizations, (prefix, locale) => validateString(prefix, locale, 1, 100))
  }

  if (typeof choice.value !== 'number') {
    validateString('choice value', choice.value, 1, 100)
  }

  return choice
}

function serialize(choice: ChoiceProps): APIChoice {
  return {
    name: choice.name,
    name_localizations: choice.nameLocalizations,
    value: choice.value,
  }
}

export interface ChoiceProps<T extends string | number = string | number> extends WithName {
  value: T
}

export function Choice(choice: ChoiceProps): APIChoice {
  return serialize(validate(choice))
}
