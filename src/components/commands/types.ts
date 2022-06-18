import type { MessageCommand } from './Message.js'
import type { SlashCommand } from './Command.js'
import type { SlashSubcommand } from './Subcommand.js'
import type { UserCommand } from './User.js'

export type Command =
| SlashCommand
| SlashSubcommand
| UserCommand
| MessageCommand
