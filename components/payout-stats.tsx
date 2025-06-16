"use client"

import { calcPayouts, parseZipson } from "@/lib/utils"
import { useQueryState } from "nuqs"
import { gameSchema } from "@/lib/schemas"
import { PlayerSummary } from "./player-summary"
import { SlippageInfo } from "./slippage-info"

export function PayoutStats() {
  const [game] = useQueryState("game", parseZipson)

  const payout = gameSchema.safeParse(game).success
    ? calcPayouts(gameSchema.parse(game))
    : undefined

  if (payout)
    return (
      <div className="space-y-5">
        {/* <pre>{JSON.stringify(game, null, 2)}</pre>
        <pre>{JSON.stringify(payout, null, 2)}</pre> */}

        {Math.abs(payout.slippage) > 1e-9 && <SlippageInfo payout={payout} />}

        <div className="grid md:grid-cols-2 gap-5">
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
