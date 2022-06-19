import type { APIOption } from '../../_utils.js'
import { OptionType } from '../../_utils.js'
import type { OptionContainer } from '../_utils.js'
import type { BaseOption } from './_utils.js'
import { validateBaseOption } from './_utils.js'

export interface UserOptionProps extends BaseOption {
}

export interface UserOption extends UserOptionProps {
  type: OptionType.User
}

function validate(option: Omit<UserOption, 'type'>) {
  validateBaseOption('user option', option)
  return option
}

function serialize(option: Omit<UserOption, 'type'>): APIOption {
  return {
    type: OptionType.User as number,
    name: option.name,
    name_localizations: option.nameLocalizations,
    description: option.description,
    description_localizations: option.descriptionLocalizations,
    required: option.required,
  }
}

export function UserOption(props: UserOptionProps): OptionContainer<'Option'> {
  const data = validate(props)
  return {
    *getExecute() {
      // no execute
    },
    toJSON: () => serialize(data),
  }
}
