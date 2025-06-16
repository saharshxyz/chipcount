import { PayoutSchema } from "@/lib/schemas"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { DollarSign } from "lucide-react"
import { NumberValue } from "./number-val"

export function SlippageInfo({ payout }: { payout: PayoutSchema }) {
  const totalCashIn = payout.players.reduce((sum, p) => sum + p.cashIn, 0)
  const totalCashOut = payout.players.reduce((sum, p) => sum + p.cashOut, 0)

  return (
    <div className="flex items-center justify-center">
      <Card className="border-orange-200 bg-orange-50 max-w-prose w-full">
        <CardHeader>
          <CardTitle className="text-orange-800 flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Slippage Detected
          </CardTitle>
          <CardDescription className="text-orange-700">
            There&apos;s a <NumberValue value={Math.abs(payout.slippage)} />{" "}
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
            <div className="font-medium mb-2">Slippage Details:</div>
            <div className="space-y-1">
              <div>
                Total Cash In: <NumberValue value={totalCashIn} />
              </div>
              <div>
                Total Cash Out: <NumberValue value={totalCashOut} />
              </div>
              <div className="font-medium">
                Difference: <NumberValue value={Math.abs(payout.slippage)} /> (
                <NumberValue
                  value={Math.abs(payout.slippage) / payout.players.length}
                />{" "}
                per player)
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
