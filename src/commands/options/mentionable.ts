import { OptionType } from '../../utils.js'
import type { BaseOption, OptionContainer } from './_utils.js'
import { validateBaseOption } from './_utils.js'

export interface MentionableOptionProps extends BaseOption {
}

interface MentionableOption extends MentionableOptionProps {
  type: OptionType.Mentionable
}

function validate(option: MentionableOption) {
  validateBaseOption('mentionable option', option)
  return option
}

export function MentionableOption(option: MentionableOptionProps): OptionContainer<MentionableOption> {
  const _option = { ...option, type: OptionType.Mentionable as const }
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
