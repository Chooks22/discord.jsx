import type { LocalizationMap, RESTPostAPIChatInputApplicationCommandsJSONBody as ChatInput } from 'discord-api-types/v10'
import type { PermissionResolvable } from 'discord.js'
import type { CommandType } from '../utils.js'

export interface BaseCommand {
  name: string
  nameLocalizations?: LocalizationMap
  defaultMemberPermissions?: PermissionResolvable
  dmPermission?: boolean
}

export interface CommandWithDescription extends BaseCommand {
  description: string
  descriptionLocalizations?: LocalizationMap
}

export interface BaseCommandWithType extends BaseCommand {
  type: CommandType
}

export interface CommandContainer<T extends BaseCommand> {
  data: T
  toJSON: () => ChatInput
}

export function invalid(message: string): never {
  throw new Error(message)
}

export function validateString(prefix: string, string: string, min: number, max: number): void | never {
  const strType = typeof string
  if (strType !== 'string') {
    invalid(`${prefix} is not a string! received: ${strType}`)
  }

  const strLen = string.length
  if (strLen < min) {
    invalid(`${prefix} is too short! received: ${strLen}`)
  }

  if (strLen > max) {
    invalid(`${prefix} is too long! received: ${strLen}`)
  }
}

export function validateNumber(prefix: string, number: number): void | never {
  const numType = typeof number
  if (numType !== 'number') {
    invalid(`${prefix} is not a number! received: ${numType}`)
  }
}
