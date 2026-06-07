import { authMiddleware } from '@clerk/nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const BYPASS = process.env.CLERK_BYPASS === 'true'

if (BYPASS) {
  console.log('[MIDDLEWARE] Clerk bypass ENABLED')
}

export default BYPASS
  ? async (_req: NextRequest) => {
      console.log('[MIDDLEWARE] Bypass mode - allowing all requests')
      return NextResponse.next()
    }
  : authMiddleware({
      publicRoutes: [
        '/',
        '/api/clerk-webhook',
        '/api/drive-activity/notification',
        '/api/payment/success',
      ],
      ignoredRoutes: [
        '/api/auth/callback/discord',
        '/api/auth/callback/notion',
        '/api/auth/callback/slack',
        '/api/flow',
        '/api/cron/wait',
      ],
    })

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
