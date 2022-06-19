import type { Client, Interaction } from 'discord.js'
import type { InteractionHandler } from '../../_utils.js'
import { arrayify } from '../../_utils.js'
import type { CommandContainer } from '../_utils.js'
import { isCustomResponse } from './responses/_handler.js'

export * from './Choice.js'
export * from './Command.js'
export * from './Message.js'
export * from './responses/index.js'
export * from './Subcommand.js'
export * from './types.js'
export * from './User.js'

function createKey(ns: string, name: string, ...children: (string | null)[]) {
  let key = `${ns}::${name}`
  for (let i = 0, n = children.length; i < n; i++) {
    if (children[i] !== null) {
      key += `:${children[i]}`
    }
  }
  return key
}

class CommandStore {
  private store = new Map<string, InteractionHandler>()
  public set(key: string, value: InteractionHandler): this {
    this.store.set(key, value)
    return this
  }
  public get(interaction: Interaction): InteractionHandler | null {
    if (interaction.isCommand()) {
      const key = createKey(
        'cmd',
        interaction.commandName,
        interaction.options.getSubcommandGroup(false),
        interaction.options.getSubcommand(false),
      )
      return this.store.get(key) ?? null
    }

    if (interaction.isMessageContextMenu()) {
      const key = createKey('msg', interaction.commandName)
      return this.store.get(key) ?? null
    }

    if (interaction.isUserContextMenu()) {
      const key = createKey('usr', interaction.commandName)
      return this.store.get(key) ?? null
    }

    if (interaction.isAutocomplete()) {
      const key = createKey(
        'auto',
        interaction.commandName,
        interaction.options.getSubcommandGroup(false),
        interaction.options.getSubcommand(false),
        interaction.options.getFocused(true).name,
      )
      return this.store.get(key) ?? null
    }

    return null
  }
}

export interface CommandListProps {
  children: JSX.Element | JSX.Element[]
}

export function CommandList(props: CommandListProps): JSX.Element {
  const options = arrayify(props.children as CommandContainer)

  return (client?: Client): unknown => {
    if (client === undefined) {
      return options.map(opt => opt.toJSON())
    }

    const commands = new CommandStore()
    for (const option of options) {
      for (const [key, onExecute] of option.getExecute()) {
        commands.set(key, onExecute)
      }
    }

    client.on('interactionCreate', async interaction => {
      const handler = commands.get(interaction)
      if (handler === null) {
        return
      }

      try {
        const res = await handler(interaction)
        if (!interaction.isApplicationCommand() || !isCustomResponse(res)) {
          return
        }

        try {
          await res.handle(interaction)
        } catch (error) {
          if (res.onError) {
            await res.onError(error)
          } else {
            throw error
          }
        }
      } catch (error) {
        console.error(error)
        console.error('failed to run handler!')
      }
    })
  }
}
