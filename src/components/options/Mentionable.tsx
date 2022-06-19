import { OptionType } from '../../_utils.js'
import type { OptionContainer } from '../_utils.js'
import type { BaseOption } from './_utils.js'
import { validateBaseOption } from './_utils.js'

export interface MentionableOptionProps extends BaseOption {
}

export interface MentionableOption extends MentionableOptionProps {
  type: OptionType.Mentionable
}

function validate(option: Omit<MentionableOption, 'type'>) {
  validateBaseOption('mentionable option', option)
  return option
}

function serialize(option: Omit<MentionableOption, 'type'>) {
  return {
    type: OptionType.Mentionable as number,
    name: option.name,
    name_localizations: option.nameLocalizations,
    description: option.description,
    description_localizations: option.descriptionLocalizations,
    required: option.required,
  }
}

export function MentionableOption(option: MentionableOptionProps): OptionContainer<'Option'> {
  const data = validate(option)
  return {
    *getExecute() {
      // no execute
    },
    toJSON: () => serialize(data),
  }
}
