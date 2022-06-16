import type { RESTPostAPIApplicationCommandsJSONBody as ChatInput } from 'discord-api-types/v10'
import type { Client, Interaction } from 'discord.js'
import type { InteractionHandler } from '../utils.js'
import { arrayify, CommandType } from '../utils.js'
import type { BaseCommandWithType } from './_utils.js'

export * from './message.js'
export * from './options/index.js'
export * from './slash-sub.js'
export * from './slash.js'
export * from './user.js'

function createKey(ns: string, name: string, ...children: (string | null)[]) {
  let key = `${ns}::${name}`
  for (let i = 0, n = children.length; i < n; i++) {
    if (children[i] !== null) {
      key += `:${children[i]}`
    }
  }
  return key
}

const typeToNamespace = {
  [CommandType.ChatInput]: 'cmd',
  [CommandType.User]: 'usr',
  [CommandType.Message]: 'msg',
}

class CommandStore {
  private store = new Map<string, InteractionHandler>()
  public set(command: BaseCommandWithType): this {
    if ('onExecute' in command) {
      const key = createKey(typeToNamespace[command.type], command.name)
      this.store.set(key, (command as unknown as { onExecute: InteractionHandler }).onExecute)
    }

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

interface CommandList {
  children: {
    data: BaseCommandWithType
    toJSON: () => ChatInput
  }
}

// @ts-ignore users see jsx
export function CommandList(commands: CommandListProps): JSX.Element
export function CommandList(props: CommandList): JSX.Element {
  const options = arrayify(props.children)

  return (client?: Client): unknown => {
    if (client === undefined) {
      return options.map(opt => opt.toJSON())
    }

    const commands = new CommandStore()
    for (const option of options) {
      commands.set(option.data)
    }

    client.on('interactionCreate', async interaction => {
      const handler = commands.get(interaction)
      if (handler === null) {
        return
      }

      try {
        await handler(interaction)
      } catch (error) {
        console.error(error)
        console.error('failed to run handler!')
      }
    })
  }
}
