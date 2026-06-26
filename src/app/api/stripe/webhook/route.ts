import { NextResponse } from "next/server";
import { stripe, stripeEnabled } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/server";

/**
 * Webhook de Stripe. Confirma inscripción y guarda el pago cuando
 * el checkout se completa. Inactivo hasta que lleguen las credenciales
 * (STRIPE_SECRET_KEY + STRIPE_WEBHOOK_SECRET).
 */
export async function POST(req: Request) {
  if (!stripeEnabled || !stripe) {
    return NextResponse.json({ received: true, stub: true });
  }

  const sig = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!sig || !secret) {
    return NextResponse.json({ error: "Falta firma" }, { status: 400 });
  }

  const body = await req.text();
  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, secret);
  } catch (err) {
    return NextResponse.json(
      { error: `Firma inválida: ${(err as Error).message}` },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as {
      id: string;
      amount_total: number | null;
      currency: string;
      payment_intent: string | null;
      metadata?: { course_id?: string; user_id?: string };
    };

    const courseId = session.metadata?.course_id;
    const userId = session.metadata?.user_id;

    if (courseId && userId) {
      const admin = createAdminClient();

      // Inscribir alumno
      await admin
        .from("enrollments")
        .upsert(
          { user_id: userId, course_id: courseId, status: "activo" },
          { onConflict: "user_id,course_id" }
        );

      // Guardar registro de pago
      await admin
        .from("payments")
        .upsert(
          {
            user_id: userId,
            course_id: courseId,
            amount_cents: session.amount_total ?? 0,
            currency: session.currency ?? "mxn",
            stripe_session_id: session.id,
            stripe_payment_intent:
              typeof session.payment_intent === "string"
                ? session.payment_intent
                : null,
            status: "paid",
            paid_at: new Date().toISOString(),
          },
          { onConflict: "stripe_session_id" }
        );
    }
  }

  return NextResponse.json({ received: true });
}
