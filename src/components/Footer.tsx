import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-base-300 bg-neutral text-neutral-content">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-content">
              <i className="fa-solid fa-feather" />
            </span>
            <span className="text-xl font-extrabold">Yoliti Academy</span>
          </div>
          <p className="mt-4 max-w-sm text-sm text-neutral-content/70">
            Aprendizaje con propósito: bienestar, inteligencia emocional y
            comunicación clínica para profesionales de habla hispana.
          </p>
        </div>
        <div>
          <h4 className="font-semibold">Explorar</h4>
          <ul className="mt-3 space-y-2 text-sm text-neutral-content/70">
            <li><Link href="/cursos" className="hover:text-primary">Cursos</Link></li>
            <li><Link href="/nosotros" className="hover:text-primary">Nosotros</Link></li>
            <li><Link href="/blog" className="hover:text-primary">Blog</Link></li>
            <li><Link href="/contacto" className="hover:text-primary">Contacto</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold">Cuenta</h4>
          <ul className="mt-3 space-y-2 text-sm text-neutral-content/70">
            <li><Link href="/login" className="hover:text-primary">Entrar</Link></li>
            <li><Link href="/registro" className="hover:text-primary">Registrarme</Link></li>
            <li><Link href="/dashboard" className="hover:text-primary">Mi aprendizaje</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-neutral-content/10 py-4 text-center text-xs text-neutral-content/50">
        © {new Date().getFullYear()} Yoliti Academy. Todos los derechos reservados.
      </div>
    </footer>
  );
}
