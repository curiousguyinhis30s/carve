import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    default: 'Hendshake - Digital Business Cards',
    template: '%s | Hendshake',
  },
  description:
    'Create your digital business card with NFC technology. Share your contact info, social links, and portfolio with a simple tap.',
  keywords: [
    'digital business card',
    'NFC card',
    'smart business card',
    'contactless networking',
    'QR code card',
  ],
  authors: [{ name: 'Hendshake' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: 'Hendshake',
    title: 'Hendshake - Digital Business Cards',
    description:
      'Create your digital business card with NFC technology. Share your contact info, social links, and portfolio with a simple tap.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hendshake - Digital Business Cards',
    description:
      'Create your digital business card with NFC technology. Share your contact info, social links, and portfolio with a simple tap.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-950`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  )
}
