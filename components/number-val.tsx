import NumberFlow from "@number-flow/react"

export function NumberValue({ value }: { value: number }) {
  return (
    <NumberFlow
      value={value}
      format={{
        style: "currency",
        currency: "USD",
        trailingZeroDisplay: "stripIfInteger"
      }}
    />
  )
}
