import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'

// Bundled Geist variable fonts — clean, modern, and network-free at build time.
const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-sans',
  weight: '100 900',
  display: 'swap',
})

const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-mono',
  weight: '100 900',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Commodity Trading Masterclass',
  description: 'Interactive lecture support for the commodity trading masterclass — Université Paris-Panthéon-Assas',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark ${geistSans.variable} ${geistMono.variable}`}>
      <body className="app-canvas font-sans min-h-screen">{children}</body>
    </html>
  )
}
