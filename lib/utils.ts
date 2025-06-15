import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { GameSchema, PayoutSchema, PaySchema } from "./schemas"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const calcPayouts = (game: GameSchema): PayoutSchema => {
  const slippage = game.players.reduce(
    (sum, curr) => sum + curr.cashIn - curr.cashOut,
    0
  )

  const players = game.players
    .map((p) => {
      const net = p.cashOut - p.cashIn + slippage / game.players.length
      return {
        ...p,
        net,
        paidBy: [] as PaySchema[],
        paidTo: [] as PaySchema[],
        balance: net
      }
    })
    .sort((a, b) => a.balance - b.balance)

  let leftPointer = 0
  let rightPointer = players.length - 1

  while (leftPointer < rightPointer) {
    const loser = players[leftPointer]
    const winner = players[rightPointer]
    const payment = Math.min(-loser.balance, winner.balance)

    if (payment > 1e-9) {
      loser.balance += payment
      winner.balance -= payment

      loser.paidBy.push({ target: winner.name, value: payment })
      winner.paidTo.push({ target: loser.name, value: payment })
    }

    if (Math.abs(loser.balance) < 1e-9) leftPointer++
    if (Math.abs(winner.balance) < 1e-9) rightPointer--
  }

  return {
    slippage,
    players: players.map(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ({ balance, ...p }) => p
    )
  }
}
