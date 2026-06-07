import type { Metadata } from 'next'
import { DM_Sans } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/providers/theme-provider'
import { ClerkProvider } from '@clerk/nextjs'
import ModalProvider from '@/providers/modal-provider'
import { Toaster } from '@/components/ui/sonner'
import { BillingProvider } from '@/providers/billing-provider'

const font = DM_Sans({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Nexflow.',
  description: 'Automate Your Work With Nexflow.',
}

const BYPASS = process.env.CLERK_BYPASS === 'true'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  if (BYPASS) {
    console.log('[ROOT LAYOUT] Clerk bypass mode enabled')
    return (
      <html lang="en">
        <body className={font.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <BillingProvider>
              <ModalProvider>
                {children}
                <Toaster />
              </ModalProvider>
            </BillingProvider>
          </ThemeProvider>
        </body>
      </html>
    )
  }

  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
    >
      <html lang="en">
        <body className={font.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <BillingProvider>
              <ModalProvider>
                {children}
                <Toaster />
              </ModalProvider>
            </BillingProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
