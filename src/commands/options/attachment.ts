import { OptionType } from '../../utils.js'
import type { BaseOption, OptionContainer } from './_utils.js'
import { validateBaseOption } from './_utils.js'

export interface AttachmentOptionProps extends BaseOption {
}

export interface AttachmentOption extends AttachmentOptionProps {
  type: OptionType.Attachment
}

function validate(option: AttachmentOption) {
  validateBaseOption('attachment option', option)
  return option
}

export function AttachmentOption(option: AttachmentOptionProps): OptionContainer<AttachmentOption> {
  const _option = { ...option, type: OptionType.Attachment as const }
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
