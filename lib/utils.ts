/**
 * Lightweight className combiner. Filters out falsy values so conditional
 * classes can be passed inline without pulling in extra dependencies.
 */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Formats a numeric amount as a USD-style currency string (no decimals),
 * e.g. 400000 -> "$400,000".
 */
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}
