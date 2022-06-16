import { OptionType } from '../../utils.js'
import type { BaseOption, OptionContainer } from './_utils.js'
import { validateBaseOption } from './_utils.js'

export interface RoleOptionProps extends BaseOption {
}

interface RoleOption extends RoleOptionProps {
  type: OptionType.Role
}

function validate(option: RoleOption) {
  validateBaseOption('role option', option)
  return option
}

export function RoleOption(option: RoleOptionProps): OptionContainer<RoleOption> {
  const _option = { ...option, type: OptionType.Role as const }
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