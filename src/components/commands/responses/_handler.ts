import type { BaseCommandInteraction } from 'discord.js'
import type { InteractionHandler, OnError } from '../../../_utils.js'

export const CustomResponse = Symbol('custom response')
export interface CustomPayload {
  $$type: typeof CustomResponse
  handle: InteractionHandler<BaseCommandInteraction>
  onError: OnError | undefined
}

export function isCustomResponse(res: unknown): res is CustomPayload {
  if (res === null || typeof res !== 'object') {
    return false
  }

  return (res as CustomPayload).$$type === CustomResponse
}
