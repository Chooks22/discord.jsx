# @chooks22/discord.jsx

> ### WARNING!
>
> This project is in very early stage of development. And while I do have plans
> to finish it to completion, **consider this project as highly experimental**.

## About

discord.jsx is a powerful [Node.js](https://nodejs.org) module that allows you
to easily interact with [Discord.js](https://discordjs.guide).

- JSX
- Declarative abstractions

## Installation

**Node.js 16.6.0 or newer, Discord.js 13.8.0 or newer, and Typescript 4.7.2 or
newer is required.**

```sh
npm install @chooks22/discord.jsx discord.js
npm install -D typescript

yarn add @chooks22/discord.jsx discord.js
yarn add -D typescript

pnpm add @chooks22/discord.jsx discord.js
pnpm add -D typescript
```

To be able to emit proper JavaScript, the following tsconfig options are required.

```json
{
  "compilerOptions": {
    "skipLibCheck": true,
    "esModuleInterop": true,
    "target": "ES2021",
    "module": "ESNext",
    "moduleResolution": "NodeNext",
    "jsx": "react-jsx",
    "jsxImportSource": "@chooks22/discord.jsx"
  }
}
```

## Example usage

Define a slash command:

```jsx
// commands.tsx
import { CommandList, Reply, SlashCommand } from '@chooks22/discord.jsx'

export const commands = <CommandList>
  <SlashCommand
    name="ping"
    description="Replies with Pong!"
    onExecute={() => <Reply>Pong!</Reply>}
  />
</CommandList>
```

Register a slash command against the Discord API:

```jsx
import { createApp } from '@chooks22/discord.jsx'
import { commands } from './commands.js'

const app = createApp('token')

console.log('Started refreshing application (/) commands.')
await app.register(commands, GUILD_ID)
console.log('Successfully reloaded application (/) commands.')
```

Afterwards we can create a quite simple example bot:

```jsx
import { Intents } from 'discord.js'
import { createApp, Client } from '@chooks22/discord.jsx'
import { commands } from './commands.js'

const app = createApp('token')
await app.login(<Client
  intents={[Intents.FLAGS.GUILDS]}
  onReady={client => {
    console.log(`Logged in as ${client.user.tag}!`)
  }}
  commands={commands}
/>)
```
