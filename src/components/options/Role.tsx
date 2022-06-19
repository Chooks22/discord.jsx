import type { APIOption } from '../../_utils.js'
import { OptionType } from '../../_utils.js'
import type { OptionContainer } from '../_utils.js'
import type { BaseOption } from './_utils.js'
import { validateBaseOption } from './_utils.js'

export interface RoleOptionProps extends BaseOption {
}

export interface RoleOption extends RoleOptionProps {
  type: OptionType.Role
}

function validate(option: Omit<RoleOption, 'type'>) {
  validateBaseOption('role option', option)
  return option
}

function serialize(option: Omit<RoleOption, 'type'>): APIOption {
  return {
    type: OptionType.Role as number,
    name: option.name,
    name_localizations: option.nameLocalizations,
    description: option.description,
    description_localizations: option.descriptionLocalizations,
    required: option.required,
  }
}

export function RoleOption(option: RoleOptionProps): OptionContainer<'Option'> {
  const data = validate(option)
  return {
    *getExecute() {
      // no execute
    },
    toJSON: () => serialize(data),
  }
}
