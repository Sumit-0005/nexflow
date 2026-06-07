import { SignIn } from '@clerk/nextjs'
import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

const BYPASS = process.env.CLERK_BYPASS === 'true'

export default function Page() {
  if (BYPASS) {
    console.log('[SIGN-IN PAGE] Bypass mode - redirecting to /dashboard')
    redirect('/dashboard')
  }

  const { userId } = auth()
  console.log('[SIGN-IN PAGE] auth check - userId:', userId)

  if (userId) {
    console.log('[SIGN-IN PAGE] User already signed in, redirecting to /dashboard')
    redirect('/dashboard')
  }

  return <SignIn afterSignInUrl="/dashboard" />
}
