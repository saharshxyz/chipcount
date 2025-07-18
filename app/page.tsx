"use client"

import {
  Card,
  CardAction,
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
import { Eraser, Import, Link as LinkIcon } from "lucide-react"
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
      <div className="flex w-full flex-col items-center justify-center">
        <div className="mb-2 flex flex-row justify-center space-x-2">
          <Link href="/" onClick={() => window.location.reload()}>
            <Button variant="outline">
              <Eraser className="mr-1" />
              Clear Form
            </Button>
          </Link>
          <Button onClick={copyUrlToClipboard} className="max-w-full">
            <LinkIcon className="mr-1" />
            Copy Link
          </Button>
        </div>
        <Card className="w-full max-w-prose">
          <CardHeader>
            <CardTitle>ChipCount</CardTitle>
            <CardDescription>
              Enter player details to calculate payouts.
            </CardDescription>
            <CardAction>
              <Link href="/import">
                <Button size="icon">
                  <Import />
                </Button>
              </Link>
            </CardAction>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<Skeleton className="h-[150px] rounded-l" />}>
              <GameForm />
            </Suspense>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-center">
        <Separator className="my-5 max-w-prose" />
      </div>

      <div className="flex flex-col items-center justify-center">
        <div className="w-full max-w-[97.5ch]">
          <Suspense fallback={<Skeleton className="h-[300px] rounded-l" />}>
            <PayoutStats />
          </Suspense>
        </div>
        <p className="mt-3">
          <a
            href="https://github.com/saharshxyz/chipcount"
            className="text-link"
            target="_blank"
            rel="noopener"
          >
            Open Source
          </a>{" "}
          by{" "}
          <a
            href="https://saharsh.xyz"
            className="text-link"
            target="_blank"
            rel="noopener"
          >
            @saharshxyz
          </a>
        </p>
      </div>
    </div>
  )
}
