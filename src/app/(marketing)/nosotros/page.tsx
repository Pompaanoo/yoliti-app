export const metadata = { title: "Nosotros — Yoliti Academy" };

export default function NosotrosPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-4xl font-extrabold text-secondary">
        Sobre Yoliti Academy
      </h1>
      <p className="mt-4 text-lg text-base-content/70">
        Creemos en un aprendizaje que transforma. Yoliti — “corazón” en náhuatl —
        nace para acompañar a profesionales de habla hispana en su crecimiento
        personal y profesional, con cursos de bienestar, inteligencia emocional
        y comunicación clínica.
      </p>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {[
          ["fa-bullseye", "Misión", "Democratizar el acceso a educación emocional y clínica de calidad."],
          ["fa-eye", "Visión", "Ser la comunidad de aprendizaje en bienestar líder en Latinoamérica."],
          ["fa-handshake-angle", "Valores", "Empatía, rigor, accesibilidad y propósito."],
        ].map(([icon, title, desc]) => (
          <div
            key={title}
            className="rounded-box border border-base-300 bg-base-100 p-6"
          >
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary">
              <i className={`fa-solid ${icon} text-xl`} />
            </span>
            <h2 className="mt-4 font-bold text-secondary">{title}</h2>
            <p className="mt-2 text-sm text-base-content/60">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
