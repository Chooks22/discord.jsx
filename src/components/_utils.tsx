import type { APICommand, APICommandOption, APIOption, InteractionHandler } from '../_utils.js'

export type ExecuteGetter = Generator<readonly [key: string, onExecute: InteractionHandler], void, undefined>

export interface CommandContainer {
  getExecute: () => ExecuteGetter
  toJSON: () => APICommand
}

export interface OptionContainer<T extends 'Option' | 'Subcommand'> {
  getExecute: (ns: string, parentKey: string) => ExecuteGetter
  toJSON: () => T extends 'Option' ? APIOption : T extends 'Subcommand' ? APICommandOption : never
}
