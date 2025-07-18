import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { GameSchema, PayoutSchema, PaySchema, PokerNowSchema } from "./schemas"

import { stringify, parse } from "zipson"

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
        balance: net,
        displayName: p.name[0] === '@' || p.name[0] === '$' ? p.name.substring(1) : p.name
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

export const convertPokerNow = (data: PokerNowSchema): GameSchema => {
  const startTime = data.reduce(
    (earliest, { session_start_at }) =>
      session_start_at < earliest ? session_start_at : earliest,
    new Date()
  )

  const playerTotals = data.reduce((acc, row) => {
    const existing = acc.get(row.player_nickname) || { in: 0, out: 0 }
    acc.set(row.player_nickname, {
      in: existing.in + row.buy_in,
      out: existing.out + row.buy_out + row.stack
    })
    return acc
  }, new Map<string, { in: number; out: number }>())

  return {
    description: `${formattedDateTime(startTime)} Game`,
    players: Array.from(playerTotals.entries()).map(([name, totals]) => ({
      name,
      cashIn: totals.in,
      cashOut: totals.out
    }))
  }
}

export const formattedDateTime = (time = new Date()) => {
  function getPartOfDay(hour: number) {
    if (hour >= 5 && hour < 12) return "Morning"
    else if (hour >= 12 && hour < 17) return "Afternoon"
    else if (hour >= 17 && hour < 21) return "Evening"
    else return "Night"
  }

  const dayOfWeek = new Intl.DateTimeFormat("en-US", {
    weekday: "long"
  }).format(time)
  const date = new Intl.DateTimeFormat("en-US", {
    month: "numeric",
    day: "numeric"
  }).format(time)
  const partOfDay = getPartOfDay(time.getHours())

  return `${dayOfWeek} (${date}) ${partOfDay}` // Example output: Sunday (4/19) Evening
}

export const formatDollar = (value: number) => {
  const dollarFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    trailingZeroDisplay: "stripIfInteger"
  })

  return dollarFormatter.format(value)
}

export const parseZipson = {
  parse: (queryValue: string) => {
    function decodeFromBinary(str: string): string {
      return decodeURIComponent(
        Array.prototype.map
          .call(atob(str), function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)
          })
          .join("")
      )
    }

    return parse(decodeFromBinary(queryValue))
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  serialize: (value: any) => {
    function encodeToBinary(str: string): string {
      return btoa(
        encodeURIComponent(str).replace(
          /%([0-9A-F]{2})/g,
          function (match, p1) {
            return String.fromCharCode(parseInt(p1, 16))
          }
        )
      )
    }

    return encodeToBinary(stringify(value))
  }
}
