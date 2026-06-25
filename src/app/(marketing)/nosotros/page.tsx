import Link from "next/link";
import { getTranslations } from "next-intl/server";

export const metadata = {
  title: "Nosotros — Yolitia Academy",
  description:
    "Yolitia Academy fue creada para ir más allá de la educación tradicional, ofreciendo un enfoque más profundo y humano para el aprendizaje, el crecimiento y la transformación.",
};

const VALUE_STYLES = [
  ["fa-heart", "text-primary", "bg-primary/10"],
  ["fa-lightbulb", "text-accent", "bg-accent/10"],
  ["fa-brain", "text-secondary", "bg-info/30"],
  ["fa-check-circle", "text-neutral", "bg-neutral/10"],
] as const;

const TEAM_INFO = [
  ["https://placehold.co/200x200/0D5C6E/5ECFCA?text=GW", "Dr. Gerardo Wence-Munoz, PhD"],
] as const;

export default async function NosotrosPage() {
  const t = await getTranslations("nosotros");
  const values = t.raw("values") as { title: string; desc: string }[];
  const team = t.raw("team") as { role: string; bio: string }[];
  const whoWeServe = t.raw("whoWeServeItems") as { icon: string; label: string }[];

  return (
    <div>
      {/* Hero */}
      <section className="hero-gradient text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 sm:px-8 lg:grid-cols-2">
          <div>
            <span className="mb-3 block text-xs font-semibold uppercase tracking-widest text-info">
              {t("heroLabel")}
            </span>
            <h1 className="text-4xl font-extrabold leading-tight lg:text-5xl">
              {t("heroTitle")}
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-white/80">
              {t("heroDesc")}
            </p>
          </div>
          <div className="hidden lg:block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://placehold.co/560x400/162E22/5ECFCA?text=Yolitia+Academy"
              alt="Yolitia Academy"
              className="w-full rounded-box shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* Misión / Visión */}
      <section className="mx-auto grid max-w-7xl gap-8 px-6 py-16 sm:px-8 md:grid-cols-2">
        <div className="rounded-box border border-primary/15 bg-primary/5 p-8">
          <span className="mb-5 grid h-12 w-12 place-items-center rounded-xl bg-primary/15 text-xl text-primary">
            <i className="fa-solid fa-bullseye" />
          </span>
          <h2 className="mb-4 text-xl font-bold text-secondary">{t("missionTitle")}</h2>
          <p className="leading-relaxed text-base-content/70">{t("missionDesc")}</p>
        </div>
        <div className="rounded-box border border-accent/15 bg-accent/5 p-8">
          <span className="mb-5 grid h-12 w-12 place-items-center rounded-xl bg-accent/15 text-xl text-accent">
            <i className="fa-solid fa-eye" />
          </span>
          <h2 className="mb-4 text-xl font-bold text-secondary">{t("visionTitle")}</h2>
          <p className="leading-relaxed text-base-content/70">{t("visionDesc")}</p>
        </div>
      </section>

      {/* Por qué la educación tradicional se queda corta */}
      <section className="bg-secondary text-secondary-content">
        <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8">
          <div className="grid items-start gap-14 lg:grid-cols-2">
            {/* Columna izquierda: título llamativo */}
            <div>
              <span className="mb-4 block text-xs font-semibold uppercase tracking-widest text-info">
                {t("historyLabel")}
              </span>
              <h2 className="text-4xl font-extrabold leading-tight lg:text-5xl">
                {t("educationGapLabel")}
              </h2>
              <p className="mt-6 text-xl font-medium italic leading-relaxed text-secondary-content/70">
                {t("educationGapSub")}
              </p>
            </div>
            {/* Columna derecha: párrafos explicativos */}
            <div className="space-y-5 border-l border-white/10 pl-0 pt-2 lg:pl-10">
              <p className="leading-relaxed text-secondary-content/80">
                {t("historyP1")}
              </p>
              <p className="leading-relaxed text-secondary-content/80">
                {t("historyP2")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Filosofía / Valores */}
      <section className="mx-auto max-w-7xl px-6 py-16 sm:px-8">
        <div className="mb-12 text-center">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-primary">
            {t("valuesLabel")}
          </span>
          <h2 className="text-3xl font-bold text-secondary">{t("valuesTitle")}</h2>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v, i) => {
            const [icon, color, bg] = VALUE_STYLES[i];
            return (
              <div key={v.title} className="p-6 text-center">
                <span
                  className={`mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl ${bg} ${color} text-xl`}
                >
                  <i className={`fa-solid ${icon}`} />
                </span>
                <h3 className="mb-2 font-bold text-secondary">{v.title}</h3>
                <p className="text-sm text-base-content/60">{v.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Equipo */}
      <section className="bg-base-200">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8">
          <div className="mb-12 text-center">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-primary">
              {t("teamLabel")}
            </span>
            <h2 className="text-3xl font-bold text-secondary">{t("teamTitle")}</h2>
          </div>
          <div className="mx-auto max-w-lg">
            {team.map((member, i) => {
              const [img, name] = TEAM_INFO[i];
              return (
                <div key={name} className="text-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img}
                    alt={name}
                    className="mx-auto mb-4 h-32 w-32 rounded-full object-cover shadow-lg"
                  />
                  <h3 className="text-lg font-bold text-secondary">{name}</h3>
                  <p className="mb-3 text-sm font-medium text-primary">{member.role}</p>
                  <p className="text-sm text-base-content/60">{member.bio}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* A quién servimos */}
      <section className="border-y border-base-300 bg-base-100">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8">
          <div className="mb-10 text-center">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-primary">
              {t("whoWeServeLabel")}
            </span>
            <h2 className="text-3xl font-bold text-secondary">{t("whoWeServeTitle")}</h2>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {whoWeServe.map((item) => (
              <div
                key={item.label}
                className="flex items-start gap-4 rounded-xl border border-base-300 bg-base-200 p-5"
              >
                <span className="mt-0.5 grid h-10 w-10 flex-shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                  <i className={`fa-solid ${item.icon}`} />
                </span>
                <p className="text-sm font-medium leading-snug text-secondary">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-neutral text-neutral-content">
        <div className="mx-auto max-w-2xl px-6 py-20 text-center">
          <span className="mb-4 block text-xs font-semibold uppercase tracking-widest text-info">
            {t("ctaLabel")}
          </span>
          <h2 className="text-4xl font-extrabold">{t("ctaTitle")}</h2>
          <p className="mb-8 mt-4 text-lg text-neutral-content/60">{t("ctaDesc")}</p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/cursos" className="btn btn-accent btn-lg">
              {t("ctaBtn1")}
            </Link>
            <Link
              href="/contacto"
              className="btn btn-lg border-white/20 bg-white/5 text-white hover:bg-white/10"
            >
              {t("ctaBtn2")}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
