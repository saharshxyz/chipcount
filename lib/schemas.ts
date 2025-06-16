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

const nameSchema = z.string().min(1)
const dollarSchema = z.coerce.number().nonnegative()
const paySchema = z.object({
  target: nameSchema,
  value: dollarSchema
})
export type PaySchema = z.infer<typeof paySchema>

const playerSchema = z.object({
  name: nameSchema,
  cashIn: dollarSchema,
  cashOut: dollarSchema,
  net: z.number(),
  paidBy: z
    .array(paySchema)
    .describe(
      "Payments this player made to others. 'target' is who they paid."
    ),
  paidTo: z
    .array(paySchema)
    .describe(
      "Payments this player received from others. 'target' is who paid them."
    )
})
export type PlayerSchema = z.infer<typeof playerSchema>

export const gameSchema = z.object({
  description: z
    .string()
    .max(60)
    .default(`${formattedDateTime()} Game`)
    .optional(),
  players: uniqueNameArraySchema(
    playerSchema.pick({ name: true, cashIn: true, cashOut: true })
  )
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
