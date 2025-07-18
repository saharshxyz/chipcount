"use client"

import { PayoutSchema } from "@/lib/schemas"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart"
import { Label, LabelList, Pie, PieChart } from "recharts"
import { useMemo } from "react"
import { formatDollar } from "@/lib/utils"
import chroma from "chroma-js"

export function DonutCharts({ payout }: { payout: PayoutSchema }) {
  const players = payout.players.toSorted((a, b) => b.net - a.net)
  const smallestNet = players[players.length - 1].net
  const largestNet = players[0].net

  const genColors = (lowerBound: number, upperBound: number) => {
    const rootStyles = window.getComputedStyle(document.documentElement) // Will error on first load, but will refresh and work
    const success = rootStyles.getPropertyValue("--color-success").trim()
    const destructive = rootStyles
      .getPropertyValue("--color-destructive")
      .trim()
    const muted = rootStyles.getPropertyValue("--muted-foreground").trim()

    return chroma
      .scale([success, muted, destructive])
      .mode("lrgb")
      .domain([lowerBound, 0, upperBound])
      .colors(upperBound + Math.abs(lowerBound) + 1)
      .toReversed()
  }

  const colors = genColors(smallestNet, largestNet)

  const playersData = players.map((player) => ({
    name: player.displayName,
    cashIn: player.cashIn,
    cashOut: player.cashOut,
    fill: colors[Math.floor(player.net + Math.abs(smallestNet))]
  }))

  const chartConfig = Object.fromEntries(
    playersData.map((player) => [player.name, { label: player.name }])
  ) satisfies ChartConfig

  const totalPot = useMemo(() => {
    return playersData.reduce((acc, curr) => acc + curr.cashOut, 0)
  }, [playersData])

  return (
    <ChartContainer
      config={chartConfig}
      className="m-auto mx-auto aspect-6/5 h-[250px]"
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              indicator="line"
              labelFormatter={(_, payload) => {
                switch (payload[0].dataKey) {
                  case "cashOut":
                    return "Cash Out"
                  case "cashIn":
                    return "Cash In"
                  default:
                    return "Cash In/Out"
                }
              }}
            />
          }
        />
        <Pie
          data={playersData.filter((player) => player.cashOut !== 0)}
          dataKey="cashOut"
          nameKey="name"
          outerRadius={100}
          innerRadius={90}
          strokeWidth={1}
          paddingAngle={5}
        >
          <LabelList
            dataKey="name"
            position="outside"
            offset={8}
            className="fill-foreground"
            stroke="none"
          />
        </Pie>

        <Pie
          data={playersData.filter((player) => player.cashIn !== 0)}
          dataKey="cashIn"
          nameKey="name"
          outerRadius={80}
          innerRadius={totalPot < 100 ? 50 : totalPot < 1000 ? 60 : 63.5}
          paddingAngle={5}
        >
          {Math.abs(payout.slippage) < 1e-9 && (
            <Label
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy}
                        className="fill-foreground text-3xl font-bold"
                      >
                        {formatDollar(Math.floor(totalPot))}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 24}
                        className="fill-muted-foreground"
                      >
                        Total Pot
                      </tspan>
                    </text>
                  )
                }
              }}
            />
          )}
        </Pie>
      </PieChart>
    </ChartContainer>
  )
}
