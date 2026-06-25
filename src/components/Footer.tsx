import Link from "next/link";
import { getTranslations } from "next-intl/server";

export default async function Footer() {
  const t = await getTranslations("footer");
  const nav = await getTranslations("nav");
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
              {t("tagline")}
            </p>
          </div>

          {/* Explorar */}
          <nav className="text-center sm:text-left">
            <h4 className="font-semibold">{t("explore")}</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-neutral-content/70">
              <li><Link href="/cursos" className="hover:text-primary">{nav("courses")}</Link></li>
              <li><Link href="/nosotros" className="hover:text-primary">{nav("about")}</Link></li>
              <li><Link href="/blog" className="hover:text-primary">{nav("blog")}</Link></li>
              <li><Link href="/contacto" className="hover:text-primary">{nav("contact")}</Link></li>
            </ul>
          </nav>

          {/* Cuenta */}
          <nav className="text-center sm:text-left">
            <h4 className="font-semibold">{t("account")}</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-neutral-content/70">
              <li><Link href="/login" className="hover:text-primary">{nav("login")}</Link></li>
              <li><Link href="/registro" className="hover:text-primary">{nav("register")}</Link></li>
              <li><Link href="/dashboard" className="hover:text-primary">{nav("myLearning")}</Link></li>
            </ul>
          </nav>
        </div>
      </div>

      <div className="border-t border-neutral-content/10">
        <div className="mx-auto max-w-7xl px-6 py-5 text-center text-xs text-neutral-content/50 sm:px-8">
          © {new Date().getFullYear()} Centro Yolitia. {t("rights")}
        </div>
      </div>
    </footer>
  );
}
