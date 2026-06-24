import Link from "next/link";

export const metadata = {
  title: "Nosotros — Centro Yolitia",
  description:
    "Formación especializada en salud mental para profesionales bilingües y multiculturales.",
};

const VALUES = [
  ["fa-heart", "text-primary", "bg-primary/10", "Dignidad cultural", "Reconocemos y honramos la riqueza de las culturas latinas como parte integral del proceso terapéutico."],
  ["fa-microscope", "text-accent", "bg-accent/10", "Rigor científico", "Cada curso está basado en evidencia y diseñado por expertos con experiencia clínica real."],
  ["fa-hands-holding-circle", "text-secondary", "bg-info/30", "Accesibilidad", "Formación de alta calidad disponible desde cualquier lugar, a ritmo propio, con precios justos."],
  ["fa-arrows-rotate", "text-neutral", "bg-neutral/10", "Transformación continua", "Creemos que el aprendizaje profesional es un proceso vivo, no un evento puntual."],
];

const TEAM = [
  ["https://placehold.co/200x200/0D5C6E/5ECFCA?text=YO", "Yoliti Osorio, PhD", "Fundadora y Directora Académica", "Psicóloga clínica con 25 años de experiencia. Especialista en psicoterapia intercultural y formación de terapeutas bilingües."],
  ["https://placehold.co/200x200/E8703A/FFFFFF?text=CM", "Carlos Martínez, LCSW", "Director de Supervisión Clínica", "Trabajador social clínico con especialización en supervisión y formación de profesionales en contextos multiculturales."],
  ["https://placehold.co/200x200/162E22/5ECFCA?text=AR", "Ana Reyes, PhD", "Coordinadora de Contenido y CEUs", "Doctora en educación con experiencia en diseño instruccional para profesionales de salud. Gestiona las acreditaciones CEU."],
];

