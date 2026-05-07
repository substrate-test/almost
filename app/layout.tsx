import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Almost',
  description: 'The post-swipe dating app, based on IRL connection and chemistry.',
  icons: { icon: '/OrbCursor.svg' },
  openGraph: {
    title: 'Almost',
    description: 'The post-swipe dating app, based on IRL connection and chemistry.',
    url: 'https://almost-umber.vercel.app',
    siteName: 'Almost',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Almost',
    description: 'The post-swipe dating app, based on IRL connection and chemistry.',
    images: ['/og-image.png'],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
