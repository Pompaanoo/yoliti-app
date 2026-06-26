import Link from "next/link";
import { getTranslations, getLocale } from "next-intl/server";
import { createAdminClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth";
import type { Profile, Payment } from "@/lib/types";

export const metadata = { title: "Alumnos — Yoliti Academy" };

interface EnrollmentRow { user_id: string; course_id: string; status: string }

export default async function AlumnosPage() {
  const [, t, locale] = await Promise.all([
    requireRole("super_admin"),
    getTranslations("adminAlumnos"),
    getLocale(),
  ]);
  const admin = createAdminClient();

  const { data: { users: authUsers } } = await admin.auth.admin.listUsers({ perPage: 1000 });
  const { data: profilesRaw } = await admin.from("profiles").select("*").order("created_at", { ascending: false });
  const profiles = (profilesRaw as Profile[]) ?? [];

  const { data: enrollmentsRaw } = await admin.from("enrollments").select("user_id, course_id, status");
  const enrollments = (enrollmentsRaw as EnrollmentRow[]) ?? [];

  let payments: Payment[] = [];
  try {
    const { data } = await admin.from("payments").select("user_id, amount_cents, status");
    payments = (data as Payment[]) ?? [];
  } catch { /* tabla payments aún no existe */ }

  const students = profiles
    .filter((p) => p.role === "alumno")
    .map((p) => {
      const authUser = authUsers?.find((u: { id: string; email?: string }) => u.id === p.id);
      const enrolled = enrollments.filter((e) => e.user_id === p.id);
      const paid = payments.filter((pay) => pay.user_id === p.id && pay.status === "paid");
      return {
        ...p,
        email: authUser?.email ?? "—",
        enrollmentCount: enrolled.length,
        totalPaidCents: paid.reduce((s, pay) => s + pay.amount_cents, 0),
      };
    });

  const totalRevenueCents = students.reduce((s, st) => s + st.totalPaidCents, 0);
  const dateLocale = locale === "en" ? "en-US" : "es-MX";

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-secondary">{t("title")}</h1>
        <p className="mt-1 text-sm text-base-content/60">{t("subtitle")}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { icon: "fa-users",     label: t("statTotal"),   value: students.length },
          { icon: "fa-book-open", label: t("statActive"),  value: enrollments.filter((e) => e.status === "activo").length },
          { icon: "fa-peso-sign", label: t("statRevenue"), value: totalRevenueCents > 0
              ? `$${(totalRevenueCents / 100).toLocaleString(dateLocale, { minimumFractionDigits: 2 })} MXN`
              : "—" },
        ].map((m) => (
          <div key={m.label} className="rounded-box border border-base-300 bg-base-100 p-5">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
                <i className={`fa-solid ${m.icon}`} />
              </span>
              <div>
                <p className="text-2xl font-extrabold text-secondary">{m.value}</p>
                <p className="text-xs text-base-content/50">{m.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <section className="rounded-box border border-base-300 bg-base-100 shadow-sm">
        <div className="border-b border-base-300 px-6 py-4">
          <h2 className="font-bold text-secondary">{t("listTitle")}</h2>
        </div>
        {students.length === 0 ? (
          <p className="p-8 text-center text-sm text-base-content/40">{t("empty")}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>{t("colStudent")}</th>
                  <th>{t("colEmail")}</th>
                  <th className="text-center">{t("colCourses")}</th>
                  <th className="text-right">{t("colPaid")}</th>
                  <th>{t("colRegistered")}</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s.id} className="hover">
                    <td>
                      <div className="flex items-center gap-3">
                        <span className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-full bg-secondary text-secondary-content text-sm font-bold">
                          {(s.full_name || "A").charAt(0).toUpperCase()}
                        </span>
                        <span className="font-medium">{s.full_name || t("noName")}</span>
                      </div>
                    </td>
                    <td className="text-sm text-base-content/70">{s.email}</td>
                    <td className="text-center">
                      <span className="badge badge-ghost">{s.enrollmentCount}</span>
                    </td>
                    <td className="text-right font-semibold">
                      {s.totalPaidCents > 0 ? (
                        <span className="text-success">
                          ${(s.totalPaidCents / 100).toLocaleString(dateLocale, { minimumFractionDigits: 2 })} MXN
                        </span>
                      ) : (
                        <span className="text-base-content/30">—</span>
                      )}
                    </td>
                    <td className="text-xs text-base-content/50">
                      {new Date(s.created_at).toLocaleDateString(dateLocale, { year: "numeric", month: "short", day: "numeric" })}
                    </td>
                    <td>
                      <Link href={`/admin/alumnos/${s.id}`} className="btn btn-ghost btn-xs text-primary">
                        {t("viewDetail")} <i className="fa-solid fa-arrow-right text-[10px]" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
