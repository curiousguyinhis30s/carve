import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import { Toaster } from '@/components/ui/sonner'
import { Providers } from '@/components/providers'
import './globals.css'

const jakarta = Plus_Jakarta_Sans({
  variable: '--font-jakarta',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
})

export const metadata: Metadata = {
  title: {
    default: 'Carve - Digital Business Cards That Make an Impression',
    template: '%s | Carve',
  },
  description:
    'Create stunning digital business cards with NFC technology. Share your profile instantly with a tap. No app required.',
  keywords: [
    'digital business card',
    'NFC business card',
    'smart card',
    'contactless networking',
    'professional networking',
    'digital identity',
  ],
  authors: [{ name: 'Carve' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: 'Carve',
    title: 'Carve - Digital Business Cards That Make an Impression',
    description:
      'Create stunning digital business cards with NFC technology. Share your profile instantly with a tap.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Carve - Digital Business Cards',
    description:
      'Create stunning digital business cards with NFC technology. Share your profile instantly with a tap.',
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
    <html lang="en">
      <body className={`${jakarta.variable} font-sans antialiased`}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
