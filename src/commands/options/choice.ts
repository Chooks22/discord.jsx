import type {
  APIApplicationCommandOptionChoice as Choice,
  LocalizationMap,
} from 'discord-api-types/v10'
import { validateString } from '../_utils.js'

function validate(choice: ChoiceProps): ChoiceProps | never {
  validateString('choice name', choice.name, 1, 100)
  if (typeof choice.value !== 'number') {
    validateString('choice value', choice.value, 1, 100)
  }
  return choice
}

function serializeChoice(choice: ChoiceProps): Choice {
  return {
    name: choice.name,
    name_localizations: choice.localization,
    value: choice.value,
  }
}

export interface ChoiceProps<T extends string | number = string | number> {
  name: string
  localization?: LocalizationMap
  value: T
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function Choice(choice: ChoiceProps) {
  return serializeChoice(validate(choice))
}
