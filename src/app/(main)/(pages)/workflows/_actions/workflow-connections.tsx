'use server'
import { Option } from '@/components/ui/multiple-selector'
import { db } from '@/lib/db'
import { getAuth, getCurrentUser } from '@/lib/auth'

export const getGoogleListener = async () => {
  const { userId } = getAuth()

  if (userId) {
    try {
      const listener = await db.user.findUnique({
        where: {
          clerkId: userId,
        },
        select: {
          googleResourceId: true,
        },
      })

      if (listener) return listener
    } catch (error) {
      console.error('[GOOGLE_LISTENER_DB_ERROR]', error)
      return null
    }
  }
}

export const onFlowPublish = async (workflowId: string, state: boolean) => {
  console.log(state)
  try {
    const published = await db.workflows.update({
      where: {
        id: workflowId,
      },
      data: {
        publish: state,
      },
    })

    if (published.publish) return 'Workflow published'
    return 'Workflow unpublished'
  } catch (error) {
    console.error('[FLOW_PUBLISH_DB_ERROR]', error)
    return 'Failed to publish workflow'
  }
}

export const onCreateNodeTemplate = async (
  content: string,
  type: string,
  workflowId: string,
  channels?: Option[],
  accessToken?: string,
  notionDbId?: string
) => {
  try {
    if (type === 'Discord') {
      const response = await db.workflows.update({
        where: {
          id: workflowId,
        },
        data: {
          discordTemplate: content,
        },
      })

      if (response) {
        return 'Discord template saved'
      }
    }
    if (type === 'Slack') {
      const response = await db.workflows.update({
        where: {
          id: workflowId,
        },
        data: {
          slackTemplate: content,
          slackAccessToken: accessToken,
        },
      })

      if (response) {
        const channelList = await db.workflows.findUnique({
          where: {
            id: workflowId,
          },
          select: {
            slackChannels: true,
          },
        })

        if (channelList) {
          const existingChannels: string[] = JSON.parse(channelList.slackChannels)
          const newChannels = channels!
            .map((c) => c.value)
            .filter((c) => !existingChannels.includes(c))

          await db.workflows.update({
            where: { id: workflowId },
            data: {
              slackChannels: JSON.stringify([...existingChannels, ...newChannels]),
            },
          })

          return 'Slack template saved'
        }
        await db.workflows.update({
          where: { id: workflowId },
          data: {
            slackChannels: JSON.stringify(channels!.map((c) => c.value)),
          },
        })
        return 'Slack template saved'
      }
    }

    if (type === 'Notion') {
      const response = await db.workflows.update({
        where: {
          id: workflowId,
        },
        data: {
          notionTemplate: content,
          notionAccessToken: accessToken,
          notionDbId: notionDbId,
        },
      })

      if (response) return 'Notion template saved'
    }
  } catch (error) {
    console.error('[NODE_TEMPLATE_DB_ERROR]', error)
    return 'Failed to save template'
  }
}

export const onGetWorkflows = async () => {
  const user = await getCurrentUser()
  if (user) {
    try {
      const workflow = await db.workflows.findMany({
        where: {
          userId: user.id,
        },
      })

      if (workflow) return workflow
    } catch (error) {
      console.error('[GET_WORKFLOWS_DB_ERROR]', error)
      return []
    }
  }
}

export const onCreateWorkflow = async (name: string, description: string) => {
  const user = await getCurrentUser()

  if (user) {
    try {
      const email = user.primaryEmailAddress?.emailAddress || user.emailAddresses?.[0]?.emailAddress || ''

      await db.user.upsert({
        where: { clerkId: user.id },
        update: { email },
        create: {
          clerkId: user.id,
          email,
          name: user.firstName || '',
          profileImage: user.imageUrl || '',
        },
      })

      const workflow = await db.workflows.create({
        data: {
          userId: user.id,
          name,
          description,
        },
      })

      if (workflow) return { message: 'workflow created' }
      return { message: 'Oops! try again' }
    } catch (error) {
      console.error('[CREATE_WORKFLOW_DB_ERROR]', error)
      return { message: 'Database connection failed' }
    }
  }
}

export const onGetNodesEdges = async (flowId: string) => {
  try {
    const nodesEdges = await db.workflows.findUnique({
      where: {
        id: flowId,
      },
      select: {
        nodes: true,
        edges: true,
      },
    })
    if (nodesEdges?.nodes && nodesEdges?.edges) return nodesEdges
  } catch (error) {
    console.error('[GET_NODES_EDGES_DB_ERROR]', error)
    return null
  }
}
