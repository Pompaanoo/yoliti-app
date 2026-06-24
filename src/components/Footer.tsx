import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-base-300 bg-neutral text-neutral-content sm:mt-24">
      <div className="mx-auto w-full max-w-7xl px-6 py-12 sm:px-8 sm:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-4 md:gap-8">
          {/* Marca + descripción */}
          <div className="flex flex-col items-center text-center sm:col-span-2 sm:items-start sm:text-left">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/logo-eslogan.png"
              alt="Centro Yolitia"
              className="h-16 w-auto object-contain sm:h-20"
            />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-neutral-content/70">
              Aprendizaje con propósito: bienestar, inteligencia emocional y
              comunicación clínica para profesionales de habla hispana.
            </p>
          </div>

          {/* Explorar */}
          <nav className="text-center sm:text-left">
            <h4 className="font-semibold">Explorar</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-neutral-content/70">
              <li><Link href="/cursos" className="hover:text-primary">Cursos</Link></li>
              <li><Link href="/nosotros" className="hover:text-primary">Nosotros</Link></li>
              <li><Link href="/blog" className="hover:text-primary">Blog</Link></li>
              <li><Link href="/contacto" className="hover:text-primary">Contacto</Link></li>
            </ul>
          </nav>

          {/* Cuenta */}
          <nav className="text-center sm:text-left">
            <h4 className="font-semibold">Cuenta</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-neutral-content/70">
              <li><Link href="/login" className="hover:text-primary">Entrar</Link></li>
              <li><Link href="/registro" className="hover:text-primary">Registrarme</Link></li>
              <li><Link href="/dashboard" className="hover:text-primary">Mi aprendizaje</Link></li>
            </ul>
          </nav>
        </div>
      </div>

      <div className="border-t border-neutral-content/10">
        <div className="mx-auto max-w-7xl px-6 py-5 text-center text-xs text-neutral-content/50 sm:px-8">
          © {new Date().getFullYear()} Centro Yolitia. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
