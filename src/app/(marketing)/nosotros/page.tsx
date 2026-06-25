import Link from "next/link";

export const metadata = {
  title: "Nosotros — Yolitia Academy",
  description:
    "Yolitia Academy fue creada para ir más allá de la educación tradicional, ofreciendo un enfoque más profundo y humano para el aprendizaje, el crecimiento y la transformación.",
};

const VALUES = [
  {
    icon: "fa-heart",
    color: "text-primary",
    bg: "bg-primary/10",
    title: "Aprendizaje centrado en la persona",
    desc: "Creemos que la educación debe honrar la experiencia humana completa, no solo los conceptos técnicos.",
  },
  {
    icon: "fa-lightbulb",
    color: "text-accent",
    bg: "bg-accent/10",
    title: "Educación práctica y reflexiva",
    desc: "El aprendizaje real ocurre cuando las ideas se exploran con profundidad, se cuestionan con honestidad y se aplican con intención.",
  },
  {
    icon: "fa-brain",
    color: "text-secondary",
    bg: "bg-info/30",
    title: "Integración de mente, emociones y conducta",
    desc: "La mente, el cuerpo, las emociones y las relaciones están interconectados. Nuestra educación refleja esa complejidad.",
  },
  {
    icon: "fa-check-circle",
    color: "text-neutral",
    bg: "bg-neutral/10",
    title: "Aplicación en el mundo real",
    desc: "Herramientas prácticas que apoyan el crecimiento personal y profesional con claridad y propósito.",
  },
];

const WHO_WE_SERVE = [
  {
    icon: "fa-graduation-cap",
    label: "Estudiantes de psicología que buscan una base más sólida",
  },
  {
    icon: "fa-user-doctor",
    label: "Terapeutas y consejeros que buscan herramientas prácticas",
  },
  {
    icon: "fa-brain",
    label: "Profesionales de salud mental que expanden su expertise",
  },
  {
    icon: "fa-heart-pulse",
    label: "Personas interesadas en el crecimiento personal y la comprensión emocional",
  },
];

