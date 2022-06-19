import type { APIOption } from '../../_utils.js'
import { OptionType } from '../../_utils.js'
import type { OptionContainer } from '../_utils.js'
import type { BaseOption } from './_utils.js'
import { validateBaseOption } from './_utils.js'

export interface AttachmentOptionProps extends BaseOption {
}

export interface AttachmentOption extends AttachmentOptionProps {
  type: OptionType.Attachment
}

function validate(option: Omit<AttachmentOption, 'type'>) {
  validateBaseOption('attachment option', option)
  return option
}

function serialize(option: Omit<AttachmentOption, 'type'>): APIOption {
  return {
    type: OptionType.Attachment as number,
    name: option.name,
    name_localizations: option.nameLocalizations,
    description: option.description,
    description_localizations: option.descriptionLocalizations,
    required: option.required,
  }
}

export function AttachmentOption(props: AttachmentOptionProps): OptionContainer<'Option'> {
  const data = validate(props)
  return {
    *getExecute() {
      // no execute
    },
    toJSON: () => serialize(data),
  }
}
