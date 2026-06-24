import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { stripe, stripeEnabled } from "@/lib/stripe";

/**
 * Inicia el checkout de un curso.
 *
 * - Si Stripe está configurado → crea una sesión real y devuelve la URL.
 * - Si NO (MODO STUB, credenciales pendientes) → inscribe directo y
 *   devuelve la URL del curso para que puedas probar todo el flujo.
 */
export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const { courseId } = await req.json();
  if (!courseId) {
    return NextResponse.json({ error: "Falta courseId" }, { status: 400 });
  }

  const { data: course } = await supabase
    .from("courses")
    .select("id, slug, title, price_cents, currency")
    .eq("id", courseId)
    .single();

  if (!course) {
    return NextResponse.json({ error: "Curso no encontrado" }, { status: 404 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  // ── Curso gratis o Stripe deshabilitado → inscripción inmediata ──
  if (course.price_cents === 0 || !stripeEnabled || !stripe) {
    await supabase
      .from("enrollments")
      .upsert(
        { user_id: user.id, course_id: course.id, status: "activo" },
        { onConflict: "user_id,course_id" }
      );

    return NextResponse.json({
      stub: !stripeEnabled && course.price_cents > 0,
      url: `${siteUrl}/aprender/${course.slug}`,
    });
  }

  // ── Stripe real ──────────────────────────────────────────────────
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: user.email,
    line_items: [
      {
        price_data: {
          currency: course.currency,
          product_data: { name: course.title },
          unit_amount: course.price_cents,
        },
        quantity: 1,
      },
    ],
    metadata: { course_id: course.id, user_id: user.id },
    success_url: `${siteUrl}/aprender/${course.slug}?pago=ok`,
    cancel_url: `${siteUrl}/cursos/${course.slug}?pago=cancelado`,
  });

  return NextResponse.json({ url: session.url });
}
