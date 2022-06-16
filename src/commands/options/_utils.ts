import type {
  APIApplicationCommandOptionChoice as Choice,
  APIApplicationCommandBasicOption as Option,
  LocalizationMap,
} from 'discord-api-types/v10'
import type { AutocompleteInteraction } from 'discord.js'
import type { InteractionHandler } from '../../utils.js'
import { invalid, validateString } from '../_utils.js'

export interface BaseOption {
  name: string
  nameLocalizations?: LocalizationMap
  description: string
  descriptionLocalizations?: LocalizationMap
  required?: boolean
}

export interface BaseOptionWithType extends BaseOption {
  type: number
}

export interface OptionContainer<T extends BaseOption = BaseOption> {
  data: T
  toJSON: () => Option
}

export interface OptionWithAutocomplete extends BaseOption {
  autocomplete?: InteractionHandler<AutocompleteInteraction>
  choices?: Choice[]
}

export function validateLocales(prefix: string, locales: LocalizationMap, min: number, max: number): void | never {
  for (const key in locales) {
    if (Object.hasOwn(locales, key)) {
      const localization = locales[key as keyof LocalizationMap]
      if (localization !== null) {
        validateString(`${prefix} ${key}`, localization!, min, max)
      }
    }
  }
}

export function validateBaseOption(prefix: string, option: BaseOption): void | never {
  validateString(`${prefix} name`, option.name, 1, 32)
  validateString(`${prefix} description`, option.description, 1, 100)

  if ('required' in option) {
    const reqType = typeof option
    if (reqType !== 'boolean') {
      invalid(`${prefix} required is not a boolean! received: ${reqType}`)
    }
  }

  if (option.nameLocalizations) {
    validateLocales(`${prefix} name locales`, option.nameLocalizations, 1, 32)
  }

  if (option.descriptionLocalizations) {
    validateLocales(`${prefix} description locales`, option.descriptionLocalizations, 1, 100)
  }
}

export function validateOptionWithAutocomplete(prefix: string, props: OptionWithAutocomplete): void | never {
  if (props.autocomplete === undefined && props.choices === undefined) {
    return
  }

  const fnType = typeof props.autocomplete
  if (fnType === 'function') {
    if (props.choices !== undefined) {
      invalid(`${prefix} autocomplete cannot have choices!`)
    }
  } else if (fnType !== 'undefined') {
    invalid(`${prefix} autocomplete is not a function! received: ${fnType}`)
  }
}
