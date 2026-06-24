// Utilidades puras de formato — SIN secretos.
// Seguras de importar tanto en componentes de servidor como de cliente.

/** Formatea centavos a una cadena tipo "$499.00 MXN". */
export function formatPrice(cents: number, currency = "mxn") {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(cents / 100);
}
