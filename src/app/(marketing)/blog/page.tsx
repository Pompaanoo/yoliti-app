import Link from "next/link";
import { POSTS, CATEGORY_BADGE, CATEGORY_LABEL } from "@/lib/blog";
import BlogGrid, { type BlogCardData } from "@/components/BlogGrid";

export const metadata = {
  title: "Blog — Centro Yolitia",
  description:
    "Perspectivas clínicas, investigación y práctica reflexiva para profesionales de salud mental.",
};

export default function BlogPage() {
  const featured = POSTS.find((p) => p.featured) ?? POSTS[0];
  const cards: BlogCardData[] = POSTS.map(
    ({ slug, title, category, image, excerpt, date, readMin }) => ({
      slug,
      title,
      category,
      image,
      excerpt,
      date,
      readMin,
    })
  );

  return (
    <div className="bg-base-200">
      {/* Encabezado */}
      <section className="border-b border-base-300 bg-base-100">
        <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8">
          <h1 className="text-4xl font-extrabold text-secondary">
            Recursos y artículos
          </h1>
          <p className="mt-2 max-w-2xl text-base-content/60">
            Perspectivas clínicas, investigación y práctica reflexiva para
            profesionales de salud mental.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8">
        {/* Artículo destacado */}
        <p className="mb-5 text-xs font-semibold uppercase tracking-wider text-primary">
          Artículo destacado
        </p>
        <Link
          href={`/blog/${featured.slug}`}
          className="group mb-16 grid grid-cols-1 overflow-hidden rounded-box border border-base-300 bg-base-100 shadow-md transition hover:shadow-xl lg:grid-cols-2"
        >
          <div className="h-64 overflow-hidden lg:h-auto">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={featured.image}
              alt={featured.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <div className="flex flex-col justify-center p-8 lg:p-10">
            <span
              className={`badge badge-sm w-fit border-0 font-medium ${CATEGORY_BADGE[featured.category]}`}
            >
              {CATEGORY_LABEL[featured.category]}
            </span>
            <h2 className="mt-4 text-2xl font-bold leading-tight text-secondary group-hover:text-primary">
              {featured.title}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-base-content/60">
              {featured.excerpt}
            </p>
            <p className="mt-6 text-xs text-base-content/40">
              {featured.date} · {featured.readMin} min de lectura
            </p>
          </div>
        </Link>

        {/* Artículos recientes con filtro */}
        <p className="mb-6 text-xs font-semibold uppercase tracking-wider text-primary">
          Artículos recientes
        </p>
        <BlogGrid posts={cards} />
      </div>

      {/* Newsletter */}
      <section className="bg-primary text-primary-content">
        <div className="mx-auto max-w-2xl px-6 py-16 text-center">
          <h2 className="text-3xl font-extrabold">Recibe artículos cada semana</h2>
          <p className="mt-3 text-primary-content/80">
            Insights clínicos, recursos y novedades de Centro Yolitia
            directamente en tu bandeja de entrada.
          </p>
          <div className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
            <input
              type="email"
              className="input w-full flex-1 text-base-content"
              placeholder="Tu correo electrónico"
            />
            <button className="btn btn-accent">Suscribirme</button>
          </div>
          <p className="mt-4 text-xs text-primary-content/60">
            Sin spam. Cancela cuando quieras.
          </p>
        </div>
      </section>
    </div>
  );
}
