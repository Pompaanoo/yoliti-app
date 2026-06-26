/** Formatea centavos a "USD 6,900" — sin decimales para precios redondos. */
export function formatPrice(cents: number, currency = "usd") {
  const amount = cents / 100;
  const hasDecimals = amount % 1 !== 0;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: hasDecimals ? 2 : 0,
    currencyDisplay: "code",
  }).format(amount);
}
