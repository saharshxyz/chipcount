"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { gameSchema, GameSchema } from "@/lib/schemas"
import { formattedDateTime } from "@/lib/utils"
import { useQueryState } from "nuqs"
import { parseZipson } from "@/lib/utils"
import { useEffect } from "react"

export function GameForm() {
  const [game, setGame] = useQueryState("game", {
    ...parseZipson,
    history: "replace",
    throttleMs: 2000
  })

  const form = useForm<GameSchema>({
    resolver: zodResolver(gameSchema),
    defaultValues: {
      description: game?.description || `${formattedDateTime()} Game`,
      players: game?.players || [
        { name: "", cashIn: 0, cashOut: 0 },
        { name: "", cashIn: 0, cashOut: 0 }
      ]
    }
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "players"
  })

  useEffect(() => {
    const subscription = form.watch((value) => {
      gameSchema
        .safeParseAsync(value)
        .then((result) => {
          if (result.success) setGame(result.data)
        })
        .catch((err) => console.error("Async validation error:", err))
    })

    return () => subscription.unsubscribe()
  }, [form, setGame])

  const onSubmit = (values: GameSchema) => setGame(values)

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

        <div className="space-y-2">
          <FormLabel>Players</FormLabel>
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-start space-x-2">
              <FormField
                control={form.control}
                name={`players.${index}.name`}
                render={({ field }) => (
                  <FormItem className="grow">
                    <FormControl>
                      <Input placeholder={`Player ${index + 1}`} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`players.${index}.cashIn`}
                render={({ field }) => (
                  <FormItem className="w-24">
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="In"
                        {...field}
                        onChange={(e) =>
                          field.onChange(e.target.valueAsNumber || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`players.${index}.cashOut`}
                render={({ field }) => (
                  <FormItem className="w-24">
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Out"
                        {...field}
                        onChange={(e) =>
                          field.onChange(e.target.valueAsNumber || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
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
            onClick={() => append({ name: "", cashIn: 0, cashOut: 0 })}
            className="w-full"
          >
            Add Player
          </Button>
        </div>
        <Button type="submit" className="w-full">
          Submit
        </Button>
      </form>
    </Form>
  )
}
