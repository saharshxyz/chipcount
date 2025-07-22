import { PayoutSchema, slippageType } from "@/lib/schemas"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Info } from "lucide-react"
import { formatDollar } from "@/lib/utils"

type SlippageType = (typeof slippageType)[number]

export function SlippageInfo({
  payout,
  slippageType
}: {
  payout: PayoutSchema
  slippageType: SlippageType
}) {
  const totalCashIn = payout.players.reduce((sum, p) => sum + p.cashIn, 0)
  const totalCashOut = payout.players.reduce((sum, p) => sum + p.cashOut, 0)

  const winners = payout.players.filter((p) => p.net > 0)
  const losers = payout.players.filter((p) => p.net < 0)

  const getDistributionDescription = () => {
    const isPositive = payout.slippage > 0
    const verb = isPositive ? "distributed" : "deducted"
    const preposition = isPositive ? "among" : "from"

    switch (slippageType) {
      case "even_all":
        return `${verb} equally ${preposition} all players`
      case "even_winners":
        return winners.length > 0
          ? `${verb} equally ${preposition} winners only`
          : `would be ${verb} equally ${preposition} winners, but there are no winners`
      case "proportional_winners":
        return winners.length > 0
          ? `${verb} proportionally ${preposition} winners based on their winnings`
          : `would be ${verb} proportionally ${preposition} winners, but there are no winners`
      case "even_losers":
        return losers.length > 0
          ? `${verb} equally ${preposition} losers only`
          : `would be ${verb} equally ${preposition} losers, but there are no losers`
      case "proportional_losers":
        return losers.length > 0
          ? `${verb} proportionally ${preposition} losers based on their losses`
          : `would be ${verb} proportionally ${preposition} losers, but there are no losers`
      default:
        return `${verb} according to the selected method`
    }
  }

  const getAffectedPlayersInfo = () => {
    switch (slippageType) {
      case "even_all":
        return `${payout.players.length} players (${formatDollar(Math.abs(payout.slippage) / payout.players.length)} each)`
      case "even_winners":
        return winners.length > 0
          ? `${winners.length} winners (${formatDollar(Math.abs(payout.slippage) / winners.length)} each)`
          : "0 winners"
      case "proportional_winners":
        return winners.length > 0
          ? `${winners.length} winners (proportional to winnings)`
          : "0 winners"
      case "even_losers":
        return losers.length > 0
          ? `${losers.length} losers (${formatDollar(Math.abs(payout.slippage) / losers.length)} each)`
          : "0 losers"
      case "proportional_losers":
        return losers.length > 0
          ? `${losers.length} losers (proportional to losses)`
          : "0 losers"
      default:
        return "affected players"
    }
  }

  return (
    <div className="flex items-center justify-center">
      <Card className="w-full max-w-[50ch] border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-800">
            <Info className="h-5 w-5" />
            Slippage Detected
          </CardTitle>
          <CardDescription className="text-orange-700">
            There&apos;s a {formatDollar(Math.abs(payout.slippage))}{" "}
            {payout.slippage > 0 ? "surplus" : "shortage"} in the game. This has
            been {getDistributionDescription()}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-orange-800">
            <div className="space-y-1">
              <p>Total Cash In: {formatDollar(totalCashIn)}</p>
              <p>Total Cash Out: {formatDollar(totalCashOut)}</p>
              <div className="font-medium">
                Difference: {formatDollar(Math.abs(payout.slippage))}
              </div>
              <div className="mt-2 text-xs text-orange-600">
                Distribution method: {slippageType.replace(/_/g, " ")}
              </div>
              <div className="text-xs text-orange-600">
                Affected: {getAffectedPlayersInfo()}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
