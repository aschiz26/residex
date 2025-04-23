import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Orthopedic Surgery Interview Coach',
  description: 'AI-powered practice for orthopedic surgery residency interviews',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
  <ClerkProvider>
    <html lang="en">
      <body className={inter.className}>
        {<div className="flex min-h-screen flex-col">
          <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center">
              <div className="mr-4 flex">
                <Link href="/" className="flex items-center space-x-2">
                  <span className="text-2xl font-bold">OrthoCoach</span>
                </Link>
              </div>
              <nav className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                <div className="hidden md:flex md:items-center md:gap-5">
                  <Link href="/interview" className="text-sm font-medium transition-colors hover:text-primary">
                    Practice
                  </Link>
                  <Link href="/dashboard" className="text-sm font-medium transition-colors hover:text-primary">
                    Dashboard
                  </Link>
                  <Link href="/admin" className="text-sm font-medium transition-colors hover:text-primary">
                    Admin
                  </Link>
                </div>
                <div className="flex items-center">
                  <Button variant="outline" size="sm" className="mr-2">
                    Sign In
                  </Button>
                  <Button size="sm">
                    Sign Up
                  </Button>
                </div>
              </nav>
            </div>
          </header>
          <main className="flex-1">{children}</main>
          <footer className="border-t py-6 md:py-0">
            <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
              <p className="text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} OrthoCoach. All rights reserved.
              </p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <Link href="/about" className="transition-colors hover:text-foreground">
                  About
                </Link>
                <Link href="/privacy" className="transition-colors hover:text-foreground">
                  Privacy
                </Link>
                <Link href="/terms" className="transition-colors hover:text-foreground">
                  Terms
                </Link>
              </div>
            </div>
          </footer>
        </div>}
      </body>
    </html>
  </ClerkProvider>
  )
}
