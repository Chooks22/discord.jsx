import { OptionType } from '../../utils.js'
import type { BaseOption, OptionContainer } from './_utils.js'
import { validateBaseOption } from './_utils.js'

export interface UserOptionProps extends BaseOption {
}

interface UserOption extends UserOptionProps {
  type: OptionType.User
}

function validate(option: UserOption) {
  validateBaseOption('user option', option)
  return option
}

export function UserOption(option: UserOptionProps): OptionContainer<UserOption> {
  const _option = { ...option, type: OptionType.User as const }
  const data = validate(_option)
  return {
    data,
    toJSON: () => ({
      type: data.type as number,
      name: data.name,
      name_localizations: data.nameLocalizations,
      description: data.description,
      description_localizations: data.descriptionLocalizations,
      required: data.required,
    }),
  }
}
