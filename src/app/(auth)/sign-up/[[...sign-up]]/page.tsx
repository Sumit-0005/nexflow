import { SignUp } from '@clerk/nextjs'
import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

const BYPASS = process.env.CLERK_BYPASS === 'true'

export default function Page() {
  if (BYPASS) {
    console.log('[SIGN-UP PAGE] Bypass mode - redirecting to /dashboard')
    redirect('/dashboard')
  }

  const { userId } = auth()
  console.log('[SIGN-UP PAGE] auth check - userId:', userId)

  if (userId) {
    console.log('[SIGN-UP PAGE] User already signed in, redirecting to /dashboard')
    redirect('/dashboard')
  }

  return <SignUp afterSignUpUrl="/dashboard" />
}
