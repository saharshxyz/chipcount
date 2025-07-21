"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import {
  useFieldArray,
  useForm,
  Control,
  UseFormReturn,
  UseFieldArrayAppend,
  UseFieldArrayRemove
} from "react-hook-form"
import { X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
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
import { gameSchema, GameSchema, PlayerSchema } from "@/lib/schemas"
import { formattedDateTime } from "@/lib/utils"
import { useQueryState } from "nuqs"
import { parseZipson } from "@/lib/utils"
import { useEffect } from "react"

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export function GameForm() {
  const [game, setGame] = useQueryState("game", {
    ...parseZipson,
    history: "replace",
    throttleMs: 5000
  })

  const form = useForm<GameSchema>({
    resolver: zodResolver(gameSchema),
    defaultValues: {
      description: game?.description || `${formattedDateTime()} Game`,
      players: game?.players || [
        { name: "", cashIn: "", cashOut: "" },
        { name: "", cashIn: "", cashOut: "" }
      ]
    }
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "players"
  })

  useEffect(() => {
    const subscription = form.watch((value) => {
      const parsedVal = gameSchema.safeParse(value)
      setGame(parsedVal.success ? parsedVal.data : value)
    })
    return () => subscription.unsubscribe()
  }, [form, setGame])

  async function onSubmit(values: GameSchema) {
    await sleep(500)
    setGame(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Game description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <PlayerFields
          form={form}
          fields={fields}
          append={append}
          remove={remove}
        />
        <Button
          type="submit"
          className="w-full"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          Submit
        </Button>
      </form>
    </Form>
  )
}


const PlayerField = ({
  control,
  name,
  placeholder,
  className
}: {
  control: Control<GameSchema>
  name: `players.${number}.name`
  placeholder: string
  className?: string
}) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem className={className}>
        <FormControl>
          <Input placeholder={placeholder} {...field} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
)

const NumericPlayerField = ({
  control,
  name,
  placeholder
}: {
  control: Control<GameSchema>
  name: `players.${number}.cashIn` | `players.${number}.cashOut`
  placeholder: string
}) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem className="w-32 sm:w-24">
        <FormControl>
          <Input
            type="number"
            placeholder={placeholder}
            {...field}
            onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
)

const PlayerFields = ({
  form,
  fields,
  append,
  remove
}: {
  form: UseFormReturn<GameSchema>
  fields: ReturnType<
    typeof useFieldArray<GameSchema, "players", "id">
  >["fields"]
  append: UseFieldArrayAppend<GameSchema, "players">
  remove: UseFieldArrayRemove
}) => (
  <div className="space-y-2">
    <FormLabel className="grow">Players</FormLabel>
    <FormDescription>
      Prefix names with @ or $ to link to Venmo and Cashapp
    </FormDescription>
    {fields.map((field, index) => (
      <div key={field.id} className="flex items-start space-x-2">
        <PlayerField
          control={form.control}
          name={`players.${index}.name`}
          placeholder={`Player ${index + 1}`}
          className="grow"
        />
        <NumericPlayerField
          control={form.control}
          name={`players.${index}.cashIn`}
          placeholder="In"
        />
        <NumericPlayerField
          control={form.control}
          name={`players.${index}.cashOut`}
          placeholder="Out"
        />
        <Button
          type="button"
          variant="destructive"
          size="icon"
          onClick={() => remove(index)}
          disabled={fields.length <= 2}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    ))}
    <div>
      <FormMessage>
        {form.formState.errors.players?.root?.message}
      </FormMessage>
    </div>
    <Button
      type="button"
      variant="outline"
      onClick={() => append({} as PlayerSchema)}
      className="w-full"
    >
      Add Player
    </Button>
  </div>
)