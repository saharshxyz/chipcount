import { PlayerSchema } from "@/lib/schemas"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { TrendingDown, TrendingUp } from "lucide-react"
import { formatDollar } from "@/lib/utils"

const Stat = ({ label, value }: { label: string; value: number }) => (
  <div className="bg-secondary flex items-center justify-center flex-col py-1.5 w-full rounded-sm transition-all">
    <p>{label}</p>
    <p className="font-bold">{formatDollar(value)}</p>
  </div>
)

export function PlayerSummary({
  player,
  slippage
}: {
  player: PlayerSchema
  slippage: number
}) {
  const transactionTypes = [
    {
      data: player.paidBy,
      variant: "destructive",
      icon: <TrendingDown />,
      title: "Owes",
      preposition: "to"
    },
    {
      data: player.paidTo,
      variant: "success",
      icon: <TrendingUp />,
      title: "Receives",
      preposition: "from"
    }
  ] as const

  const nonEmptyTransactions = transactionTypes.filter((t) => t.data.length > 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>{player.name}</CardTitle>
        <CardDescription className="flex flex-row items-center justify-center gap-2 transition-all">
          <Stat label="Cash In" value={player.cashIn} />
          <Stat label="Cash Out" value={player.cashOut} />
          {Math.abs(slippage) > 1e-9 && (
            <Stat label="Slippage" value={slippage} />
          )}
        </CardDescription>
        <CardAction
          className={`text-2xl font-semibold ${
            player.net > 1e-9
              ? "text-success"
              : player.net < -1e-9
                ? "text-destructive"
                : ""
          }`}
        >
          {formatDollar(player.net)}
        </CardAction>
      </CardHeader>
      {nonEmptyTransactions.length > 0 && (
        <CardContent className="space-y-2">
          {nonEmptyTransactions.map((type) => (
            <Alert variant={type.variant} key={type.title}>
              {type.icon}
              <AlertTitle>{type.title}</AlertTitle>
              <AlertDescription>
                <ul>
                  {type.data.map((to) => (
                    <li key={to.target}>
                      <span className="font-bold">
                        {formatDollar(to.value)}
                      </span>{" "}
                      {type.preposition} {to.target}
                    </li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          ))}
        </CardContent>
      )}
    </Card>
  )
}
