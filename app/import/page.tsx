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
import { GameSchema, pokerNowSchema } from "@/lib/schemas"
import { convertPokerNow, parseZipson } from "@/lib/utils"

const pokerNowUrlRegex = /^https:\/\/www\.pokernow\.club\/games\/([^/]+)$/

const importSchema = z
  .object({
    type: z.enum(["url", "ledger"]),
    url: z.string().optional(),
    csvData: z.string().optional()
  })
  .refine(
    (data) => {
      if (data.type === "url") {
        return (
          data.url &&
          z.string().url().safeParse(data.url).success &&
          pokerNowUrlRegex.test(data.url)
        )
      }
      if (data.type === "ledger") {
        return (
          data.csvData &&
          data.csvData.length >= 10 &&
          data.csvData.includes("player_nickname") &&
          data.csvData.includes("session_start_at") &&
          data.csvData.includes("buy_in") &&
          data.csvData.includes("buy_out") &&
          data.csvData.includes("stack")
        )
      }
      return false
    },
    {
      message: "Invalid input for selected type"
    }
  )

type ImportSchema = z.infer<typeof importSchema>

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

  const form = useForm<ImportSchema>({
    resolver: zodResolver(importSchema),
    defaultValues: { type: "url", url: "", csvData: "" }
  })

  const activeTab = form.watch("type")

  const navigateToGame = (convertedGame: GameSchema) =>
    router.push(
      `/?game=${encodeURIComponent(parseZipson.serialize(convertedGame))}`
    )

  const handleError = (error: unknown, field: keyof ImportSchema) => {
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred."
    if (field === "url" || field === "csvData")
      form.setError(field, { type: "manual", message })
  }

  const fetchFromUrl = async (url: string) => {
    const gameId = url.match(pokerNowUrlRegex)![1]
    const ledgerUrl = `https://www.pokernow.club/games/${gameId}/ledger_${gameId}.csv`

    const response = await fetch(
      `/api/fetchPokerNowLedger?url=${encodeURIComponent(ledgerUrl)}`
    )
    const data = await response.json()

    if (!response.ok || data.error)
      throw new Error(data.error || "Failed to fetch data from server.")

    return data.csvData
  }

  const parseCsvData = (csvData: string) => {
    return new Promise<GameSchema>((resolve, reject) => {
      Papa.parse(csvData, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          try {
            const convertedGame = processParsedData(result)
            resolve(convertedGame)
          } catch (error) {
            reject(error)
          }
        },
        error: (error: Error) =>
          reject(new Error(`Failed to parse CSV: ${error.message}`))
      })
    })
  }

  const onSubmit = async (values: ImportSchema) => {
    try {
      let csvData: string

      if (values.type === "url") {
        form.clearErrors("url")
        csvData = await fetchFromUrl(values.url!)
      } else {
        form.clearErrors("csvData")
        csvData = values.csvData!
      }

      const convertedGame = await parseCsvData(csvData)
      navigateToGame(convertedGame)
    } catch (error) {
      const fieldName = values.type === "url" ? "url" : "csvData"
      handleError(error, fieldName)
    }
  }

  const renderFormField = () => {
    if (activeTab === "url") {
      return (
        <FormField
          control={form.control}
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
      )
    }

    return (
      <FormField
        control={form.control}
        name="csvData"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Ledger</FormLabel>
            <FormDescription>
              Log → Ledger → Download Ledger → Copy/Paste the data
            </FormDescription>
            <FormControl>
              <Textarea
                placeholder="player_nickname,buy_in,buy_out\nPlayer1,100,200\nPlayer2,100,50"
                {...field}
                className="h-32"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    )
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
            <Tabs
              value={activeTab}
              onValueChange={(value) =>
                form.setValue("type", value as "url" | "ledger")
              }
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="url">From URL</TabsTrigger>
                <TabsTrigger value="ledger">Paste Ledger</TabsTrigger>
              </TabsList>

              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 pt-4"
              >
                <TabsContent value="url" className="space-y-4">
                  {renderFormField()}
                </TabsContent>

                <TabsContent value="ledger" className="space-y-4">
                  {renderFormField()}
                </TabsContent>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {activeTab === "url" ? "Import from URL" : "Parse Ledger"}
                </Button>
              </form>
            </Tabs>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
