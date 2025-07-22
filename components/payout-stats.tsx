"use client"

import { calcPayouts, parseZipson } from "@/lib/utils"
import { useQueryState } from "nuqs"
import { gameSchema } from "@/lib/schemas"
import { PlayerSummary } from "./player-summary"
import { SlippageInfo } from "./slippage-info"
import { useMemo } from "react"
import { DonutCharts } from "./donut-chart"
import { NegativeChart } from "./negative-chart"
import { Card, CardContent } from "./ui/card"

export function PayoutStats() {
  const [game] = useQueryState("game", parseZipson)

  const payout = useMemo(() => {
    const parseResult = gameSchema.safeParse(game)
    if (!parseResult.success) return

    const payout = calcPayouts(parseResult.data)
    payout.players.sort((a, b) => a.name.localeCompare(b.name))

    return payout
  }, [game])

  const parsedGame = useMemo(() => {
    const parseResult = gameSchema.safeParse(game)
    return parseResult.success ? parseResult.data : null
  }, [game])

  if (!payout || !parsedGame) return

  return (
    <div className="space-y-5">
      {Math.abs(payout.slippage) > 1e-9 && (
        <SlippageInfo payout={payout} slippageType={parsedGame.slippageType} />
      )}

      <Card className="bg-secondary">
        <CardContent className="flex w-full flex-col justify-around gap-5 md:flex-row">
          <DonutCharts payout={payout} />
          <NegativeChart players={payout.players} />
        </CardContent>
      </Card>
      <div className="grid gap-5 md:grid-cols-2">
        {payout.players.map((player) => (
          <PlayerSummary
            key={player.name}
            player={player}
            slippage={payout.slippage / payout.players.length}
          />
        ))}
      </div>
    </div>
  )
}
