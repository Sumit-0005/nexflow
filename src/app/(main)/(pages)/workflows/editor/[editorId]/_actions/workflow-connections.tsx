'use server'

import { db } from '@/lib/db'

export const onCreateNodesEdges = async (
  flowId: string,
  nodes: string,
  edges: string,
  flowPath: string
) => {
  try {
    const flow = await db.workflows.update({
      where: {
        id: flowId,
      },
      data: {
        nodes,
        edges,
        flowPath: flowPath,
      },
    })

    if (flow) return { message: 'flow saved' }
  } catch (error) {
    console.error('[CREATE_NODES_EDGES_DB_ERROR]', error)
    return { message: 'Database connection failed' }
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
    console.error('[PUBLISH_FLOW_DB_ERROR]', error)
    return 'Failed to publish workflow'
  }
}
