import type React from "react"
import type { Metadata, Viewport } from "next"
import { Space_Grotesk, Playfair_Display } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Toaster } from '@/components/ui/toaster'

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" })
const playfairDisplay = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" })

export const metadata: Metadata = {
  title: "Himanshu Virell - Video Editor & Web Developer",
  description: "Premium portfolio showcasing video editing and web development expertise",
  generator: "v0.app",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${spaceGrotesk.variable} ${playfairDisplay.variable} font-body antialiased bg-background text-foreground`}
        suppressHydrationWarning
        style={{ touchAction: 'manipulation' }}
      >
        {children}
        {/* Global toaster for small confirmation/snackbar messages */}
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
