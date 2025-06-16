import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { GameForm } from "@/components/game-form"

export default function Home() {
  return (
    <div className="flex items-center justify-center">
      <Card className="w-full max-w-prose">
        <CardHeader>
          <CardTitle>Poker Night</CardTitle>
          <CardDescription>
            Enter player details to calculate payouts.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <GameForm />
        </CardContent>
      </Card>
    </div>
  )
}
