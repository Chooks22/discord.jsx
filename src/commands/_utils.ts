import type { LocalizationMap, RESTPostAPIChatInputApplicationCommandsJSONBody as ChatInput } from 'discord-api-types/v10'
import type { Interaction, PermissionResolvable } from 'discord.js'
import { Permissions } from 'discord.js'
import type { CommandType, InteractionHandler } from '../utils.js'

export interface WithName {
  name: string
  nameLocalizations?: LocalizationMap
}

export interface WithDescription {
  description: string
  descriptionLocalizations?: LocalizationMap
}

export interface WithExecute<T extends Interaction = Interaction> {
  onExecute: InteractionHandler<T>
}

export interface BaseCommand extends WithName {
  defaultMemberPermissions?: PermissionResolvable
  dmPermission?: boolean
}

export interface BaseCommandWithType extends BaseCommand {
  type: CommandType
}

export interface CommandContainer<T extends BaseCommandWithType> {
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

const NAME_REGEX = /^[-_\p{L}\p{N}\p{sc=Deva}\p{sc=Thai}]{1,32}$/u
function validateDiscordName(prefix: string, name: string) {
  const nameType = typeof name
  if (nameType !== 'string') {
    invalid(`${prefix} name is not a string! received: ${nameType}`)
  }

  if (name.toLocaleLowerCase() !== name) {
    invalid(`${prefix} name cannot have uppercase letters! received: ${name}`)
  }

  if (!NAME_REGEX.test(name)) {
    invalid(`${prefix} name does not match the pattern! received: ${name}`)
  }
}

export function validateName(prefix: string, obj: WithName): void | never {
  validateDiscordName(prefix, obj.name)

  const locales = obj.nameLocalizations
  for (const key in locales) {
    if (!Object.hasOwn(locales, key)) {
      continue
    }
    const localization = locales[key as keyof LocalizationMap]
    if (localization !== null) {
      validateDiscordName(`${prefix} name locale ${key}`, localization!)
    }
  }
}

export function validateLocales(
  prefix: string,
  locales: LocalizationMap,
  validate: (prefix: string, locale: string) => void,
): void | never {
  for (const key in locales) {
    if (!Object.hasOwn(locales, key)) {
      continue
    }

    const localization = locales[key as keyof LocalizationMap]
    if (localization !== null) {
      validate(`${prefix} name locale ${key}`, localization!)
    }
  }
}

export function validateBaseCommand(prefix: string, obj: BaseCommand): void | never {
  validateName(prefix, obj)

  if (obj.defaultMemberPermissions !== undefined) {
    const perms = obj.defaultMemberPermissions
    try {
      Permissions.resolve(perms)
    } catch {
      invalid(`${prefix} default member permission is not resolvable! received: ${JSON.stringify(perms)}`)
    }
  }

  if ('dmPermission' in obj) {
    const dmPermType = typeof obj.dmPermission
    if (dmPermType !== 'boolean') {
      invalid(`${prefix} dmPermission is not a boolean! received: ${dmPermType}`)
    }
  }
}

export function validateDescription(prefix: string, obj: WithDescription): void | never {
  validateString(`${prefix} description`, obj.description, 1, 100)

  if (obj.descriptionLocalizations !== undefined) {
    validateLocales(
      `${prefix} description locales`,
      obj.descriptionLocalizations,
      (name, locale) => validateString(name, locale, 1, 100),
    )
  }
}

export function validateExecute(prefix: string, obj: WithExecute<never>): void | never {
  const execType = typeof obj.onExecute
  if (execType !== 'function') {
    invalid(`${prefix} onExecute is not a function! received: ${execType}`)
  }
}
