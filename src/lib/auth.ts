import { auth, currentUser, clerkClient } from '@clerk/nextjs'

const BYPASS = process.env.CLERK_BYPASS === 'true'

const mockUser = {
  id: 'mock_user_dev',
  firstName: 'Dev',
  lastName: 'User',
  emailAddresses: [{ emailAddress: 'dev@example.com' }],
  primaryEmailAddress: { emailAddress: 'dev@example.com' },
}

export function getAuth() {
  if (BYPASS) {
    console.log('[AUTH] Bypass mode - returning mock userId')
    return { userId: 'mock_user_dev' }
  }
  try {
    return auth()
  } catch {
    console.log('[AUTH] Clerk auth() unavailable - returning null userId')
    return { userId: null }
  }
}

export async function getCurrentUser() {
  if (BYPASS) {
    console.log('[AUTH] Bypass mode - returning mock user')
    return mockUser as any
  }
  try {
    return await currentUser()
  } catch {
    console.log('[AUTH] Clerk currentUser() unavailable - returning null')
    return null
  }
}

export function getClerkClient() {
  if (BYPASS) {
    return null
  }
  return clerkClient
}
