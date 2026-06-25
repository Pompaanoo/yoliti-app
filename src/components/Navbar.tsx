import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { getProfile } from "@/lib/auth";
import Logo from "@/components/Logo";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const NAV = [
  { href: "/cursos", key: "courses" },
  { href: "/nosotros", key: "about" },
  { href: "/blog", key: "blog" },
  { href: "/contacto", key: "contact" },
] as const;

export default async function Navbar() {
  const profile = await getProfile();
  const t = await getTranslations("nav");

  const roleLabel = (role: string) =>
    role === "super_admin"
      ? t("roleAdmin")
      : role === "maestro"
        ? t("roleMaestro")
        : t("roleAlumno");

  return (
    <header className="sticky top-0 z-50 border-b border-base-300 bg-base-100/90 backdrop-blur">
      <div className="navbar mx-auto max-w-7xl px-4">
        {/* Marca */}
        <div className="flex-1">
          <Link href="/" className="flex items-center">
            <Logo className="h-9 md:h-10" />
          </Link>
        </div>

        {/* Links desktop */}
        <nav className="hidden md:flex">
          <ul className="menu menu-horizontal gap-1 px-1 font-medium">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link href={n.href}>{t(n.key)}</Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Acciones */}
        <div className="ml-2 flex items-center gap-2">
          <LanguageSwitcher />

          {profile ? (
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-sm gap-2"
              >
                <span className="grid h-7 w-7 place-items-center rounded-full bg-secondary text-secondary-content text-xs font-bold">
                  {(profile.full_name || "U").charAt(0).toUpperCase()}
                </span>
                <span className="hidden sm:inline">
                  {profile.full_name || t("account")}
                </span>
                <i className="fa-solid fa-chevron-down text-xs" />
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content menu z-50 mt-2 w-56 rounded-box border border-base-300 bg-base-100 p-2 shadow-xl"
              >
                <li className="menu-title text-xs">
                  {t("role")}: {roleLabel(profile.role)}
                </li>
                <li>
                  <Link href="/dashboard">
                    <i className="fa-solid fa-graduation-cap w-4" /> {t("myLearning")}
                  </Link>
                </li>
                {(profile.role === "maestro" ||
                  profile.role === "super_admin") && (
                  <li>
                    <Link href="/maestro">
                      <i className="fa-solid fa-chalkboard-user w-4" /> {t("teacherPanel")}
                    </Link>
                  </li>
                )}
                {profile.role === "super_admin" && (
                  <li>
                    <Link href="/admin">
                      <i className="fa-solid fa-shield-halved w-4" /> {t("admin")}
                    </Link>
                  </li>
                )}
                <li>
                  <form action="/auth/sign-out" method="post">
                    <button type="submit" className="text-error">
                      <i className="fa-solid fa-right-from-bracket w-4" /> {t("logout")}
                    </button>
                  </form>
                </li>
              </ul>
            </div>
          ) : (
            <>
              <Link href="/login" className="btn btn-ghost btn-sm">
                {t("login")}
              </Link>
              <Link href="/registro" className="btn btn-primary btn-sm">
                {t("register")}
              </Link>
            </>
          )}

          {/* Menú hamburguesa móvil */}
          <div className="dropdown dropdown-end md:hidden">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-sm">
              <i className="fa-solid fa-bars" />
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu z-50 mt-2 w-48 rounded-box border border-base-300 bg-base-100 p-2 shadow-xl"
            >
              {NAV.map((n) => (
                <li key={n.href}>
                  <Link href={n.href}>{t(n.key)}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}
