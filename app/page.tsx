"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { GameForm } from "@/components/game-form"
import { PayoutStats } from "@/components/payout-stats"
import { Separator } from "@/components/ui/separator"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Eraser, Link as LinkIcon } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export default function Home() {
  const copyUrlToClipboard = () => {
    navigator.clipboard.writeText(window.location.href).then(
      () => toast.success("Link copied to clipboard"),
      () => toast.error("Failed to copy URL to clipboard.")
    )
  }

  return (
    <div>
      <div className="flex items-center justify-center flex-col w-full">
        <div className="mb-2 flex space-x-2 flex-row justify-center">
          <Link href={`/`}>
            <Button variant="outline">
              <Eraser className="mr-1" />
              Clear Form
            </Button>
          </Link>
          <Button onClick={copyUrlToClipboard} className="w-full">
            <LinkIcon className="mr-1" />
            Copy Link
          </Button>
        </div>
        <Card className="w-full max-w-prose">
          <CardHeader>
            <CardTitle>PokerCalc</CardTitle>
            <CardDescription>
              Enter player details to calculate payouts.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<Skeleton className="rounded-l h-[150px]" />}>
              <GameForm />
            </Suspense>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-center">
        <Separator className="max-w-prose my-5" />
      </div>

      <div className="flex items-center justify-center flex-col">
        <div className="w-full max-w-[97.5ch] ">
          <Suspense fallback={<Skeleton className="rounded-l h-[300px]" />}>
            <PayoutStats />
          </Suspense>
        </div>
        <p className="mt-5"><a
          href="https://github.com/saharshxyz/pokercalc"
          target="_blank"
          rel="noopener"
        >Open Source</a> by <a
          href="https://saharsh.xyz"
          target="_blank"
          rel="noopener"
        >@saharshxyz</a></p>
      </div>
    </div>
  )
}
