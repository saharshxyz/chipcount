import { PlayerSchema } from "@/lib/schemas"
import { ChartConfig, ChartContainer } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, Cell, LabelList } from "recharts"
import { formatDollar } from "@/lib/utils"

export function NegativeChart({ players }: { players: PlayerSchema[] }) {
  const chartConfig = {
    net: {
      label: "Net"
    }
  } satisfies ChartConfig

  return (
    <ChartContainer
      config={chartConfig}
      className="min-h-[300px] w-full h-full max-h-[500px]"
    >
      <BarChart accessibilityLayer data={players}>
        <CartesianGrid vertical={false} />
        <Bar dataKey="net">
          <LabelList position="bottom" dataKey="name" fillOpacity={1} />
          <LabelList
            position="top"
            dataKey="net"
            fillOpacity={1}
            formatter={(val: number) => formatDollar(val)}
          />
          {players.map((item) => (
            <Cell
              key={item.name}
              fill={
                item.net > 1e-9
                  ? "var(--success)"
                  : item.net < -1e-9
                    ? "var(--destructive)"
                    : "var(--muted-foreground)"
              }
            />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  )
}
