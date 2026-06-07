import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'

export async function GET() {
  const diagnostics: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    clerk: {
      publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
        ? process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.substring(0, 15) + '...'
        : 'NOT SET',
      secretKey: process.env.CLERK_SECRET_KEY
        ? process.env.CLERK_SECRET_KEY.substring(0, 15) + '...'
        : 'NOT SET',
      signInUrl: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL || 'NOT SET',
      signUpUrl: process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL || 'NOT SET',
      afterSignInUrl: process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL || 'NOT SET',
      afterSignUpUrl: process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL || 'NOT SET',
    },
    bypass: process.env.CLERK_BYPASS === 'true',
  }

  try {
    const { userId } = auth()
    diagnostics.authResult = { userId }
    diagnostics.status = userId ? 'AUTHENTICATED' : 'NOT_AUTHENTICATED'
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    diagnostics.authResult = { error: message }
    diagnostics.status = 'ERROR'
  }

  return NextResponse.json(diagnostics)
}
