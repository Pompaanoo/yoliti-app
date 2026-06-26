/** Formatea centavos como "USD $6,900" o "MXN $6,900" */
export function formatPrice(cents: number, currency = "usd") {
  const amount = cents / 100;
  const hasDecimals = amount % 1 !== 0;
  const symbol = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    currencyDisplay: "narrowSymbol",
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: hasDecimals ? 2 : 0,
  }).format(amount);
  return `${currency.toUpperCase()} ${symbol}`;
}
