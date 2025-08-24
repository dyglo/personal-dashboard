import type React from "react"
import type { Metadata, Viewport } from "next"
import { GeistMono } from "geist/font/mono"
import { DM_Sans } from "next/font/google"
import "./globals.css"

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
})

export const metadata: Metadata = {
  title: "Tafa - Personal Analytics Dashboard",
  description: "AI-powered personal analytics with gamification",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: '/favicon.svg',
        type: 'image/svg+xml',
      },
    ],
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  manifest: '/site.webmanifest',
  openGraph: {
    title: "Tafa - Personal Analytics Dashboard",
    description: "AI-powered personal analytics with gamification",
    type: "website",
    url: "https://tafa-dashboard.vercel.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tafa - Personal Analytics Dashboard",
    description: "AI-powered personal analytics with gamification",
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#fbbe05',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${GeistMono.variable} dark`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
