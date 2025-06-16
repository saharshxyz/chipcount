import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { NuqsAdapter } from "nuqs/adapters/next/app"

const inter = Inter({
  subsets: ["latin"],
  display: "swap"
})

export const metadata: Metadata = {
  title: "PokerCalc",
  description: "Calculate Poker Payouts"
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <div className="mt-5 mb-1">
          {" "}
          <NuqsAdapter>{children}</NuqsAdapter>
        </div>
      </body>
    </html>
  )
}
