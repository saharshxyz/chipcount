import { PayoutSchema } from "@/lib/schemas"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Info } from "lucide-react"
import { formatDollar } from "@/lib/utils"

export function SlippageInfo({ payout }: { payout: PayoutSchema }) {
  const totalCashIn = payout.players.reduce((sum, p) => sum + p.cashIn, 0)
  const totalCashOut = payout.players.reduce((sum, p) => sum + p.cashOut, 0)

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
            been{" "}
            {payout.slippage > 0
              ? "distributed equally among"
              : "deducted equally from"}{" "}
            all players.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-orange-800">
            <div className="space-y-1">
              <p>Total Cash In: {formatDollar(totalCashIn)}</p>
              <p>Total Cash Out: {formatDollar(totalCashOut)}</p>
              <div className="font-medium">
                Difference: {formatDollar(Math.abs(payout.slippage))} (
                {formatDollar(
                  Math.abs(payout.slippage) / payout.players.length
                )}{" "}
                per player)
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
