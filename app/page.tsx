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

export default function Home() {
  return (
    <div >
      <div className="flex items-center justify-center">
        <Card className="w-full max-w-prose">
          <CardHeader>
            <CardTitle>PokerCalc</CardTitle>
            <CardDescription>
              Enter player details to calculate payouts.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <GameForm />
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-center">
        <Separator className="max-w-prose my-5" />
      </div>

      <div className="flex items-center justify-center">
        <div className="w-full max-w-[97.5ch] ">
          <PayoutStats />
        </div>
      </div>
    </div>
  )
}
