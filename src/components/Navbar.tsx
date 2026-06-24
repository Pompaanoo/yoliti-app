import Link from "next/link";
import { getProfile } from "@/lib/auth";

const NAV = [
  { href: "/cursos", label: "Cursos" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/blog", label: "Blog" },
  { href: "/contacto", label: "Contacto" },
];

export default async function Navbar() {
  const profile = await getProfile();

  return (
    <header className="sticky top-0 z-50 border-b border-base-300 bg-base-100/90 backdrop-blur">
      <div className="navbar mx-auto max-w-7xl px-4">
        {/* Marca */}
        <div className="flex-1">
          <Link href="/" className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-content">
              <i className="fa-solid fa-feather" />
            </span>
            <span className="text-xl font-extrabold tracking-tight text-secondary">
              Yoliti<span className="text-primary"> Academy</span>
            </span>
          </Link>
        </div>

        {/* Links desktop */}
        <nav className="hidden md:flex">
          <ul className="menu menu-horizontal gap-1 px-1 font-medium">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link href={n.href}>{n.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Acciones */}
        <div className="ml-2 flex items-center gap-2">
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
                  {profile.full_name || "Mi cuenta"}
                </span>
                <i className="fa-solid fa-chevron-down text-xs" />
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content menu z-50 mt-2 w-56 rounded-box border border-base-300 bg-base-100 p-2 shadow-xl"
              >
                <li className="menu-title text-xs">
                  Rol: {roleLabel(profile.role)}
                </li>
                <li>
                  <Link href="/dashboard">
                    <i className="fa-solid fa-graduation-cap w-4" /> Mi aprendizaje
                  </Link>
                </li>
                {(profile.role === "maestro" ||
                  profile.role === "super_admin") && (
                  <li>
                    <Link href="/maestro">
                      <i className="fa-solid fa-chalkboard-user w-4" /> Panel maestro
                    </Link>
                  </li>
                )}
                {profile.role === "super_admin" && (
                  <li>
                    <Link href="/admin">
                      <i className="fa-solid fa-shield-halved w-4" /> Administración
                    </Link>
                  </li>
                )}
                <li>
                  <form action="/auth/sign-out" method="post">
                    <button type="submit" className="text-error">
                      <i className="fa-solid fa-right-from-bracket w-4" /> Cerrar sesión
                    </button>
                  </form>
                </li>
              </ul>
            </div>
          ) : (
            <>
              <Link href="/login" className="btn btn-ghost btn-sm">
                Entrar
              </Link>
              <Link href="/registro" className="btn btn-primary btn-sm">
                Registrarme
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
                  <Link href={n.href}>{n.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}

function roleLabel(role: string) {
  return role === "super_admin"
    ? "Super admin"
    : role === "maestro"
      ? "Maestro"
      : "Alumno";
}
