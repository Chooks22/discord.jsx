import type { AttachmentOption } from './attachment.js'
import type { BooleanOption } from './boolean.js'
import type { ChannelOption } from './channel.js'
import type { IntegerOption } from './integer.js'
import type { MentionableOption } from './mentionable.js'
import type { NumberOption } from './number.js'
import type { RoleOption } from './role.js'
import type { StringOption } from './string.js'
import type { SubcommandGroup } from './subcommand-group.js'
import type { Subcommand } from './subcommand.js'
import type { UserOption } from './user.js'

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
