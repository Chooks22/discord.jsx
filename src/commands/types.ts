import type { MessageCommand } from './message.js'
import type { SlashCommand } from './slash.js'
import type { SlashSubcommand } from './slash-sub.js'
import type { UserCommand } from './user.js'

export type Command =
| SlashCommand
| SlashSubcommand
| UserCommand
| MessageCommand
