"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import Link from "next/link"
import Papa from "papaparse"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft } from "lucide-react"
import { pokerNowSchema } from "@/lib/schemas"
import { convertPokerNow, parseZipson } from "@/lib/utils"

const importSchema = z.object({
  csvData: z
    .string()
    .min(10, "CSV data is required")
    .refine(
      (data) =>
        data.includes("player_nickname") &&
        data.includes("session_start_at") &&
        data.includes("buy_in") &&
        data.includes("buy_out") &&
        data.includes("stack"),
      "CSV must contain headers: player_nickname, session_start_at, buy_in, buy_out, stack"
    )
})

type ImportSchema = z.infer<typeof importSchema>

export default function ImportPage() {
  const router = useRouter()

  const form = useForm<ImportSchema>({
    resolver: zodResolver(importSchema),
    defaultValues: {
      csvData: ""
    }
  })

  async function onSubmit(values: ImportSchema) {
    try {
      const result = Papa.parse(values.csvData, {
        header: true,
        skipEmptyLines: true
      })
      const parseResult = pokerNowSchema.safeParse(result.data)

      if (result.errors.length)
        throw new Error(result.errors.map((e) => e.message).join(", "))
      if (!parseResult.success)
        throw new Error(JSON.stringify(parseResult.error, null, 2))

      const convertedGame = convertPokerNow(parseResult.data)
      router.push(
        `/?game=${encodeURIComponent(parseZipson.serialize(convertedGame))}`
      )
    } catch (error) {
      form.setError("csvData", {
        type: "manual",
        message:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred"
      })
    }
  }

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <Link href="/">
        <Button variant="link">
          <ArrowLeft className="h-4 w-4" /> Back to form
        </Button>
      </Link>
      <Card className="w-full max-w-prose">
        <CardHeader>
          <CardTitle>Import from PokerNow</CardTitle>
          <CardDescription>
            Import from PokerNow with game link or ledger
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="csvData"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ledger</FormLabel>
                    <FormDescription>
                      Log {"->"} Ledger {"->"} Download Ledger {"->"} Copy/Paste
                      the Ledger
                    </FormDescription>
                    <FormControl>
                      <Textarea
                        placeholder="player_nickname,buy_in,buy_out&#10;Player1,100,200&#10;Player2,100,50"
                        {...field}
                        className="h-32"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Parse Ledger
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
