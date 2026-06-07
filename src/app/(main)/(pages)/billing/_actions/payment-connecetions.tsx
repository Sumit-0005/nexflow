'use server'

import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

export const onPaymentDetails = async () => {
  const user = await getCurrentUser()

  if (user) {
    try {
      const connection = await db.user.findFirst({
        where: {
          clerkId: user.id,
        },
        select: {
          tier: true,
          credits: true,
        },
      })

      if (user) {
        return connection
      }
    } catch (error) {
      console.error('[PAYMENT_DB_ERROR]', error)
      return null
    }
  }
}
