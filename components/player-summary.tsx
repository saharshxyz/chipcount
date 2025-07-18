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
import { IoLogoVenmo } from "react-icons/io5"
import { SiCashapp } from "react-icons/si"

const Stat = ({ label, value: val }: { label: string; value: number }) => (
  <div className="bg-secondary flex w-full flex-col items-center justify-center rounded-sm py-1.5 transition-all">
    <p>{label}</p>
    <p className="font-bold">{formatDollar(val)}</p>
  </div>
)

const Target = ({
  target,
  isSending,
  val
}: {
  target: string
  isSending: boolean
  val: number
}) => {
  let link: string = ""

  if (target[0] === "@")
    link = `https://venmo.com/?txn=${isSending ? "pay" : "charge"}&audience=friends&recipients=${target.substring(1)}&amount=${val.toFixed(2)}`
  if (target[0] === "$") link = `https://cash.app/$${target.substring(1)}`

  console.log(target)

  return link ? (
    <a
      href={link}
      target="_blank"
      referrerPolicy="no-referrer"
      rel="noopener"
      className="text-link inline-flex flex-row items-center"
    >
      <span>{target.substring(1)}</span>
      {target[0] === "@" ? (
        <IoLogoVenmo className="ml-1" />
      ) : target[0] === "$" ? (
        <SiCashapp className="ml-1" />
      ) : null}
    </a>
  ) : (
    <>{target}</>
  )
}

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
        <CardTitle>{player.displayName}</CardTitle>
        <CardDescription className="flex flex-row items-center justify-center gap-2 transition-all">
          <Stat label="Cash In" value={player.cashIn} />
          <Stat label="Cash Out" value={player.cashOut} />
          {Math.abs(slippage) > 1e-9 && (
            <Stat label="Slippage" value={slippage} />
          )}
        </CardDescription>
        <CardAction
          className={`text-2xl font-semibold ${player.net > 1e-9
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
                      {type.preposition}{" "}
                      <Target
                        target={to.target}
                        isSending={type.variant === "destructive"}
                        val={to.value}
                      />
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
