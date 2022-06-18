import type { Awaitable, Interaction, PermissionResolvable } from 'discord.js'
import { Permissions } from 'discord.js'

export type Listener<T extends unknown[] = unknown[]> = (...args: T) => Awaitable<void>
export type InteractionHandler<T extends Interaction = Interaction> = Listener<[interaction: T]>

export type JSXString = string | number | boolean | (string | number | boolean | undefined | null)[]

export const enum CommandType {
  ChatInput = 1,
  User = 2,
  Message = 3,
}

export const enum OptionType {
  Subcommand = 1,
  SubcommandGroup = 2,
  String = 3,
  Integer = 4,
  Boolean = 5,
  User = 6,
  Channel = 7,
  Role = 8,
  Mentionable = 9,
  Number = 10,
  Attachment = 11,
}

export function arrayify<T>(value: undefined | T | T[]): T[] {
  return value
    ? Array.isArray(value)
      ? value
      : [value]
    : []
}

export function permissionify(value: PermissionResolvable | undefined): undefined | string {
  if (value === undefined) {
    return undefined
  }
  return Permissions.resolve(value).toString()
}

export function normalize(content: JSXString): string {
  return Array.isArray(content)
    ? content
      .filter(v => v !== undefined && v !== null && typeof v !== 'boolean')
      .join('')
    : content.toString()
}
