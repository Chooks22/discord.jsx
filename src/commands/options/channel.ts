import { OptionType } from '../../utils.js'
import { invalid } from '../_utils.js'
import type { BaseOption, OptionContainer } from './_utils.js'
import { validateBaseOption } from './_utils.js'

export interface ChannelOptionProps extends BaseOption {
  channelTypes?: number[]
}

interface ChannelOption extends ChannelOptionProps {
  type: OptionType.Channel
}

function validate(option: ChannelOption) {
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

export function ChannelOption(option: ChannelOptionProps): OptionContainer<ChannelOption> {
  const _option = { ...option, type: OptionType.Channel as const }
  if (option.channelTypes !== undefined) {
    _option.channelTypes = [option.channelTypes].flat()
  }
  const data = validate(_option)
  return {
    data,
    toJSON: () => ({
      type: data.type as number,
      name: data.name,
      name_localizations: data.nameLocalizations,
      description: data.description,
      description_localizations: data.descriptionLocalizations,
      channel_types: data.channelTypes,
      required: data.required,
    }),
  }
}
