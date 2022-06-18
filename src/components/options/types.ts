import type { AttachmentOption } from './Attachment.js'
import type { BooleanOption } from './Boolean.js'
import type { ChannelOption } from './Channel.js'
import type { IntegerOption } from './Integer.js'
import type { MentionableOption } from './Mentionable.js'
import type { NumberOption } from './Number.js'
import type { RoleOption } from './Role.js'
import type { StringOption } from './String.js'
import type { Subcommand } from './Subcommand.js'
import type { SubcommandGroup } from './SubcommandGroup.js'
import type { UserOption } from './User.js'

export type BasicOption =
| AttachmentOption
| BooleanOption
| ChannelOption
| IntegerOption
| MentionableOption
| NumberOption
| RoleOption
| StringOption
| UserOption

export type SubcommandOption =
| Subcommand
| SubcommandGroup
