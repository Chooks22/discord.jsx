import type { APIOption } from '../../_utils.js'
import { arrayify, OptionType } from '../../_utils.js'
import { invalid } from '../commands/_utils.js'
import type { OptionContainer } from '../_utils.js'
import type { BaseOption } from './_utils.js'
import { validateBaseOption } from './_utils.js'

export interface ChannelOptionProps extends BaseOption {
  channelTypes?: number[]
}

export interface ChannelOption extends ChannelOptionProps {
  type: OptionType.Channel
}

function validate(option: Omit<ChannelOption, 'type'>) {
  validateBaseOption('channel option', option)

  if (option.channelTypes !== undefined) {
    if (!Array.isArray(option.channelTypes)) {
      invalid(`channel option channel types must be an array! received: ${typeof option.channelTypes}`)
    }
    // valid channel types: 0-5, 10-15
    const invalidType = option.channelTypes.find(type => type < 0 || type > 5 && type < 10 || type > 15)
    if (invalidType !== undefined) {
      invalid(`channel option channel types got invalid type! received: ${invalidType}`)
    }
  }

  return option
}

function serialize(option: Omit<ChannelOption, 'type'>): APIOption {
  return {
    type: OptionType.Channel as number,
    name: option.name,
    name_localizations: option.nameLocalizations,
    description: option.description,
    description_localizations: option.descriptionLocalizations,
    channel_types: option.channelTypes,
    required: option.required,
  }
}

export function ChannelOption(option: ChannelOptionProps): OptionContainer<'Option'> {
  const data = validate({
    ...option,
    channelTypes: option.channelTypes && arrayify(option.channelTypes),
  })

  return {
    *getExecute() {
      // no execute
    },
    toJSON: () => serialize(data),
  }
}
