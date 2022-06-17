// eslint-disable-next-line
/// <reference path="../jsx.d.ts" />
import type { RESTPostAPIChatInputApplicationCommandsJSONBody as ChatInput } from 'discord-api-types/v10.js'
import type { Client } from 'discord.js'
import fetch from 'node-fetch'

export * from './client.js'
export * from './commands/index.js'
export * from './components/index.js'

function getAppIdFromToken(token: string): string {
  const b64id = token.slice(0, token.indexOf('.'))
  const buf = Buffer.from(b64id, 'base64')
  return buf.toString()
}

async function login(client: Client, token?: string): Promise<void> {
  await client.login(token)
}

async function register(commands: () => ChatInput[], token: string, guildId?: string): Promise<void> {
  const appId = getAppIdFromToken(token)
  const endpoint = guildId
    ? `/applications/${appId}/guilds/${guildId}/commands`
    : `/applications/${appId}/commands`

  await fetch(`https://discord.com/api/v10${endpoint}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bot ${token}`,
    },
    body: JSON.stringify(commands()),
  })
}

export interface App {
  login: (client: JSX.Element) => Promise<void>
  register: (commands: JSX.Element, guildId?: string) => Promise<void>
}

export function createApp(token: string): App {
  return {
    login: (client: JSX.Element) => {
      return login(client as Client, token)
    },
    register: (commands: JSX.Element, guildId?: string) => {
      return register(commands as () => ChatInput[], token, guildId)
    },
  }
}
