import Link from "next/link";
import { redirect } from "next/navigation";
import { getProfile } from "@/lib/auth";
import Logo from "@/components/Logo";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getProfile();
  if (!profile) redirect("/login");

  const isStaff =
    profile.role === "maestro" || profile.role === "super_admin";
  const isAdmin = profile.role === "super_admin";

  const links = [
    { href: "/dashboard", label: "Mi aprendizaje", icon: "fa-graduation-cap" },
    { href: "/mis-calificaciones", label: "Mis calificaciones", icon: "fa-chart-bar" },
  ];

  if (isStaff) {
    links.push(
      { href: "/admin/cursos", label: "Gestión de cursos", icon: "fa-book-open" },
      { href: "/admin/grupos", label: "Grupos", icon: "fa-people-group" }
    );
  }

  if (isAdmin) {
    links.push(
      { href: "/admin/alumnos", label: "Alumnos", icon: "fa-user-graduate" },
      { href: "/admin/progreso", label: "Progreso alumnos", icon: "fa-chart-line" },
      { href: "/admin/categorias", label: "Categorías", icon: "fa-tags" },
      { href: "/admin", label: "Administración", icon: "fa-shield-halved" }
    );
  }

  links.push({ href: "/cuenta", label: "Mi cuenta", icon: "fa-circle-user" });

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
          <form action="/auth/sign-out" method="post" className="mt-3">
            <button className="btn btn-ghost btn-sm btn-block justify-start text-error">
              <i className="fa-solid fa-right-from-bracket" /> Cerrar sesión
            </button>
          </form>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Top bar móvil */}
        <header className="flex flex-shrink-0 items-center justify-between border-b border-base-300 bg-base-100 px-4 py-3 md:hidden">
          <Link href="/" className="flex items-center">
            <Logo className="h-7" />
          </Link>
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
                    <i className="fa-solid fa-right-from-bracket w-4" /> Salir
                  </button>
                </form>
              </li>
            </ul>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 md:p-10">{children}</main>
      </div>
    </div>
  );
}
