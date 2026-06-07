import { NextResponse } from 'next/server'

export async function GET() {
  const response = NextResponse.json({
    success: true,
    message: 'Clerk cookies cleared. Please reload the page.',
  })

  const clerkCookies = [
    '__session',
    '__clerk_db_jwt',
    '__clerk_redirection_loop',
    '__client_uat',
    '__clerk_client_jwt',
    '__dev_session',
  ]

  clerkCookies.forEach((name) => {
    response.cookies.set(name, '', {
      path: '/',
      maxAge: 0,
      domain: undefined,
    })
    response.cookies.set(name, '', {
      path: '/',
      maxAge: 0,
      domain: 'localhost',
    })
  })

  return response
}