export default function NosotrosPage() {
  return (
    <div>
      {/* Hero */}
      <section className="hero-gradient text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 sm:px-8 lg:grid-cols-2">
          <div>
            <span className="mb-3 block text-xs font-semibold uppercase tracking-widest text-info">
              Sobre Yolitia Academy
            </span>
            <h1 className="text-4xl font-extrabold leading-tight lg:text-5xl">
              Una forma diferente de entender la mente humana
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-white/80">
              Yolitia Academy fue creada para ir más allá de la educación
              tradicional, ofreciendo un enfoque más profundo y humano para el
              aprendizaje, el crecimiento y la transformación.
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
          <h2 className="mb-4 text-xl font-bold text-secondary">
            Nuestra misión
          </h2>
          <p className="leading-relaxed text-base-content/70">
            Brindar educación accesible y de alta calidad en psicología, salud
            mental y desarrollo humano a través de programas que combinan
            conocimiento, reflexión y aplicación práctica. Estamos comprometidos
            a apoyar a los estudiantes en su crecimiento académico, personal y
            profesional con un enfoque basado en la empatía, la ética y la
            transformación humana.
          </p>
        </div>
        <div className="rounded-box border border-accent/15 bg-accent/5 p-8">
          <span className="mb-5 grid h-12 w-12 place-items-center rounded-xl bg-accent/15 text-xl text-accent">
            <i className="fa-solid fa-eye" />
          </span>
          <h2 className="mb-4 text-xl font-bold text-secondary">
            Nuestra visión
          </h2>
          <p className="leading-relaxed text-base-content/70">
            Convertirnos en una referencia educativa confiable en psicología y
            salud mental para estudiantes en Estados Unidos y América Latina,
            ofreciendo programas innovadores, significativos y profundamente
            humanos que preparen a los profesionales para generar un impacto
            positivo en individuos, familias y comunidades.
          </p>
        </div>
      </section>

      {/* ¿Por qué existe Yolitia? */}
      <section className="bg-base-200">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 py-16 sm:px-8 lg:grid-cols-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://placehold.co/560x380/A8D8EA/162E22?text=Yolitia+Academy"
            alt=""
            className="w-full rounded-box shadow-lg"
          />
          <div>
            <span className="mb-3 block text-xs font-semibold uppercase tracking-widest text-primary">
              ¿Por qué existe Yolitia?
            </span>
            <h2 className="mb-5 text-3xl font-bold text-secondary">
              Creada desde la experiencia real, no solo de la abstracción
            </h2>
            <p className="mb-5 leading-relaxed text-base-content/70">
              En muchos entornos académicos, la educación se centra en teoría,
              terminología y marcos técnicos. Aunque esos elementos son
              importantes, a menudo dejan a los estudiantes con una brecha entre
              lo que saben y lo que realmente pueden comprender, aplicar y
              encarnar en situaciones reales.
            </p>
            <p className="leading-relaxed text-base-content/70">
              Cuando se trabaja con personas, emociones, trauma, conducta o
              desarrollo personal, la información sola no es suficiente. La
              verdadera comprensión requiere reflexión, sensibilidad, contexto y
              la capacidad de conectar el conocimiento con los procesos humanos
              reales. Esa es la brecha que Yolitia Academy fue creada para
              cerrar.
            </p>
          </div>
        </div>
      </section>

      {/* Filosofía / Valores */}
      <section className="mx-auto max-w-7xl px-6 py-16 sm:px-8">
        <div className="mb-12 text-center">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-primary">
            Nuestra filosofía
          </span>
          <h2 className="text-3xl font-bold text-secondary">
            El aprendizaje se vuelve poderoso cuando se comprende, se integra y
            se vive
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((v) => (
            <div key={v.title} className="p-6 text-center">
              <span
                className={`mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl ${v.bg} ${v.color} text-xl`}
              >
                <i className={`fa-solid ${v.icon}`} />
              </span>
              <h3 className="mb-2 font-bold text-secondary">{v.title}</h3>
              <p className="text-sm text-base-content/60">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Equipo */}
      <section className="bg-base-200">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8">
          <div className="mb-12 text-center">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-primary">
              Aprende de profesionales con visión humana real
            </span>
            <h2 className="text-3xl font-bold text-secondary">
              Nuestro equipo académico
            </h2>
          </div>
          <div className="mx-auto max-w-lg text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://placehold.co/200x200/0D5C6E/5ECFCA?text=GW"
              alt="Dr. Gerardo Wence-Munoz, PhD"
              className="mx-auto mb-4 h-32 w-32 rounded-full object-cover shadow-lg"
            />
            <h3 className="text-lg font-bold text-secondary">
              Dr. Gerardo Wence-Munoz, PhD
            </h3>
            <p className="mb-3 text-sm font-medium text-primary">
              Fundador, Psicoterapeuta y Líder Académico
            </p>
            <p className="text-sm text-base-content/60">
              El Dr. Gerardo Wence lidera Yolitia Academy con una visión
              centrada en la educación significativa, la comprensión emocional y
              el crecimiento profesional. Su trabajo está guiado por la
              convicción de que el aprendizaje en counseling y salud mental debe
              ser riguroso y profundamente humano.
            </p>
          </div>
        </div>
      </section>

      {/* A quién servimos */}
      <section className="border-y border-base-300 bg-base-100">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8">
          <div className="mb-10 text-center">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-primary">
              A quién servimos
            </span>
            <h2 className="text-3xl font-bold text-secondary">
              Un espacio para quienes quieren ir más profundo
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {WHO_WE_SERVE.map((item) => (
              <div
                key={item.label}
                className="flex items-start gap-4 rounded-xl border border-base-300 bg-base-200 p-5"
              >
                <span className="mt-0.5 grid h-10 w-10 flex-shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                  <i className={`fa-solid ${item.icon}`} />
                </span>
                <p className="text-sm font-medium leading-snug text-secondary">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-neutral text-neutral-content">
        <div className="mx-auto max-w-2xl px-6 py-20 text-center">
          <span className="mb-4 block text-xs font-semibold uppercase tracking-widest text-info">
            Comienza tu camino
          </span>
          <h2 className="text-4xl font-extrabold">
            Empieza tu viaje de aprendizaje con Yolitia Academy
          </h2>
          <p className="mb-8 mt-4 text-lg text-neutral-content/60">
            Ya sea que estés comenzando tu camino o expandiendo tu práctica
            profesional, Yolitia Academy ofrece un espacio donde la educación
            se convierte en algo más que conocimiento: dirección, claridad y
            transformación.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/cursos" className="btn btn-accent btn-lg">
              Explorar cursos
            </Link>
            <Link
              href="/contacto"
              className="btn btn-lg border-white/20 bg-white/5 text-white hover:bg-white/10"
            >
              Contáctanos
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
