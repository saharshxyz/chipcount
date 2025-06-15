import { z } from "zod/v4"

const uniqueArray = <T>(arr: T[]): boolean => arr.length === new Set(arr).size

const uniqueNameArraySchema = <T extends { name: string }>(
  schema: z.ZodType<T>
) =>
  z
    .array(schema)
    .min(1, "At least one element is required")
    .refine((arr) => uniqueArray(arr.map((item) => item.name)), {
      message: "Names must be unique"
    })

const nameSchema = z.string().min(1)
const dollarSchema = z.coerce.number().nonnegative().default(0)
const paySchema = z.object({
  target: nameSchema,
  value: dollarSchema
})
export type PaySchema = z.infer<typeof paySchema>

const playerSchema = z
  .object({
    name: nameSchema,
    cashIn: dollarSchema,
    cashOut: dollarSchema,
    net: z.number(),
    paidBy: z.array(paySchema),
    paidTo: z.array(paySchema)
  })
  .refine(
    (player) => {
      const { net, paidBy, paidTo } = player
      if (Math.abs(net) < 1e-9) {
        return paidBy.length === 0 && paidTo.length === 0
      }
      const sum = (arr: PaySchema[]) => arr.reduce((s, p) => s + p.value, 0)
      const paymentSum = net < 0 ? sum(paidBy) : sum(paidTo)
      return Math.abs(Math.abs(net) - paymentSum) < 1e-9
    },
    {
      message:
        "The sum of payments must be equal to the absolute value of the net winnings/losses"
    }
  )
export type PlayerSchema = z.infer<typeof playerSchema>

export const gameSchema = z.object({
  players: uniqueNameArraySchema(
    playerSchema.pick({ name: true, cashIn: true, cashOut: true })
  )
})
export type GameSchema = z.infer<typeof gameSchema>

export const payoutSchema = z
  .object({
    players: uniqueNameArraySchema(playerSchema),
    slippage: z.number()
  })
  .refine(
    (payout) => {
      const totalNet = payout.players.reduce((sum, p) => sum + p.net, 0)
      return Math.abs(totalNet) < 1e-9
    },
    {
      message: "The sum of all player net amounts must be zero."
    }
  )
export type PayoutSchema = z.infer<typeof payoutSchema>
