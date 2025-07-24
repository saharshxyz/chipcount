import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { NuqsAdapter } from "nuqs/adapters/next/app"
import { Toaster } from "@/components/ui/sonner"
import { Analytics } from "@vercel/analytics/next"

const inter = Inter({
  subsets: ["latin"],
  display: "swap"
})

export const metadata: Metadata = {
  title: "ChipCount",
  description: "Calculate Poker Payouts"
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} p-5 antialiased`}>
        <NuqsAdapter>{children}</NuqsAdapter>
        <Toaster richColors expand={false} position="bottom-center" />
        <Analytics />
      </body>
    </html>
  )
}