export default function NosotrosPage() {
  return (
    <div>
      {/* Hero */}
      <section className="hero-gradient text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 sm:px-8 lg:grid-cols-2">
          <div>
            <span className="mb-3 block text-xs font-semibold uppercase tracking-widest text-info">
              Nuestra historia
            </span>
            <h1 className="text-4xl font-extrabold leading-tight lg:text-5xl">
              Formando a los terapeutas que el mundo necesita
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-white/80">
              Centro Yolitia nació de una convicción: que los profesionales de
              salud mental que trabajan con comunidades latinas merecen formación
              especializada, culturalmente relevante y clínicamente rigurosa.
            </p>
          </div>
          <div className="hidden lg:block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://placehold.co/560x400/162E22/5ECFCA?text=Centro+Yolitia"
              alt="Centro Yolitia"
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
          <h2 className="mb-4 text-xl font-bold text-secondary">Nuestra misión</h2>
          <p className="leading-relaxed text-base-content/70">
            Ofrecer formación especializada, accesible y de alta calidad a
            profesionales de salud mental que atienden o desean atender a
            poblaciones latinas, fortaleciendo tanto sus competencias clínicas
            como su conciencia cultural.
          </p>
        </div>
        <div className="rounded-box border border-accent/15 bg-accent/5 p-8">
          <span className="mb-5 grid h-12 w-12 place-items-center rounded-xl bg-accent/15 text-xl text-accent">
            <i className="fa-solid fa-eye" />
          </span>
          <h2 className="mb-4 text-xl font-bold text-secondary">Nuestra visión</h2>
          <p className="leading-relaxed text-base-content/70">
            Un mundo donde cada persona latina que busca apoyo en salud mental
            puede encontrar un profesional bilingüe, culturalmente competente,
            preparado para acompañarla con profundidad y respeto.
          </p>
        </div>
      </section>

      {/* Historia */}
      <section className="bg-base-200">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 py-16 sm:px-8 lg:grid-cols-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://placehold.co/560x380/A8D8EA/162E22?text=Historia+2009"
            alt="Nuestra historia"
            className="w-full rounded-box shadow-lg"
          />
          <div>
            <span className="mb-3 block text-xs font-semibold uppercase tracking-widest text-primary">
              ¿Cómo empezamos?
            </span>
            <h2 className="mb-5 text-3xl font-bold text-secondary">
              Más de 15 años cerrando brechas
            </h2>
            <p className="mb-5 leading-relaxed text-base-content/70">
              Centro Yolitia comenzó en 2009 como una serie de talleres
              presenciales en Miami. La Dra. Yoliti Osorio, psicóloga clínica con
              experiencia en comunidades migrantes, identificó una necesidad
              urgente: los terapeutas bien intencionados a menudo carecían del
              vocabulario y la sensibilidad cultural para servir efectivamente a
              sus pacientes latinos.
            </p>
            <p className="mb-6 leading-relaxed text-base-content/70">
              Lo que empezó como talleres de fin de semana evolucionó hacia una
              plataforma de formación en línea completa, con cursos acreditados
              por organismos profesionales y estudiantes en más de 12 países.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-base-100 p-4 text-center shadow-sm">
                <p className="text-3xl font-bold text-primary">2009</p>
                <p className="mt-1 text-xs text-base-content/40">
                  Año de fundación
                </p>
              </div>
              <div className="rounded-xl bg-base-100 p-4 text-center shadow-sm">
                <p className="text-3xl font-bold text-primary">1,200+</p>
                <p className="mt-1 text-xs text-base-content/40">Egresados</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="mx-auto max-w-7xl px-6 py-16 sm:px-8">
        <div className="mb-12 text-center">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-primary">
            Lo que nos guía
          </span>
          <h2 className="text-3xl font-bold text-secondary">
            Nuestros valores fundamentales
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map(([icon, color, bg, title, desc]) => (
            <div key={title} className="p-6 text-center">
              <span
                className={`mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl ${bg} ${color} text-xl`}
              >
                <i className={`fa-solid ${icon}`} />
              </span>
              <h3 className="mb-2 font-bold text-secondary">{title}</h3>
              <p className="text-sm text-base-content/60">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Equipo */}
      <section className="bg-base-200">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8">
          <div className="mb-12 text-center">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-primary">
              Quienes lo hacen posible
            </span>
            <h2 className="text-3xl font-bold text-secondary">Nuestro equipo</h2>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {TEAM.map(([img, name, role, bio]) => (
              <div key={name} className="text-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img}
                  alt={name}
                  className="mx-auto mb-4 h-32 w-32 rounded-full object-cover shadow-lg"
                />
                <h3 className="text-lg font-bold text-secondary">{name}</h3>
                <p className="mb-2 text-sm font-medium text-primary">{role}</p>
                <p className="text-sm text-base-content/60">{bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Acreditaciones */}
      <section className="border-y border-base-300 bg-base-100">
        <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8">
          <p className="mb-8 text-center text-xs font-semibold uppercase tracking-wider text-base-content/30">
            Acreditaciones y reconocimientos
          </p>
          <div className="flex flex-wrap items-center justify-center gap-10">
            {["NASW", "APA", "NBCC", "CAMFT"].map((org) => (
              <div key={org} className="text-center">
                <div className="mx-auto mb-2 grid h-20 w-20 place-items-center rounded-xl border border-base-300 bg-base-200">
                  <span className="text-xs font-bold text-base-content/40">
                    {org}
                  </span>
                </div>
                <p className="text-xs text-base-content/30">CEUs aprobados</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-neutral text-neutral-content">
        <div className="mx-auto max-w-2xl px-6 py-20 text-center">
          <span className="mb-4 block text-xs font-semibold uppercase tracking-widest text-info">
            ¿Lista para empezar?
          </span>
          <h2 className="text-4xl font-extrabold">Únete a nuestra comunidad</h2>
          <p className="mb-8 mt-4 text-lg text-neutral-content/60">
            Forma parte de una red de más de 1,200 profesionales comprometidos
            con la excelencia clínica y la justicia cultural en salud mental.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/cursos" className="btn btn-accent btn-lg">
              Explorar cursos
            </Link>
            <Link
              href="/contacto"
              className="btn btn-lg border-white/20 bg-white/5 text-white hover:bg-white/10"
            >
              Contactarnos
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
