import Stripe from "stripe";

/**
 * Integración de Stripe — MODO STUB.
 *
 * El cliente todavía no entrega las credenciales. Mientras
 * STRIPE_SECRET_KEY esté vacío, `stripeEnabled` es false y el flujo
 * de checkout simula la inscripción sin cobrar (ver
 * /api/stripe/checkout). Cuando lleguen las llaves, basta con
 * rellenar .env.local y todo el código real se activa solo.
 */
export const stripeEnabled = Boolean(process.env.STRIPE_SECRET_KEY);

export const stripe = stripeEnabled
  ? new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2025-02-24.acacia",
    })
  : null;
