import type { ColorResolvable, EmbedFieldData, MessageEmbedOptions } from 'discord.js'
import { MessageEmbed } from 'discord.js'
import { arrayify } from '../utils.js'

export type JSXString = string | number | boolean | (string | number | boolean | undefined | null)[]

function normalize(content: JSXString): string {
  return Array.isArray(content)
    ? content
      .filter(v => v !== undefined && v !== null && typeof v !== 'boolean')
      .join('')
    : content.toString()
}

export interface EmbedProps {
  color?: ColorResolvable
  children: JSX.Element | JSX.Element
  thumbnail?: string
  image?: string
  timestamp?: Date | number | boolean | null
}

export function Embed(props: EmbedProps): MessageEmbed {
  const children = arrayify(props.children)
  const opts = Object.assign({}, ...children) as MessageEmbedOptions
  const embed = new MessageEmbed(opts)

  if (props.color !== undefined) {
    embed.setColor(props.color)
  }

  if (props.thumbnail !== undefined) {
    embed.setThumbnail(props.thumbnail)
  }

  if (props.image !== undefined) {
    embed.setImage(props.image)
  }

  if (props.timestamp !== undefined) {
    if (props.timestamp === true) {
      embed.setTimestamp()
    } else if (props.timestamp !== false) {
      embed.setTimestamp(props.timestamp)
    }
  }

  return embed
}

export interface EmbedAuthorProps {
  children: JSXString
  url?: string
  iconURL?: string
}

Embed.Author = function Author(props: EmbedAuthorProps): Pick<MessageEmbedOptions, 'author'> {
  return {
    author: {
      name: normalize(props.children),
      url: props.url,
      iconURL: props.iconURL,
    },
  }
}

export interface EmbedTitleProps {
  children: JSXString
  url?: string
}

Embed.Title = function Title(props: EmbedTitleProps): Pick<MessageEmbedOptions, 'title'> {
  return {
    title: normalize(props.children),
  }
}

export interface EmbedDescriptionProps {
  children: JSXString
}

Embed.Description = function Description(props: EmbedDescriptionProps): Pick<MessageEmbedOptions, 'description'> {
  return {
    description: normalize(props.children),
  }
}

export interface EmbedFieldsProps {
  children: JSX.Element | JSX.Element[]
}

Embed.Fields = function Fields(props: EmbedFieldsProps): Pick<MessageEmbedOptions, 'fields'> {
  return {
    fields: arrayify(props.children as EmbedFieldData),
  }
}

export interface EmbedFieldProps {
  name: string
  children: JSXString
  inline?: boolean
}

Embed.Field = function Field(props: EmbedFieldProps): EmbedFieldData {
  return {
    name: props.name,
    value: normalize(props.children),
    inline: props.inline,
  }
}

export interface EmbedFooterProps {
  children: JSXString
  iconURL?: string
  proxyIconURL?: string
}

Embed.Footer = function Footer(props: EmbedFooterProps): Pick<MessageEmbedOptions, 'footer'> {
  return {
    footer: {
      text: normalize(props.children),
      iconURL: props.iconURL,
    },
  }
}
