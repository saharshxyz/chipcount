import { useMemo } from "react";

export function DollarValue({ value }: { value: number }) {
  const formatter = useMemo(() =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      trailingZeroDisplay: "stripIfInteger",
    })
    , []);

  return <>{formatter.format(value)}</>;
}