import { notFound } from "next/navigation";
import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth";
import type { Profile, Payment, Course } from "@/lib/types";

export const metadata = { title: "Detalle de alumno — Yoliti Academy" };

interface EnrollmentWithCourse {
  id: string;
  course_id: string;
  status: string;
  created_at: string;
  courses: Pick<Course, "title" | "slug" | "cover_url" | "price_cents">;
}

interface PaymentWithCourse extends Payment {
  courses: { title: string } | null;
}

const STATUS_BADGE: Record<string, string> = {
  paid: "badge-success text-white",
  pending: "badge-warning text-white",
  failed: "badge-error text-white",
  refunded: "badge-ghost",
};

const STATUS_LABEL: Record<string, string> = {
  paid: "Pagado",
  pending: "Pendiente",
  failed: "Fallido",
  refunded: "Reembolsado",
};

export default async function AlumnoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await requireRole("super_admin");
  const admin = createAdminClient();

  // Perfil
  const { data: profileRaw } = await admin
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();
  if (!profileRaw) notFound();
  const profile = profileRaw as Profile;

  // Email desde auth
  const { data: { user: authUser } } = await admin.auth.admin.getUserById(id);

  // Inscripciones
  const { data: enrollmentsRaw } = await admin
    .from("enrollments")
    .select("id, course_id, status, created_at, courses(title, slug, cover_url, price_cents)")
    .eq("user_id", id)
    .order("created_at", { ascending: false });
  const enrollments = (enrollmentsRaw as EnrollmentWithCourse[]) ?? [];

  // Pagos
  let payments: PaymentWithCourse[] = [];
  try {
    const { data } = await admin
      .from("payments")
      .select("*, courses(title)")
      .eq("user_id", id)
      .order("created_at", { ascending: false });
    payments = (data as PaymentWithCourse[]) ?? [];
  } catch {
    // tabla payments aún no existe
  }

  // Progreso general
  const { data: progressRaw } = await admin
    .from("lesson_progress")
    .select("completed, progress_pct")
    .eq("user_id", id);
  const progress = progressRaw ?? [];
  const completedLessons = progress.filter((r: { completed: boolean }) => r.completed).length;
  const avgPct =
    progress.length > 0
      ? Math.round(
          progress.reduce((s: number, r: { progress_pct: number }) => s + r.progress_pct, 0) /
            progress.length
        )
      : 0;

  const totalPaidCents = payments
    .filter((p) => p.status === "paid")
    .reduce((s, p) => s + p.amount_cents, 0);

  const stripeLink = (p: PaymentWithCourse) =>
    p.stripe_payment_intent
      ? `https://dashboard.stripe.com/payments/${p.stripe_payment_intent}`
      : p.stripe_session_id
      ? `https://dashboard.stripe.com/checkout/sessions/${p.stripe_session_id}`
      : null;

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Link href="/admin/alumnos" className="btn btn-ghost btn-sm mt-1">
          <i className="fa-solid fa-arrow-left" />
        </Link>
        <div className="flex-1 min-w-0">
          <p className="mb-1 text-xs text-base-content/40">
            <Link href="/admin/alumnos" className="hover:text-primary">Alumnos</Link>
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <span className="grid h-12 w-12 flex-shrink-0 place-items-center rounded-full bg-secondary text-secondary-content text-lg font-bold">
              {(profile.full_name || "A").charAt(0).toUpperCase()}
            </span>
            <div>
              <h1 className="text-2xl font-extrabold text-secondary">
                {profile.full_name || "Sin nombre"}
              </h1>
              <p className="text-sm text-base-content/50">{authUser?.email ?? "—"}</p>
            </div>
            <span className="badge badge-ghost capitalize ml-2">
              {profile.role.replace("_", " ")}
            </span>
          </div>
        </div>
        <div className="text-right text-xs text-base-content/40">
          <p>Registrado</p>
          <p className="font-medium text-base-content/60">
            {new Date(profile.created_at).toLocaleDateString("es-MX", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        {[
          { icon: "fa-book-open", label: "Cursos inscritos", value: enrollments.length },
          { icon: "fa-circle-check", label: "Lecciones completadas", value: completedLessons },
          {
            icon: "fa-chart-simple",
            label: "Progreso promedio",
            value: progress.length > 0 ? `${avgPct}%` : "—",
          },
          {
            icon: "fa-peso-sign",
            label: "Total pagado",
            value:
              totalPaidCents > 0
                ? `$${(totalPaidCents / 100).toLocaleString("es-MX", { minimumFractionDigits: 2 })}`
                : "—",
          },
        ].map((m) => (
          <div
            key={m.label}
            className="rounded-box border border-base-300 bg-base-100 p-4"
          >
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                <i className={`fa-solid ${m.icon} text-sm`} />
              </span>
              <div>
                <p className="text-xl font-extrabold text-secondary">{m.value}</p>
                <p className="text-xs text-base-content/50">{m.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cursos inscritos */}
      <section className="rounded-box border border-base-300 bg-base-100 shadow-sm">
        <div className="border-b border-base-300 px-6 py-4">
          <h2 className="font-bold text-secondary">Cursos inscritos</h2>
        </div>
        {enrollments.length === 0 ? (
          <p className="p-6 text-sm text-base-content/40">Sin inscripciones.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Curso</th>
                  <th>Estado</th>
                  <th>Precio</th>
                  <th>Inscrito</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {enrollments.map((e) => (
                  <tr key={e.id} className="hover">
                    <td className="font-medium">{e.courses?.title ?? "—"}</td>
                    <td>
                      <span
                        className={`badge badge-sm capitalize ${
                          e.status === "activo" ? "badge-success text-white" : "badge-ghost"
                        }`}
                      >
                        {e.status}
                      </span>
                    </td>
                    <td className="text-sm">
                      {e.courses?.price_cents
                        ? `$${(e.courses.price_cents / 100).toLocaleString("es-MX", { minimumFractionDigits: 2 })} MXN`
                        : "Gratis"}
                    </td>
                    <td className="text-xs text-base-content/50">
                      {new Date(e.created_at).toLocaleDateString("es-MX", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td>
                      {e.courses?.slug && (
                        <Link
                          href={`/cursos/${e.courses.slug}`}
                          target="_blank"
                          className="btn btn-ghost btn-xs"
                        >
                          <i className="fa-solid fa-arrow-up-right-from-square text-[10px]" />
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Historial de pagos */}
      <section className="rounded-box border border-base-300 bg-base-100 shadow-sm">
        <div className="border-b border-base-300 px-6 py-4 flex items-center justify-between">
          <h2 className="font-bold text-secondary">Historial de pagos</h2>
          <span className="text-xs text-base-content/40">
            {payments.length === 0 ? "Sin registros" : `${payments.length} transacciones`}
          </span>
        </div>
        {payments.length === 0 ? (
          <div className="p-8 text-center">
            <i className="fa-solid fa-receipt text-3xl text-base-content/20" />
            <p className="mt-3 text-sm text-base-content/40">
              Sin pagos registrados.
            </p>
            <p className="mt-1 text-xs text-base-content/30">
              Los pagos aparecerán aquí cuando se conecte Stripe.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>ID Pago</th>
                  <th>Curso</th>
                  <th>Monto</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                  <th>Stripe</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((pay) => {
                  const link = stripeLink(pay);
                  return (
                    <tr key={pay.id} className="hover">
                      <td>
                        <code className="text-xs text-base-content/50">
                          {pay.id.slice(0, 8)}…
                        </code>
                      </td>
                      <td className="font-medium">
                        {pay.courses?.title ?? "—"}
                      </td>
                      <td className="font-semibold">
                        ${(pay.amount_cents / 100).toLocaleString("es-MX", {
                          minimumFractionDigits: 2,
                        })}{" "}
                        <span className="text-xs font-normal text-base-content/40 uppercase">
                          {pay.currency}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`badge badge-sm ${STATUS_BADGE[pay.status] ?? "badge-ghost"}`}
                        >
                          {STATUS_LABEL[pay.status] ?? pay.status}
                        </span>
                      </td>
                      <td className="text-xs text-base-content/50">
                        {pay.paid_at
                          ? new Date(pay.paid_at).toLocaleDateString("es-MX", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : new Date(pay.created_at).toLocaleDateString("es-MX", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                      </td>
                      <td>
                        {link ? (
                          <a
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-ghost btn-xs gap-1 text-primary"
                          >
                            <i className="fa-brands fa-stripe text-sm" />
                            Ver en Stripe
                          </a>
                        ) : (
                          <span className="text-xs text-base-content/30">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* IDs técnicos */}
      {payments.length > 0 && (
        <section className="rounded-box border border-base-300 bg-base-100 p-6 shadow-sm">
          <h2 className="mb-4 font-bold text-secondary">Referencias técnicas</h2>
          <div className="space-y-3">
            {payments.map((pay) => (
              <div
                key={pay.id}
                className="grid gap-1 rounded-xl bg-base-200 px-4 py-3 text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="w-32 text-base-content/40">Payment ID</span>
                  <code className="text-secondary">{pay.id}</code>
                </div>
                {pay.stripe_session_id && (
                  <div className="flex items-center gap-2">
                    <span className="w-32 text-base-content/40">Session ID</span>
                    <code className="text-secondary">{pay.stripe_session_id}</code>
                  </div>
                )}
                {pay.stripe_payment_intent && (
                  <div className="flex items-center gap-2">
                    <span className="w-32 text-base-content/40">Payment Intent</span>
                    <code className="text-secondary">{pay.stripe_payment_intent}</code>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
