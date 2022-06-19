import type { AwaitModalSubmitOptions, Modal, ModalSubmitInteraction } from 'discord.js'
import type { InteractionHandler, OnError } from '../../../_utils.js'
import type { CustomPayload } from './_hander.js'
import { CustomResponse } from './_hander.js'

export interface ShowModalProps extends Omit<AwaitModalSubmitOptions<ModalSubmitInteraction>, 'time'> {
  time?: number
  onError?: OnError
  onSubmit?: InteractionHandler<ModalSubmitInteraction>
  children: Modal | JSX.Element
}

export function ShowModal(props: ShowModalProps): CustomPayload {
  return {
    $$type: CustomResponse,
    onError: props.onError,
    handle: async interaction => {
      const { children, onSubmit, ...opts } = props
      await interaction.showModal(children as Modal)

      if (onSubmit) {
        const res = await interaction.awaitModalSubmit(opts as AwaitModalSubmitOptions<ModalSubmitInteraction>)
        await onSubmit(res)
      }
    },
  }
}
