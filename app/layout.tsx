import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { NuqsAdapter } from "nuqs/adapters/next/app"
import { Toaster } from "@/components/ui/sonner"

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
      <body className={`${inter.className} antialiased p-5`}>
        <NuqsAdapter>{children}</NuqsAdapter>
        <Toaster richColors expand={false} position="bottom-center" />
      </body>
    </html>
  )
}
