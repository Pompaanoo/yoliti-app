import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import CourseCard from "@/components/CourseCard";
import { POSTS, CATEGORY_BADGE, CATEGORY_LABEL } from "@/lib/blog";
import type { Course } from "@/lib/types";

const STAT_NUMBERS = ["1,200+", "10+", "15", "12"];

export default async function HomePage() {
  const t = await getTranslations("home");
  const c = await getTranslations("common");
  const supabase = await createClient();
  const { data } = await supabase
    .from("courses")
    .select("*")
    .eq("status", "publicado")
    .order("created_at", { ascending: false })
    .limit(3);
  const courses = (data as Course[]) ?? [];
  const recentPosts = POSTS.slice(0, 3);

  const statLabels = t.raw("statsLabels") as string[];
  const heroTags = t.raw("heroTags") as string[];
  const target1Items = t.raw("target1Items") as string[];
  const target2Items = t.raw("target2Items") as string[];
  const designedItems = t.raw("designedItems") as string[];
  const mentors = t.raw("mentors") as { name: string; role: string; bio: string }[];
  const testimonials = t.raw("testimonials") as {
    quote: string;
    name: string;
    role: string;
  }[];

  const initials = (name: string) =>
    name
      .split(" ")
      .map((w) => w.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase();

  return (
    <>
      {/* Hero */}
      <section className="hero-gradient relative overflow-hidden text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 py-20 sm:px-8 lg:grid-cols-2">
          <div>
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-info/30 bg-white/10 px-3 py-1.5 text-xs font-semibold text-info">
              <i className="fa-solid fa-circle-dot animate-pulse text-accent" />
              {t("heroBadge")}
            </span>
            <h1 className="text-4xl font-extrabold leading-tight lg:text-5xl">
              {t("heroTitlePre")}{" "}
              <span className="text-info">{t("heroTitleMid")}</span>{" "}
              {t("heroTitlePost")}
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/80">
              {t("heroDesc")}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/cursos" className="btn btn-accent btn-lg">
                {t("heroBtn1")} <i className="fa-solid fa-arrow-right" />
              </Link>
              <Link
                href="/nosotros"
                className="btn btn-lg border-white/30 bg-white/10 text-white hover:bg-white/20"
              >
                {t("heroBtn2")}
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-5 text-sm text-white/60">
              {heroTags.map((tag) => (
                <span key={tag} className="flex items-center gap-1.5">
                  <i className="fa-solid fa-check text-info" /> {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="relative hidden lg:block">
            <div className="absolute -left-6 -top-6 h-32 w-32 rounded-full bg-info/15" />
            <div className="absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-accent/15" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://placehold.co/560x420/162E22/5ECFCA?text=Sesión+Clínica"
              alt="Centro Yolitia"
              className="relative z-10 w-full rounded-box shadow-2xl"
            />
            <div className="absolute -bottom-4 -left-4 z-20 flex items-center gap-3 rounded-xl bg-base-100 p-4 shadow-xl">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-accent/15 text-accent">
                <i className="fa-solid fa-award" />
              </span>
              <div>
                <p className="text-xs text-base-content/40">
                  {t("heroAccredLabel")}
                </p>
                <p className="text-sm font-bold text-secondary">
                  {t("heroAccredValue")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-base-300 bg-base-100">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-12 text-center sm:px-8 lg:grid-cols-4">
          {STAT_NUMBERS.map((num, i) => (
            <div key={i}>
              <p className="mb-1 text-4xl font-bold text-primary">{num}</p>
              <p className="text-sm text-base-content/50">{statLabels[i]}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Designed for Real Human Understanding */}
      <section className="bg-base-100">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 sm:px-8 lg:grid-cols-2">
          {/* Photo */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://yolitiacademy.com/wp-content/uploads/2024/04/pic-5.jpg"
            alt="Yolitia Academy student"
            className="w-full rounded-box object-cover shadow-lg"
          />

          {/* Text content */}
          <div>
            <span className="mb-4 block text-xs font-semibold uppercase tracking-widest text-primary">
              {t("designedLabel")}
            </span>
            <h2 className="text-4xl font-extrabold leading-tight text-secondary lg:text-5xl">
              {t("designedTitle")}{" "}
              <span className="text-primary">{t("designedTitleHighlight")}</span>
            </h2>
            <div className="mt-6 space-y-4 leading-relaxed text-base-content/70">
              <p>{t("designedP1")}</p>
              <p>{t("designedP2")}</p>
              <p>{t("designedP3")}</p>
            </div>
            <ul className="mt-7 space-y-2.5 text-sm font-medium text-base-content/80">
              {designedItems.map((item) => (
                <li key={item} className="flex items-center gap-2.5">
                  <span className="grid h-5 w-5 flex-shrink-0 place-items-center rounded-full bg-primary/15 text-[10px] text-primary">
                    <i className="fa-solid fa-check" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Cursos destacados */}
      <section className="bg-base-200">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-primary">
                {t("featuredLabel")}
              </span>
              <h2 className="text-3xl font-bold text-secondary">
                {t("featuredTitle")}
              </h2>
            </div>
            <Link href="/cursos" className="btn btn-outline btn-primary btn-sm hidden lg:flex">
              {c("viewAll")} <i className="fa-solid fa-arrow-right" />
            </Link>
          </div>
          {courses.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-3">
              {courses.map((c) => (
                <CourseCard key={c.id} course={c} />
              ))}
            </div>
          ) : (
            <p className="rounded-box border border-dashed border-base-300 p-12 text-center text-base-content/50">
              {t("featuredEmpty")}
            </p>
          )}
        </div>
      </section>

      {/* ¿Para quién es? */}
      <section className="mx-auto max-w-7xl px-6 py-16 sm:px-8">
        <div className="mb-14 text-center">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-primary">
            {t("forwhomLabel")}
          </span>
          <h2 className="text-3xl font-bold text-secondary">
            {t("forwhomTitle")}
          </h2>
        </div>

        <div className="mb-16 grid items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="mb-5 grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-xl text-primary">
              <i className="fa-solid fa-user-doctor" />
            </span>
            <h3 className="mb-4 text-2xl font-bold text-secondary">
              {t("target1Title")}
            </h3>
            <p className="mb-5 leading-relaxed text-base-content/70">
              {t("target1Desc")}
            </p>
            <ul className="space-y-2 text-sm text-base-content/70">
              {target1Items.map((li) => (
                <li key={li} className="flex items-center gap-2">
                  <i className="fa-solid fa-check text-primary" /> {li}
                </li>
              ))}
            </ul>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://placehold.co/560x380/F5E6DA/0D5C6E?text=Terapeuta+Bilingüe"
            alt=""
            className="w-full rounded-box shadow-lg"
          />
        </div>

        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://placehold.co/560x380/A8D8EA/162E22?text=Supervisor+Clínico"
            alt=""
            className="order-2 w-full rounded-box shadow-lg lg:order-1"
          />
          <div className="order-1 lg:order-2">
            <span className="mb-5 grid h-12 w-12 place-items-center rounded-xl bg-accent/10 text-xl text-accent">
              <i className="fa-solid fa-chalkboard-user" />
            </span>
            <h3 className="mb-4 text-2xl font-bold text-secondary">
              {t("target2Title")}
            </h3>
            <p className="mb-5 leading-relaxed text-base-content/70">
              {t("target2Desc")}
            </p>
            <ul className="space-y-2 text-sm text-base-content/70">
              {target2Items.map((li) => (
                <li key={li} className="flex items-center gap-2">
                  <i className="fa-solid fa-check text-accent" /> {li}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Testimonios */}
      <section className="hero-gradient text-white">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8">
          <div className="mb-10 text-center">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-info">
              {t("testimonialsLabel")}
            </span>
            <h2 className="text-3xl font-bold">{t("testimonialsTitle")}</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((item) => (
              <div
                key={item.name}
                className="rounded-box border border-white/10 bg-white/10 p-6"
              >
                <div className="mb-4 flex gap-1 text-sm text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <i key={i} className="fa-solid fa-star" />
                  ))}
                </div>
                <p className="mb-5 text-sm italic leading-relaxed text-white/80">
                  {item.quote}
                </p>
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-white/15 text-sm font-bold text-info">
                    {initials(item.name)}
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{item.name}</p>
                    <p className="text-xs text-white/40">{item.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mentores */}
      <section className="bg-base-100">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8">
          <div className="mb-12 text-center">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-primary">
              {t("mentorsLabel")}
            </span>
            <h2 className="mx-auto max-w-2xl text-3xl font-extrabold leading-tight text-secondary sm:text-4xl">
              {t("mentorsTitle")}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-base-content/60">
              {t("mentorsDesc")}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {mentors.map((mentor, i) => (
              <div key={mentor.name} className="flex flex-col">
                <div className="overflow-hidden rounded-2xl bg-base-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={
                      i === 0
                        ? "https://placehold.co/300x320/0D5C6E/5ECFCA?text=GW"
                        : "https://yolitiacademy.com/wp-content/uploads/2025/10/Diseno-sin-titulo-7-e1760799166305.png"
                    }
                    alt={mentor.name}
                    className="h-52 w-full object-cover"
                  />
                </div>
                <div className="mt-4">
                  <h3 className="font-bold text-secondary">{mentor.name}</h3>
                  <p className="mb-2 text-xs font-medium text-primary">{mentor.role}</p>
                  <p className="text-sm leading-relaxed text-base-content/60">{mentor.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog preview */}
      <section className="mx-auto max-w-7xl px-6 py-16 sm:px-8">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-primary">
              {t("blogLabel")}
            </span>
            <h2 className="text-3xl font-bold text-secondary">{t("blogTitle")}</h2>
          </div>
          <Link href="/blog" className="btn btn-outline btn-primary btn-sm hidden lg:flex">
            {t("blogViewAll")} <i className="fa-solid fa-arrow-right" />
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {recentPosts.map((p) => (
            <Link key={p.slug} href={`/blog/${p.slug}`} className="group">
              <div className="mb-4 h-48 overflow-hidden rounded-box">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.image}
                  alt={p.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <span
                className={`badge badge-sm mb-2 border-0 font-medium ${CATEGORY_BADGE[p.category]}`}
              >
                {CATEGORY_LABEL[p.category]}
              </span>
              <h3 className="text-base font-bold leading-snug text-secondary group-hover:text-primary">
                {p.title}
              </h3>
              <p className="mt-2 text-xs text-base-content/50">
                {p.date} · {p.readMin} min
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA final */}
      <section className="bg-neutral text-neutral-content">
        <div className="mx-auto max-w-2xl px-6 py-20 text-center">
          <span className="mb-4 block text-xs font-semibold uppercase tracking-widest text-info">
            {t("ctaLabel")}
          </span>
          <h2 className="text-4xl font-extrabold leading-tight">{t("ctaTitle")}</h2>
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
    </>
  );
}
