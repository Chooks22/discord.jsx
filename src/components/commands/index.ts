import type { Client, Interaction } from 'discord.js'
import type { InteractionHandler } from '../../_utils.js'
import { arrayify, CommandType } from '../../_utils.js'
import { isCustomResponse } from './responses/_hander.js'
import type { Command } from './types.js'
import type { CommandContainer } from './_utils.js'

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

const typeToNamespace = {
  [CommandType.ChatInput]: 'cmd',
  [CommandType.User]: 'usr',
  [CommandType.Message]: 'msg',
}

class CommandStore {
  private store = new Map<string, InteractionHandler>()
  public set(command: Command): this {
    const ns = typeToNamespace[command.type]

    if ('onExecute' in command) {
      const key = createKey(ns, command.name)
      this.store.set(key, command.onExecute as InteractionHandler)
      return this
    }

    if (Array.isArray(command.options)) {
      for (const option of command.options) {
        if ('onExecute' in option.data) {
          const subcommand = option.data
          const key = createKey(ns, command.name, subcommand.name)
          this.store.set(key, subcommand.onExecute as InteractionHandler)
        } else {
          const group = option.data
          for (const { data: subcommand } of group.options) {
            const key = createKey(ns, command.name, group.name, subcommand.name)
            this.store.set(key, subcommand.onExecute as InteractionHandler)
          }
        }
      }
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
  children: CommandContainer<Command>
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
