"use client"

import { calcPayouts, parseZipson } from "@/lib/utils"
import { useQueryState } from "nuqs"
import { gameSchema } from "@/lib/schemas"
import { PlayerSummary } from "./player-summary"

export function GameStats() {
  const [game] = useQueryState("game", parseZipson)

  const payout = calcPayouts(gameSchema.parse(game))

  if (payout)
    return (
      <div>
        <pre>{JSON.stringify(game, null, 2)}</pre>
        <pre>{JSON.stringify(payout, null, 2)}</pre>
        <div className="grid grid-cols-2 gap-5">
          {payout.players.map((player) => (
            <PlayerSummary key={player.name} {...player} />
          ))}
        </div>
      </div>
    )
}
