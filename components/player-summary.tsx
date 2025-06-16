import { PlayerSchema } from "@/lib/schemas"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { TrendingDown, TrendingUp } from "lucide-react"

export function PlayerSummary(player: PlayerSchema) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">{player.name}</CardTitle>
        <CardDescription className="flex flex-row items-center justify-center gap-2">
          {
            [["In", player.cashIn], ["Out", player.cashOut]].map(cash => (
              <div className="bg-secondary flex items-center justify-center flex-col py-1.5 w-full rounded-sm" key={cash[0]}>
                <p>Cash {cash[0]}</p>
                <p className="font-bold">{cash[1]}</p>
              </div>
            ))
          }
        </CardDescription>
        <CardAction className="text-2xl">{player.net}</CardAction>
      </CardHeader>
      <CardContent>
        {
          player.paidBy.length != 0 && (
            <Alert variant="destructive">
              <TrendingDown />
              <AlertTitle>Owes</AlertTitle>
              <AlertDescription>
                <ul>
                  {
                    player.paidBy.map(to => (
                      <li key={to.target}><span className="font-bold">{to.value}</span> to {to.target}</li>
                    ))
                  }
                </ul>
              </AlertDescription>
            </Alert>
          )
        }
        {
          player.paidTo.length != 0 && (
            <Alert variant="success">
              <TrendingDown />
              <AlertTitle>Receives</AlertTitle>
              <AlertDescription>
                <ul>
                  {
                    player.paidTo.map(to => (
                      <li key={to.target}><span className="font-bold">{to.value}</span> from {to.target}</li>
                    ))
                  }
                </ul>
              </AlertDescription>
            </Alert>
          )
        }
      </CardContent>
    </Card>
  )
}
