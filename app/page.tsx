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

export default function Home() {
  return (
    <div>
      <div className="flex items-center justify-center">
        <Card className="w-full max-w-prose">
          <CardHeader>
            <CardTitle>PokerCalc</CardTitle>
            <CardDescription>
              Enter player details to calculate payouts.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<Skeleton className="rounded-l h-svh" />} >
              <GameForm />
            </Suspense >
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-center">
        <Separator className="max-w-prose my-5" />
      </div>

      <div className="flex items-center justify-center">
        <div className="w-full max-w-[97.5ch] ">
          <Suspense fallback={<Skeleton className="rounded-l h-svh" />} >
            <PayoutStats />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
