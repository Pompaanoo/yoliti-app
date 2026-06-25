import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { POSTS, getPost, localizePost, AUTHOR, CATEGORY_BADGE, CATEGORY_KEY } from "@/lib/blog";

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  return {
    title: post ? `${post.title} — Centro Yolitia` : "Artículo — Centro Yolitia",
    description: post?.excerpt,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const rawPost = getPost(slug);
  if (!rawPost) notFound();

  const [t, locale] = await Promise.all([getTranslations("blog"), getLocale()]);
  const post = localizePost(rawPost, locale);
  const related = POSTS.map((p) => localizePost(p, locale)).filter((p) => p.slug !== post.slug).slice(0, 3);
  const authorRole = locale === "es" ? AUTHOR.role : AUTHOR.roleEn;
  const authorBio = locale === "es" ? AUTHOR.bio : AUTHOR.bioEn;

  return (
    <div className="bg-base-200">
      {/* Encabezado */}
      <section className="bg-base-100">
        <div className="mx-auto max-w-4xl px-6 py-12 sm:px-8">
          <div className="mb-4 text-xs text-base-content/40">
            <Link href="/" className="hover:text-primary">
              {t("breadcrumbHome")}
            </Link>
            <span className="mx-1.5">/</span>
            <Link href="/blog" className="hover:text-primary">
              Blog
            </Link>
          </div>
          <span
            className={`badge badge-sm w-fit border-0 font-medium ${CATEGORY_BADGE[post.category]}`}
          >
            {t(CATEGORY_KEY[post.category])}
          </span>
          <h1 className="mt-4 text-3xl font-extrabold leading-tight text-secondary sm:text-4xl">
            {post.title}
          </h1>
          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-base-content/50">
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-primary/15 text-xs font-bold text-primary">
                {AUTHOR.initials}
              </span>
              <div>
                <p className="text-sm font-semibold text-secondary">
                  {AUTHOR.name}
                </p>
                <p className="text-xs text-base-content/40">{authorRole}</p>
              </div>
            </div>
            <span className="text-base-content/20">|</span>
            <span className="flex items-center gap-1">
              <i className="fa-solid fa-calendar text-xs" /> {post.date}
            </span>
            <span className="flex items-center gap-1">
              <i className="fa-solid fa-clock text-xs" /> {post.readMin} {t("minRead")}
            </span>
          </div>
        </div>
      </section>

      {/* Imagen hero */}
      <div className="relative z-10 mx-auto -mb-8 max-w-4xl px-6 sm:px-8">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={post.image}
          alt={post.title}
          className="w-full rounded-box shadow-xl"
        />
      </div>

      {/* Contenido + sidebar */}
      <section className="mx-auto max-w-4xl px-6 pb-16 pt-16 sm:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_300px]">
          {/* Cuerpo */}
          <article className="article-body rounded-box bg-base-100 p-8 shadow-sm lg:p-12">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />

            {/* Caja de autor */}
            <div className="mt-10 flex items-start gap-4 border-t border-base-300 pt-8">
              <span className="grid h-14 w-14 flex-shrink-0 place-items-center rounded-full bg-primary/15 font-bold text-primary">
                {AUTHOR.initials}
              </span>
              <div>
                <p className="font-bold text-secondary">{AUTHOR.name}</p>
                <p className="mb-2 text-xs text-base-content/40">
                  {authorRole}
                </p>
                <p className="text-sm text-base-content/60">{authorBio}</p>
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="rounded-box bg-secondary p-6 text-secondary-content">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary-content/80">
                {t("relatedCourse")}
              </span>
              <h3 className="mt-2 text-base font-bold">
                {t("relatedCourseTitle")}
              </h3>
              <p className="mb-5 mt-2 text-xs text-secondary-content/70">
                {t("relatedCourseDesc")}
              </p>
              <Link
                href="/cursos/espanol-clinico"
                className="btn btn-accent btn-sm btn-block"
              >
                Ver el curso
              </Link>
            </div>

            <div className="rounded-box border border-base-300 bg-base-100 p-6 shadow-sm">
              <h3 className="mb-4 text-sm font-bold text-secondary">
                {t("relatedArticles")}
              </h3>
              <div className="space-y-4">
                {related.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/blog/${r.slug}`}
                    className="group flex items-start gap-3"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={r.image}
                      alt={r.title}
                      className="h-14 w-14 flex-shrink-0 rounded-xl object-cover"
                    />
                    <div>
                      <p className="text-xs font-semibold leading-snug text-secondary group-hover:text-primary">
                        {r.title}
                      </p>
                      <p className="mt-1 text-xs text-base-content/40">
                        {r.readMin} {t("minRead")}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>

        <div className="mt-10 text-center">
          <Link href="/blog" className="btn btn-ghost btn-sm">
            <i className="fa-solid fa-arrow-left" /> {t("backToBlog")}
          </Link>
        </div>
      </section>
    </div>
  );
}
