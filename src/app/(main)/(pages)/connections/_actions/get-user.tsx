'use server'

import { db } from '@/lib/db'

export const getUserData = async (id: string) => {
  try {
    const user_info = await db.user.findUnique({
      where: {
        clerkId: id,
      },
      include: {
        connections: true,
      },
    })

    return user_info
  } catch (error) {
    console.error('[GET_USER_DB_ERROR]', error)
    return null
  }
}
