import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import CourseCard from "@/components/CourseCard";
import { POSTS, CATEGORY_BADGE, CATEGORY_LABEL } from "@/lib/blog";
import type { Course } from "@/lib/types";

const STATS = [
  ["1,200+", "Profesionales capacitados"],
  ["10+", "Cursos especializados"],
  ["15", "Años de experiencia"],
  ["12", "Países alcanzados"],
];

const TESTIMONIALS = [
  ['"Este curso transformó mi práctica. Ahora puedo conectar con mis pacientes latinos de una manera profundamente distinta. Completamente recomendado."', "María L.", "LCSW · Texas, USA", "ML"],
  ['"El enfoque es diferente a todo lo que había visto. No es solo aprender palabras — es entender la cultura. Mis pacientes lo notan inmediatamente."', "James R.", "MFT · California, USA", "JR"],
  ['"Completé 3 módulos y ya uso el vocabulario en sesiones reales. Los materiales son excelentes recursos que sigo consultando semanas después."', "Ana P.", "Psicóloga · Colombia", "AP"],
];

export default async function HomePage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("courses")
    .select("*")
    .eq("status", "publicado")
    .order("created_at", { ascending: false })
    .limit(3);
  const courses = (data as Course[]) ?? [];
  const recentPosts = POSTS.slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="hero-gradient relative overflow-hidden text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 py-20 sm:px-8 lg:grid-cols-2">
          <div>
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-info/30 bg-white/10 px-3 py-1.5 text-xs font-semibold text-info">
              <i className="fa-solid fa-circle-dot animate-pulse text-accent" />
              Más de 1,200 profesionales capacitados
            </span>
            <h1 className="text-4xl font-extrabold leading-tight lg:text-5xl">
              Formación clínica para profesionales de{" "}
              <span className="text-info">salud mental</span> bilingües
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/80">
              Cursos especializados en español clínico, supervisión y diálogo
              terapéutico. Diseñados para terapeutas que trabajan con comunidades
              latinas.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/cursos" className="btn btn-accent btn-lg">
                Explorar cursos <i className="fa-solid fa-arrow-right" />
              </Link>
              <Link
                href="/nosotros"
                className="btn btn-lg border-white/30 bg-white/10 text-white hover:bg-white/20"
              >
                Conoce la academia
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-5 text-sm text-white/60">
              {["CEUs acreditados", "Garantía 30 días", "Acceso de por vida"].map(
                (t) => (
                  <span key={t} className="flex items-center gap-1.5">
                    <i className="fa-solid fa-check text-info" /> {t}
                  </span>
                )
              )}
            </div>
          </div>
          <div className="relative hidden lg:block">
            <div className="absolute -left-6 -top-6 h-32 w-32 rounded-full bg-info/15" />
            <div className="absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-accent/15" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://placehold.co/560x420/162E22/5ECFCA?text=Sesión+Clínica"
              alt="Sesión clínica"
              className="relative z-10 w-full rounded-box shadow-2xl"
            />
            <div className="absolute -bottom-4 -left-4 z-20 flex items-center gap-3 rounded-xl bg-base-100 p-4 shadow-xl">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-accent/15 text-accent">
                <i className="fa-solid fa-award" />
              </span>
              <div>
                <p className="text-xs text-base-content/40">Acreditado</p>
                <p className="text-sm font-bold text-secondary">
                  NASW · CEUs Aprobados
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-base-300 bg-base-100">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-12 text-center sm:px-8 lg:grid-cols-4">
          {STATS.map(([num, label]) => (
            <div key={label}>
              <p className="mb-1 text-4xl font-bold text-primary">{num}</p>
              <p className="text-sm text-base-content/50">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Cursos destacados */}
      <section className="bg-base-200">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-primary">
                Formación especializada
              </span>
              <h2 className="text-3xl font-bold text-secondary">
                Nuestros cursos destacados
              </h2>
            </div>
            <Link href="/cursos" className="btn btn-outline btn-primary btn-sm hidden lg:flex">
              Ver todos <i className="fa-solid fa-arrow-right" />
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
              Aún no hay cursos publicados.
            </p>
          )}
        </div>
      </section>

      {/* ¿Para quién es? */}
      <section className="mx-auto max-w-7xl px-6 py-16 sm:px-8">
        <div className="mb-14 text-center">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-primary">
            Enfoque
          </span>
          <h2 className="text-3xl font-bold text-secondary">
            ¿Para quién es Centro Yolitia?
          </h2>
        </div>

        <div className="mb-16 grid items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="mb-5 grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-xl text-primary">
              <i className="fa-solid fa-user-doctor" />
            </span>
            <h3 className="mb-4 text-2xl font-bold text-secondary">
              Psicólogos y terapeutas bilingües
            </h3>
            <p className="mb-5 leading-relaxed text-base-content/70">
              Si atiendes o quieres atender pacientes hispanohablantes, nuestros
              cursos te dan el vocabulario clínico y la competencia cultural que
              necesitas para conectar profundamente.
            </p>
            <ul className="space-y-2 text-sm text-base-content/70">
              {["Vocabulario clínico aplicado al consultorio", "Técnicas de alianza terapéutica intercultural", "Documentación clínica en español"].map(
                (li) => (
                  <li key={li} className="flex items-center gap-2">
                    <i className="fa-solid fa-check text-primary" /> {li}
                  </li>
                )
              )}
            </ul>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://placehold.co/560x380/F5E6DA/0D5C6E?text=Terapeuta+Bilingüe"
            alt="Terapeuta bilingüe"
            className="w-full rounded-box shadow-lg"
          />
        </div>

        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://placehold.co/560x380/A8D8EA/162E22?text=Supervisor+Clínico"
            alt="Supervisor clínico"
            className="order-2 w-full rounded-box shadow-lg lg:order-1"
          />
          <div className="order-1 lg:order-2">
            <span className="mb-5 grid h-12 w-12 place-items-center rounded-xl bg-accent/10 text-xl text-accent">
              <i className="fa-solid fa-chalkboard-user" />
            </span>
            <h3 className="mb-4 text-2xl font-bold text-secondary">
              Supervisores clínicos
            </h3>
            <p className="mb-5 leading-relaxed text-base-content/70">
              Forma a la próxima generación de terapeutas con supervisión clínica
              estructurada, ética profesional y modelos basados en evidencia.
            </p>
            <ul className="space-y-2 text-sm text-base-content/70">
              {["Modelos y teorías de supervisión", "Ética y responsabilidades legales", "CEUs aprobados por NASW y otros"].map(
                (li) => (
                  <li key={li} className="flex items-center gap-2">
                    <i className="fa-solid fa-check text-accent" /> {li}
                  </li>
                )
              )}
            </ul>
          </div>
        </div>
      </section>

      {/* Testimonios */}
      <section className="hero-gradient text-white">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8">
          <div className="mb-10 text-center">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-info">
              Testimonios
            </span>
            <h2 className="text-3xl font-bold">Lo que dicen nuestros estudiantes</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map(([quote, name, role, initials]) => (
              <div
                key={name}
                className="rounded-box border border-white/10 bg-white/10 p-6"
              >
                <div className="mb-4 flex gap-1 text-sm text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <i key={i} className="fa-solid fa-star" />
                  ))}
                </div>
                <p className="mb-5 text-sm italic leading-relaxed text-white/80">
                  {quote}
                </p>
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-white/15 text-sm font-bold text-info">
                    {initials}
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{name}</p>
                    <p className="text-xs text-white/40">{role}</p>
                  </div>
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
              Recursos
            </span>
            <h2 className="text-3xl font-bold text-secondary">Artículos recientes</h2>
          </div>
          <Link href="/blog" className="btn btn-outline btn-primary btn-sm hidden lg:flex">
            Ver blog <i className="fa-solid fa-arrow-right" />
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
                {p.date} · {p.readMin} min de lectura
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA final */}
      <section className="bg-neutral text-neutral-content">
        <div className="mx-auto max-w-2xl px-6 py-20 text-center">
          <span className="mb-4 block text-xs font-semibold uppercase tracking-widest text-info">
            ¿Listo para empezar?
          </span>
          <h2 className="text-4xl font-extrabold leading-tight">
            Transforma tu práctica clínica hoy
          </h2>
          <p className="mb-8 mt-4 text-lg text-neutral-content/60">
            Únete a más de 1,200 profesionales que ya elevaron su competencia
            cultural y clínica.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/cursos" className="btn btn-accent btn-lg">
              Explorar todos los cursos
            </Link>
            <Link
              href="/contacto"
              className="btn btn-lg border-white/20 bg-white/5 text-white hover:bg-white/10"
            >
              Hablar con un asesor
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
