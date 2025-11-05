// app/layout.tsx
import type { Metadata } from 'next'
// 1. CHANGE: Import from 'geist/font' instead of 'next/font/google'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from 'sonner'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'

export const metadata: Metadata = {
  title: 'TravelMate - Your Travel Companion',
  description: 'Plan, track, and manage your trips with TravelMate',
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    // 2. CHANGE: Apply the font variables to the <html> tag.
    // This makes the CSS variables --font-sans and --font-mono
    // available for your entire application.
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      {/* 3. REMOVED: No className needed on <body> anymore */}
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}