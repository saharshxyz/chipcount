import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { GameForm } from "@/components/game-form"
import { GameStats } from "@/components/game-stats"

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
            <GameForm />
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-center">
        <div className="w-full max-w-prose ">
          <GameStats />
        </div>
      </div>
    </div>
  )
}
