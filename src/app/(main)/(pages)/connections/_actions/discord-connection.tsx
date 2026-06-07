'use server'

import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import axios from 'axios'

export const onDiscordConnect = async (
  channel_id: string,
  webhook_id: string,
  webhook_name: string,
  webhook_url: string,
  id: string,
  guild_name: string,
  guild_id: string
) => {
  if (webhook_id) {
    try {
      const webhook = await db.discordWebhook.findFirst({
        where: {
          userId: id,
        },
        include: {
          connections: {
            select: {
              type: true,
            },
          },
        },
      })

      if (!webhook) {
        await db.discordWebhook.create({
          data: {
            userId: id,
            webhookId: webhook_id,
            channelId: channel_id!,
            guildId: guild_id!,
            name: webhook_name!,
            url: webhook_url!,
            guildName: guild_name!,
            connections: {
              create: {
                userId: id,
                type: 'Discord',
              },
            },
          },
        })
      }

      if (webhook) {
        const webhook_channel = await db.discordWebhook.findUnique({
          where: {
            channelId: channel_id,
          },
          include: {
            connections: {
              select: {
                type: true,
              },
            },
          },
        })

        if (!webhook_channel) {
          await db.discordWebhook.create({
            data: {
              userId: id,
              webhookId: webhook_id,
              channelId: channel_id!,
              guildId: guild_id!,
              name: webhook_name!,
              url: webhook_url!,
              guildName: guild_name!,
              connections: {
                create: {
                  userId: id,
                  type: 'Discord',
                },
              },
            },
          })
        }
      }
    } catch (error) {
      console.error('[DISCORD_CONNECT_DB_ERROR]', error)
    }
  }
}

export const getDiscordConnectionUrl = async () => {
  const user = await getCurrentUser()
  if (user) {
    try {
      const webhook = await db.discordWebhook.findFirst({
        where: {
          userId: user.id,
        },
        select: {
          url: true,
          name: true,
          guildName: true,
        },
      })

      return webhook
    } catch (error) {
      console.error('[DISCORD_URL_DB_ERROR]', error)
      return null
    }
  }
}

export const postContentToWebHook = async (content: string, url: string) => {
  console.log(content)
  if (content != '') {
    const posted = await axios.post(url, { content })
    if (posted) {
      return { message: 'success' }
    }
    return { message: 'failed request' }
  }
  return { message: 'String empty' }
}
