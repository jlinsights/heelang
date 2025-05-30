import type React from "react"
// This is the root layout, it should only contain <html> and <body> tags.
// Specific providers and main structure will be in app/[locale]/layout.tsx
import "./globals.css" // Keep global styles

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // The lang attribute will be set in app/[locale]/layout.tsx
    <html>
      <body>{children}</body>
    </html>
  )
}

export const metadata = {
      generator: 'v0.dev'
    };
