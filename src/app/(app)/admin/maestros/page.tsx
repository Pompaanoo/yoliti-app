import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth";
import type { Profile } from "@/lib/types";
import { AutoDismissAlert } from "@/app/(app)/cuenta/_components/AutoDismissAlert";

export const metadata = { title: "Maestros — Yoliti Academy" };

async function updateTeacherStatus(formData: FormData) {
  "use server";
  await requireRole("super_admin");
  const supabase = await createClient();
  const userId = String(formData.get("userId"));
  const status = String(formData.get("website_status"));

  if (status === "publico") {
    const { data: profile } = await supabase
      .from("profiles")
      .select("avatar_url")
      .eq("id", userId)
      .single();
    if (!profile?.avatar_url) {
      redirect("/admin/maestros?error=El+maestro+necesita+una+imagen+de+perfil+antes+de+poder+publicarlo");
    }
  }

  await supabase.from("profiles").update({ website_status: status }).eq("id", userId);
  revalidatePath("/admin/maestros");
}

export default async function MaestrosPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const [, t, locale] = await Promise.all([
    requireRole("super_admin"),
    getTranslations("adminMaestros"),
    getLocale(),
  ]);

  const supabase = await createClient();
  const admin = createAdminClient();

  const { data: teachersRaw } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "maestro")
    .order("full_name");

  const teachers = (teachersRaw as Profile[]) ?? [];

  const { data: { users: authUsers } } = await admin.auth.admin.listUsers({ perPage: 1000 });

  const teachersWithEmail = teachers.map((p) => {
    const authUser = authUsers?.find((u: { id: string; email?: string }) => u.id === p.id);
    return { ...p, email: authUser?.email ?? "" };
  });

  const { data: courseCountsRaw } = await supabase
    .from("courses")
    .select("teacher_id")
    .in("teacher_id", teachers.map((t) => t.id));

  const coursesPerTeacher: Record<string, number> = {};
  for (const c of courseCountsRaw ?? []) {
    const tid = (c as { teacher_id: string }).teacher_id;
    coursesPerTeacher[tid] = (coursesPerTeacher[tid] ?? 0) + 1;
  }

  const dateLocale = locale === "en" ? "en-US" : "es-MX";

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-secondary">{t("title")}</h1>
        <p className="mt-1 text-sm text-base-content/60">{t("subtitle")}</p>
      </div>

      {error && <AutoDismissAlert type="error" message={decodeURIComponent(error)} />}

      {teachers.length === 0 ? (
        <div className="rounded-box border border-dashed border-base-300 p-16 text-center text-sm text-base-content/40">
          {t("empty")}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {teachersWithEmail.map((teacher) => {
            const isPublic = teacher.website_status === "publico";
            const hasImage = !!teacher.avatar_url;
            const courseCount = coursesPerTeacher[teacher.id] ?? 0;

            return (
              <div
                key={teacher.id}
                className="rounded-box border border-base-300 bg-base-100 p-6 shadow-sm flex flex-col gap-4"
              >
                {/* Avatar */}
                <div className="flex items-center gap-4">
                  {teacher.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={teacher.avatar_url}
                      alt={teacher.full_name ?? ""}
                      className="h-16 w-16 flex-shrink-0 rounded-full object-cover border-2 border-base-300"
                    />
                  ) : (
                    <span className="grid h-16 w-16 flex-shrink-0 place-items-center rounded-full bg-secondary text-secondary-content text-2xl font-bold border-2 border-base-300">
                      {(teacher.full_name || teacher.email || "?").charAt(0).toUpperCase()}
                    </span>
                  )}
                  <div className="min-w-0">
                    <p className="font-bold text-secondary truncate">
                      {teacher.full_name || teacher.email || "—"}
                    </p>
                    <p className="text-xs text-base-content/40 truncate">{teacher.email}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <span
                        className={`badge badge-sm ${isPublic ? "badge-success text-white" : "badge-ghost"}`}
                      >
                        {isPublic ? t("statusPublic") : t("statusHidden")}
                      </span>
                      <span className="text-xs text-base-content/40">
                        <i className="fa-solid fa-book mr-1" />{courseCount}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="text-xs text-base-content/40">
                  <i className="fa-solid fa-calendar mr-1" />
                  {new Date(teacher.created_at).toLocaleDateString(dateLocale, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </div>

                {/* No image warning */}
                {!hasImage && (
                  <div className="rounded-lg bg-warning/10 border border-warning/30 px-3 py-2 text-xs text-warning flex items-start gap-2">
                    <i className="fa-solid fa-triangle-exclamation mt-0.5 flex-shrink-0" />
                    {t("noImageWarning")}
                  </div>
                )}

                {/* Visibility form */}
                <form action={updateTeacherStatus} className="flex items-center gap-2 mt-auto">
                  <input type="hidden" name="userId" value={teacher.id} />
                  <label className="text-xs font-medium text-base-content/60 shrink-0">
                    {t("visibility")}
                  </label>
                  <select
                    name="website_status"
                    defaultValue={teacher.website_status}
                    className="select select-bordered select-sm flex-1"
                    disabled={!hasImage}
                  >
                    <option value="oculto">{t("statusHidden")}</option>
                    <option value="publico">{t("statusPublic")}</option>
                  </select>
                  <button
                    type="submit"
                    disabled={!hasImage}
                    className="btn btn-primary btn-sm"
                    title={!hasImage ? t("imageRequired") : undefined}
                  >
                    <i className="fa-solid fa-floppy-disk" />
                  </button>
                </form>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
