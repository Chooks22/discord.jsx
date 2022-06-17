import type {
  APIApplicationCommandBasicOption as Option,
  APIApplicationCommandOptionChoice as Choice,
} from 'discord-api-types/v10'
import type { AutocompleteInteraction } from 'discord.js'
import type { InteractionHandler } from '../../utils.js'
import type { WithDescription, WithName } from '../_utils.js'
import { invalid, validateDescription, validateName } from '../_utils.js'

export interface WithAutocomplete {
  autocomplete?: InteractionHandler<AutocompleteInteraction>
  choices?: Choice[]
}

export interface BaseOption extends WithName, WithDescription {
  required?: boolean
}

export interface BaseOptionWithType extends BaseOption {
  type: number
}

export interface OptionContainer<T extends BaseOption = BaseOption> {
  data: T
  toJSON: () => Option
}

export function validateBaseOption(prefix: string, option: BaseOption): void | never {
  validateName(prefix, option)
  validateDescription(prefix, option)

  if (option.required !== undefined) {
    const reqType = typeof option.required
    if (reqType !== 'boolean') {
      invalid(`${prefix} required is not a boolean! received: ${reqType}`)
    }
  }
}

export function validateAutocomplete(prefix: string, props: WithAutocomplete): void | never {
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
