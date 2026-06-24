import Link from "next/link";

export const metadata = { title: "Blog — Yoliti Academy" };

const POSTS = [
  ["5 formas de potenciar tu formación en línea", "Estrategias para sacar el máximo provecho del aprendizaje digital."],
  ["El papel de la autoconciencia", "Por qué conocerte es el primer paso del crecimiento profesional."],
  ["Señales de sobrecarga emocional", "Aprende a identificarlas antes de que te afecten."],
  ["Aprendizaje informado en el trauma", "Un enfoque compasivo para entornos educativos."],
  ["Entendiendo los detonantes emocionales", "Herramientas para reconocer y gestionar tus reacciones."],
];

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <h1 className="text-4xl font-extrabold text-secondary">Blog</h1>
      <p className="mt-3 text-base-content/60">
        Ideas sobre bienestar, aprendizaje y crecimiento profesional.
      </p>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {POSTS.map(([title, excerpt]) => (
          <article
            key={title}
            className="card border border-base-300 bg-base-100 transition hover:shadow-lg"
          >
            <div className="hero-gradient h-32 rounded-t-box" />
            <div className="card-body">
              <h2 className="card-title text-lg text-secondary">{title}</h2>
              <p className="text-sm text-base-content/60">{excerpt}</p>
              <Link href="/blog" className="mt-2 text-sm font-medium text-primary">
                Leer más <i className="fa-solid fa-arrow-right" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
