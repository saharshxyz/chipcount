"use client"

import { useState } from "react"
import Link from "next/link"
import Papa from "papaparse"
import { useRouter } from "next/navigation"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Info } from "lucide-react"
import { pokerNowSchema } from "@/lib/schemas"
import * as z from "zod"
import { convertPokerNow, parseZipson } from "@/lib/utils"

export default function ImportPage() {
  const [csvInput, setCsvInput] = useState("")
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleParse = () => {
    setError(null)
    try {
      const result = Papa.parse(csvInput, {
        header: true,
        skipEmptyLines: true
      })
      const parseResult = pokerNowSchema.safeParse(result.data)

      if (result.errors.length)
        throw new Error(result.errors.map((e) => e.message).join(", "))
      if (!parseResult.success)
        throw new Error(z.prettifyError(parseResult.error))

      const convertedGame = convertPokerNow(parseResult.data)
      const serializedGame = parseZipson.serialize(convertedGame)

      router.push(`/?game=${encodeURIComponent(serializedGame)}`)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "An unexpected error occurred")
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
            Paste PokerNow ledger into the text area below.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="player_nickname,buy_in,buy_out\nPlayer1,100,200\nPlayer2,100,50"
            value={csvInput}
            onChange={(e) => setCsvInput(e.target.value)}
            className="h-48"
          />
          <Button onClick={handleParse} className="w-full">
            Parse Ledger
          </Button>
          {error && (
            <Alert variant="destructive">
              <Info className="h-5 w-5" />
              <AlertTitle>Parsing Failed</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
