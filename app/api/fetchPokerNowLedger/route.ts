import { NextResponse } from "next/server"

const POKERNOW_URL_PATTERN = /^https:\/\/www\.pokernow\.club\/games\/[a-zA-Z0-9_-]+\/ledger_[a-zA-Z0-9_-]+\.csv$/

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get("url")

  if (!url) {
    return NextResponse.json(
      { error: "PokerNow URL is required." },
      { status: 400 }
    )
  }

  if (!POKERNOW_URL_PATTERN.test(url)) {
    return NextResponse.json(
      { error: "Invalid PokerNow ledger URL format." },
      { status: 400 }
    )
  }

  try {
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(
        `Failed to fetch: ${response.status} ${response.statusText}`
      )
    }

    const csvData = await response.text()
    return NextResponse.json({ csvData })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "An unknown error occurred"
    return NextResponse.json(
      { error: `Failed to fetch CSV: ${message}` },
      { status: 500 }
    )
  }
}
