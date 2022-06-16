import { OptionType } from '../../utils.js'
import type { BaseOption, OptionContainer } from './_utils.js'
import { validateBaseOption } from './_utils.js'

export interface BooleanOptionProps extends BaseOption {
}

interface BooleanOption extends BooleanOptionProps {
  type: OptionType.Boolean
}

function validate(option: BooleanOption) {
  validateBaseOption('boolean option', option)
  return option
}

export function BooleanOption(option: BooleanOptionProps): OptionContainer<BooleanOption> {
  const _option = { ...option, type: OptionType.Boolean as const }
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
