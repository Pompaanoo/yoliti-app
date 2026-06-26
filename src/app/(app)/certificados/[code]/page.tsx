import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import PrintButton from "./_components/PrintButton";

export const metadata = { title: "Certificado — Yoliti Academy" };

export default async function CertificadoPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const supabase = await createClient();

  const { data: certRaw } = await supabase
    .from("certificates")
    .select("user_id, course_id, issued_at")
    .eq("code", code)
    .single();

  if (!certRaw) notFound();

  const [{ data: profile }, { data: course }] = await Promise.all([
    supabase
      .from("profiles")
      .select("full_name")
      .eq("id", certRaw.user_id)
      .single(),
    supabase
      .from("courses")
      .select("title, teacher_id")
      .eq("id", certRaw.course_id)
      .single(),
  ]);

  const { data: teacher } = course?.teacher_id
    ? await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", course.teacher_id)
        .single()
    : { data: null };

  const studentName = profile?.full_name ?? "Estudiante";
  const courseTitle = course?.title ?? "Curso";
  const teacherName = teacher?.full_name ?? "Instructor";
  const issuedDate = new Date(certRaw.issued_at).toLocaleDateString("es-MX", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Acciones */}
      <div className="flex items-center justify-between print:hidden">
        <Link href="/dashboard" className="btn btn-ghost btn-sm">
          <i className="fa-solid fa-arrow-left" /> Volver
        </Link>
        <PrintButton />
      </div>

      {/* Certificado */}
      <div className="relative overflow-hidden rounded-2xl border-4 border-secondary bg-base-100 px-12 py-14 text-center shadow-xl print:shadow-none print:border-2">
        {/* Decoración esquinas */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-3 top-3 h-12 w-12 rounded-tl-xl border-l-4 border-t-4 border-secondary/30" />
          <div className="absolute right-3 top-3 h-12 w-12 rounded-tr-xl border-r-4 border-t-4 border-secondary/30" />
          <div className="absolute bottom-3 left-3 h-12 w-12 rounded-bl-xl border-b-4 border-l-4 border-secondary/30" />
          <div className="absolute bottom-3 right-3 h-12 w-12 rounded-br-xl border-b-4 border-r-4 border-secondary/30" />
        </div>

        {/* Ícono */}
        <div className="mb-6 flex justify-center">
          <span className="grid h-20 w-20 place-items-center rounded-full bg-warning/10 text-warning text-4xl">
            <i className="fa-solid fa-award" />
          </span>
        </div>

        <p className="text-xs uppercase tracking-widest text-base-content/40 font-semibold">
          Yoliti Academy
        </p>
        <h1 className="mt-2 text-3xl font-extrabold text-secondary">
          Certificado de Finalización
        </h1>

        <div className="my-6 flex items-center gap-4">
          <div className="flex-1 border-t border-base-300" />
          <i className="fa-solid fa-star text-warning text-xs" />
          <div className="flex-1 border-t border-base-300" />
        </div>

        <p className="text-base-content/60 text-sm">
          Se otorga el presente certificado a
        </p>
        <p
          className="mt-3 text-4xl font-extrabold text-secondary"
          style={{ fontFamily: "Georgia, serif" }}
        >
          {studentName}
        </p>
        <p className="mt-4 text-base-content/60 text-sm">
          por haber completado satisfactoriamente el curso
        </p>
        <p className="mt-2 text-xl font-bold text-primary">
          &ldquo;{courseTitle}&rdquo;
        </p>

        <div className="my-8 flex items-center gap-4">
          <div className="flex-1 border-t border-base-300" />
          <i className="fa-solid fa-star text-warning text-xs" />
          <div className="flex-1 border-t border-base-300" />
        </div>

        {/* Firma y fecha */}
        <div className="flex items-end justify-between text-sm">
          <div className="text-left">
            <div className="mb-1 h-px w-40 bg-base-content/30" />
            <p className="font-semibold text-secondary">{teacherName}</p>
            <p className="text-xs text-base-content/40">Instructor</p>
          </div>
          <div className="text-right">
            <div className="mb-1 ml-auto h-px w-40 bg-base-content/30" />
            <p className="font-semibold text-secondary">{issuedDate}</p>
            <p className="text-xs text-base-content/40">Fecha de emisión</p>
          </div>
        </div>

        {/* Código de verificación */}
        <div className="mt-8 rounded-xl bg-base-200 px-4 py-3">
          <p className="text-xs text-base-content/40">
            Código de verificación
          </p>
          <code className="text-sm font-bold tracking-widest text-secondary">
            {code}
          </code>
        </div>
      </div>

      <p className="text-center text-xs text-base-content/30 print:hidden">
        Verificable en{" "}
        <span className="font-medium">
          yoliti-app.vercel.app/certificados/{code}
        </span>
      </p>
    </div>
  );
}
