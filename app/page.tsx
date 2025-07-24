import type { Metadata } from "next"
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
import { Import } from "lucide-react"
import Link from "next/link"
import { gameSchema } from "@/lib/schemas"
import { parseZipson } from "@/lib/utils"
import { FormActions } from "@/components/form-actions"

export async function generateMetadata({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}): Promise<Metadata> {
  const params = await searchParams
  const gameParam = params.game

  const defaultMetadata = {
    title: "ChipCount",
    description: "Calculate Poker Payouts"
  }

  if (typeof gameParam !== "string") return defaultMetadata

  try {
    const gameData = parseZipson.parse(gameParam)
    const parseResult = gameSchema.safeParse(gameData)

    if (!parseResult.success) return defaultMetadata

    const { description } = parseResult.data
    if (!description) return defaultMetadata

    return {
      title: `ChipCount | ${description}`,
      description: `Calculate Poker Payouts`
    }
  } catch (error) {
    console.warn("Failed to parse game data for metadata:", error)
    return defaultMetadata
  }
}

export default function Home() {
  return (
    <div>
      <div className="flex w-full flex-col items-center justify-center">
        <div className="mb-2">
          <FormActions />
        </div>
        <Card className="w-full max-w-prose">
          <CardHeader>
            <CardTitle>ChipCount</CardTitle>
            <CardDescription>
              Enter player details to calculate payouts
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
            className="text-link text-muted-foreground"
            target="_blank"
            rel="noopener"
          >
            Open Source
          </a>{" "}
          by{" "}
          <a
            href="https://saharsh.xyz"
            className="text-link text-muted-foreground"
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
