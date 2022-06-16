import { OptionType } from '../../utils.js'
import type { BaseOption } from './_utils.js'
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

export function MentionableOption(option: MentionableOptionProps): MentionableOption {
  const _option = { ...option, type: OptionType.Mentionable as const }
  return validate(_option)
}
