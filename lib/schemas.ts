import { z } from "zod"
import { formattedDateTime } from "./utils"

const uniqueArray = <T>(arr: T[]): boolean => arr.length === new Set(arr).size

const uniqueNameArraySchema = <T extends { name: string }>(
  schema: z.ZodType<T>
) =>
  z
    .array(schema)
    .min(2, "At least players are required")
    .refine((arr) => uniqueArray(arr.map((item) => item.name)), {
      message: "Player names must be unique"
    })

const nameSchema = z.string().min(1).max(30).trim()
const dollarSchema = z.coerce.number().nonnegative()
const paySchema = z.object({
  target: nameSchema,
  value: dollarSchema
})
export type PaySchema = z.infer<typeof paySchema>

const basicPlayerSchema = z.object({
  name: nameSchema,
  cashIn: dollarSchema,
  cashOut: dollarSchema
})
export type BasicPlayerSchema = z.infer<typeof basicPlayerSchema>

const playerSchema = basicPlayerSchema.extend({
  displayName: nameSchema,
  net: z.number(),
  paidBy: z
    .array(paySchema)
    .describe(
      "Payments this player received from others. 'target' is who paid them."
    ),
  paidTo: z
    .array(paySchema)
    .describe("Payments this player made to others. 'target' is who they paid.")
})
export type PlayerSchema = z.infer<typeof playerSchema>

export const gameSchema = z.object({
  description: z
    .string()
    .max(60)
    .trim()
    .default(`${formattedDateTime()} Game`)
    .optional(),
  players: uniqueNameArraySchema(basicPlayerSchema)
})
export type GameSchema = z.infer<typeof gameSchema>

export const payoutSchema = z.object({
  players: uniqueNameArraySchema(playerSchema),
  slippage: z
    .number()
    .describe(
      "Extra or uncounted for chips. To be distributed equally by all players."
    )
})
export type PayoutSchema = z.infer<typeof payoutSchema>

const centsToDollar = dollarSchema.transform((val) => val / 100)

export const pokerNowSchema = z.array(
  z.object({
    player_nickname: z.string(),
    session_start_at: z.string(),
    buy_in: centsToDollar,
    buy_out: centsToDollar,
    stack: centsToDollar
  })
)
export type PokerNowSchema = z.infer<typeof pokerNowSchema>
