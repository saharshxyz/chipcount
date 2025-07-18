"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import Link from "next/link"
import Papa, { ParseResult } from "papaparse"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { ArrowLeft, Loader2 } from "lucide-react"

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
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { pokerNowSchema } from "@/lib/schemas"
import { convertPokerNow, parseZipson } from "@/lib/utils"

const pokerNowUrlRegex = new RegExp(
  /^https:\/\/www\.pokernow\.club\/games\/([^/]+)$/
)

const importUrlSchema = z.object({
  url: z
    .string()
    .url({ message: "Please enter a valid URL." })
    .regex(pokerNowUrlRegex, {
      message: "Please provide a valid PokerNow game URL."
    })
})
type ImportUrlSchema = z.infer<typeof importUrlSchema>

const importLedgerSchema = z.object({
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
type ImportLedgerSchema = z.infer<typeof importLedgerSchema>

const processParsedData = (result: ParseResult<unknown>) => {
  if (result.errors.length) {
    const errorMessages = result.errors.map((e) => e.message).join(", ")
    throw new Error(`CSV Parsing Error: ${errorMessages}`)
  }

  const validation = pokerNowSchema.safeParse(result.data)
  if (!validation.success)
    throw new Error(JSON.stringify(validation.error, null, 2))

  return convertPokerNow(validation.data)
}

export default function ImportPage() {
  const router = useRouter()

  const urlForm = useForm<ImportUrlSchema>({
    resolver: zodResolver(importUrlSchema),
    defaultValues: { url: "" }
  })

  const ledgerForm = useForm<ImportLedgerSchema>({
    resolver: zodResolver(importLedgerSchema),
    defaultValues: { csvData: "" }
  })

  async function onUrlSubmit(values: ImportUrlSchema) {
    const match = values.url.match(pokerNowUrlRegex)
    const gameId = match![1]
    const ledgerUrl = `https://www.pokernow.club/games/${gameId}/ledger_${gameId}.csv`

    return new Promise<void>((resolve) => {
      Papa.parse(ledgerUrl, {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          try {
            const convertedGame = processParsedData(result)
            router.push(
              `/?game=${encodeURIComponent(parseZipson.serialize(convertedGame))}`
            )
          } catch (error) {
            urlForm.setError("url", {
              type: "manual",
              message:
                error instanceof Error
                  ? error.message
                  : "An unexpected error occurred."
            })
          } finally {
            resolve()
          }
        },
        error: (error) => {
          urlForm.setError("url", {
            type: "manual",
            message: `Failed to download or parse CSV: ${error.message}`
          })
          resolve()
        }
      })
    })
  }

  async function onLedgerSubmit(values: ImportLedgerSchema) {
    try {
      const result = Papa.parse(values.csvData, {
        header: true,
        skipEmptyLines: true
      })
      const convertedGame = processParsedData(result)
      router.push(
        `/?game=${encodeURIComponent(parseZipson.serialize(convertedGame))}`
      )
    } catch (error) {
      ledgerForm.setError("csvData", {
        type: "manual",
        message:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred."
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
          <Tabs defaultValue="url" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="url">From URL</TabsTrigger>
              <TabsTrigger value="ledger">Paste Ledger</TabsTrigger>
            </TabsList>

            <TabsContent value="url">
              <Form {...urlForm}>
                <form
                  onSubmit={urlForm.handleSubmit(onUrlSubmit)}
                  className="space-y-4 pt-4"
                >
                  <FormField
                    control={urlForm.control}
                    name="url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Game URL</FormLabel>
                        <FormDescription>
                          Paste the URL of your PokerNow game lobby.
                        </FormDescription>
                        <FormControl>
                          <Input
                            placeholder="https://www.pokernow.club/games/..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={urlForm.formState.isSubmitting}
                  >
                    {urlForm.formState.isSubmitting && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Import from URL
                  </Button>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="ledger">
              <Form {...ledgerForm}>
                <form
                  onSubmit={ledgerForm.handleSubmit(onLedgerSubmit)}
                  className="space-y-4 pt-4"
                >
                  <FormField
                    control={ledgerForm.control}
                    name="csvData"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ledger</FormLabel>
                        <FormDescription>
                          Log → Ledger → Download Ledger → Copy/Paste the data
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
                    disabled={ledgerForm.formState.isSubmitting}
                  >
                    {ledgerForm.formState.isSubmitting && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Parse Ledger
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
