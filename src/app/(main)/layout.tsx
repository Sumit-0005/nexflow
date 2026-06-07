import React from 'react'
import Sidebar from '@/components/sidebar'
import InfoBar from '@/components/infobar'
import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

type Props = { children: React.ReactNode }

const BYPASS = process.env.CLERK_BYPASS === 'true'

const Layout = (props: Props) => {
  if (BYPASS) {
    const mockUserId = process.env.CLERK_BYPASS_USER_ID || 'mock_user_dev'
    console.log('[MAIN LAYOUT] Bypass mode - using mock userId:', mockUserId)
    return (
      <div className="flex overflow-hidden h-screen">
        <Sidebar />
        <div className="w-full">
          <InfoBar />
          {props.children}
        </div>
      </div>
    )
  }

  const { userId } = auth()
  console.log('[MAIN LAYOUT] auth check - userId:', userId)

  if (!userId) {
    console.log('[MAIN LAYOUT] No userId found, redirecting to /sign-in')
    redirect('/sign-in')
  }

  return (
    <div className="flex overflow-hidden h-screen">
      <Sidebar />
      <div className="w-full">
        <InfoBar />
        {props.children}
      </div>
    </div>
  )
}

export default Layout
