import Link from "next/link";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getProfile } from "@/lib/auth";
import Logo from "@/components/Logo";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [profile, t] = await Promise.all([
    getProfile(),
    getTranslations("app"),
  ]);
  if (!profile) redirect("/login");

  const isStaff = profile.role === "maestro" || profile.role === "super_admin";
  const isAdmin = profile.role === "super_admin";

  const links = [
    { href: "/dashboard",          label: t("myLearning"),        icon: "fa-graduation-cap" },
    { href: "/mis-calificaciones", label: t("myGrades"),          icon: "fa-chart-bar" },
  ];

  if (isStaff) {
    links.push(
      { href: "/admin/cursos",  label: t("courseManagement"), icon: "fa-book-open" },
      { href: "/admin/grupos",  label: t("groups"),            icon: "fa-people-group" }
    );
  }

  if (isAdmin) {
    links.push(
      { href: "/admin/alumnos",    label: t("students"),         icon: "fa-user-graduate" },
      { href: "/admin/maestros",   label: t("teachers"),         icon: "fa-chalkboard-user" },
      { href: "/admin/progreso",   label: t("studentProgress"),  icon: "fa-chart-line" },
      { href: "/admin/categorias", label: t("categories"),       icon: "fa-tags" },
      { href: "/admin",            label: t("administration"),   icon: "fa-shield-halved" }
    );
  }

  links.push({ href: "/cuenta", label: t("myAccount"), icon: "fa-circle-user" });

  return (
    <div className="flex h-screen overflow-hidden bg-base-200">
      {/* Sidebar desktop */}
      <aside className="hidden w-64 flex-shrink-0 flex-col border-r border-base-300 bg-base-100 md:flex">
        <Link href="/" className="flex items-center border-b border-base-300 p-5">
          <Logo className="h-9" />
        </Link>
        <nav className="flex-1 p-3">
          <ul className="menu gap-1">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href}>
                  <i className={`fa-solid ${l.icon} w-4`} /> {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="border-t border-base-300 p-4">
          <div className="flex items-center gap-3">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.full_name ?? "Avatar"}
                className="h-9 w-9 flex-shrink-0 rounded-full object-cover"
              />
            ) : (
              <span className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-full bg-secondary text-secondary-content text-sm font-bold">
                {(profile.full_name || "U").charAt(0).toUpperCase()}
              </span>
            )}
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">
                {profile.full_name || "Usuario"}
              </p>
              <p className="text-xs capitalize text-base-content/50">
                {profile.role.replace("_", " ")}
              </p>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <LanguageSwitcher />
            <form action="/auth/sign-out" method="post">
              <button className="btn btn-ghost btn-sm text-error" title={t("signOut")}>
                <i className="fa-solid fa-right-from-bracket" />
              </button>
            </form>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Top bar móvil */}
        <header className="flex flex-shrink-0 items-center justify-between border-b border-base-300 bg-base-100 px-4 py-3 md:hidden">
          <Link href="/" className="flex items-center">
            <Logo className="h-7" />
          </Link>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-sm">
                <i className="fa-solid fa-bars" />
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content menu z-50 mt-2 w-52 rounded-box border border-base-300 bg-base-100 p-2 shadow-xl"
              >
                {links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href}>
                      <i className={`fa-solid ${l.icon} w-4`} /> {l.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <form action="/auth/sign-out" method="post">
                    <button className="text-error">
                      <i className="fa-solid fa-right-from-bracket w-4" /> {t("exit")}
                    </button>
                  </form>
                </li>
              </ul>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 md:p-10">{children}</main>
      </div>
    </div>
  );
}
