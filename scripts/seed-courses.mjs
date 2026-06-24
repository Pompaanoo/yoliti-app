// Carga los 9 cursos originales de Yoliti (con módulos y lecciones) en Supabase.
//
// Uso:
//   node --env-file=.env.local scripts/seed-courses.mjs
//
// Es idempotente: si lo corres otra vez, actualiza los cursos por su slug y
// reescribe sus módulos/lecciones (no duplica). Necesita que ya exista al menos
// un usuario registrado (se usa el super_admin como "maestro" de los cursos).

import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("❌ Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env.local");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false },
});

// dur("8 min") -> 8 ; dur("PDF") -> null
const dur = (t) => {
  const m = /(\d+)\s*min/.exec(t);
  return m ? Number(m[1]) : null;
};
const L = (label, time) => ({
  title: label,
  duration_minutes: dur(time),
  content: /pdf/i.test(time) ? "Recurso descargable (PDF)" : null,
});

const COURSES = [
  {
    slug: "espanol-clinico",
    title: "Español Clínico Aplicado para Psicoterapeutas",
    subtitle: "Español Clínico Aplicado",
    description:
      "Domina el vocabulario clínico en español para ofrecer servicios de salud mental culturalmente competentes y conectar profundamente con tus pacientes.",
    cover_url: "https://yolitiacademy.com/wp-content/uploads/2024/04/Post-3.jpg",
    level: "intermedio",
    price: 297,
    modules: [
      { title: "Fundamentos del Español Clínico", lessons: [L("Bienvenida y orientación", "8 min"), L("¿Por qué el español clínico importa?", "25 min"), L("Glosario clínico — Módulo 1", "PDF")] },
      { title: "La Primera Sesión en Español", lessons: [L("Construcción del rapport en español", "30 min"), L("Intake y evaluación inicial", "35 min"), L("Formulario de intake (plantilla)", "PDF")] },
      { title: "Evaluación de Crisis y Riesgo", lessons: [] },
      { title: "Documentación Clínica en Español", lessons: [] },
    ],
  },
  {
    slug: "clinical-supervision",
    title: "Clinical Supervision Training for Mental Health Professionals",
    subtitle: "Clinical Supervision Training",
    description:
      "Desarrolla las competencias esenciales para supervisar a otros clínicos con confianza, eficacia y sensibilidad cultural. Ideal para terapeutas con experiencia que buscan asumir roles de liderazgo clínico.",
    cover_url: "https://yolitiacademy.com/wp-content/uploads/2024/04/Post-2.jpg",
    level: "avanzado",
    price: 247,
    modules: [
      { title: "Fundamentos de la Supervisión Clínica", lessons: [L("¿Qué hace a un buen supervisor?", "20 min"), L("Modelos de supervisión: panorama general", "35 min"), L("Guía de modelos de supervisión", "PDF")] },
      { title: "La Relación Supervisora", lessons: [L("Alianza supervisora y poder", "30 min"), L("Procesos paralelos en supervisión", "40 min"), L("Contrato de supervisión (plantilla)", "PDF")] },
      { title: "Evaluación del Supervisado", lessons: [] },
      { title: "Ética y Documentación en Supervisión", lessons: [] },
    ],
  },
  {
    slug: "conversaciones-poderosas",
    title: "Conversaciones Poderosas: Comunicación Terapéutica Avanzada",
    subtitle: "Conversaciones Poderosas",
    description:
      "Desarrolla habilidades avanzadas de comunicación terapéutica para facilitar el cambio, fortalecer la alianza y navegar conversaciones difíciles con mayor confianza y presencia.",
    cover_url: "https://yolitiacademy.com/wp-content/uploads/2024/04/Post-4.jpg",
    level: "intermedio",
    price: 197,
    modules: [
      { title: "El Arte de la Presencia Terapéutica", lessons: [L("¿Qué significa estar presente?", "18 min"), L("Escucha activa: más allá de las palabras", "28 min"), L("Ejercicios de presencia — Módulo 1", "PDF")] },
      { title: "El Poder de las Preguntas", lessons: [L("Preguntas que abren vs. preguntas que cierran", "32 min"), L("Preguntas socráticas en terapia", "28 min"), L("Banco de preguntas terapéuticas", "PDF")] },
      { title: "Conversaciones Difíciles", lessons: [] },
      { title: "Lenguaje y Cultura en la Sesión", lessons: [] },
    ],
  },
  {
    slug: "evaluacion-psicologica",
    title: "Evaluación Psicológica con Población Latina",
    subtitle: "Evaluación Psicológica",
    description:
      "Aprende a seleccionar, aplicar e interpretar evaluaciones psicológicas con validez cultural para población latina, incluyendo instrumentos adaptados y estrategias de formulación diagnóstica.",
    cover_url: "https://yolitiacademy.com/wp-content/uploads/2024/04/Post-3.jpg",
    level: "avanzado",
    price: 347,
    modules: [
      { title: "Fundamentos de la Evaluación Cultural", lessons: [L("¿Por qué la evaluación estándar falla en latinos?", "25 min"), L("Modelos de formulación cultural (DSM-5)", "38 min"), L("Formulario de entrevista cultural CFI", "PDF")] },
      { title: "Instrumentos de Evaluación", lessons: [L("PHQ-9 y GAD-7 en población latina", "30 min"), L("Escalas de trauma: PCL-5 y adaptaciones", "35 min"), L("Tabla comparativa de instrumentos", "PDF")] },
      { title: "Evaluación de Síntomas Somáticos y Culturales", lessons: [] },
      { title: "Redacción del Informe Psicológico", lessons: [] },
    ],
  },
  {
    slug: "ethics-law",
    title: "Ethics & Law for Bilingual Mental Health Professionals",
    subtitle: "Ethics & Law",
    description:
      "Navega el panorama ético y legal de la práctica de salud mental en contextos bilingües y multiculturales — desde la confidencialidad y el reporte obligatorio hasta las relaciones duales y los estándares de competencia cultural.",
    cover_url: "https://yolitiacademy.com/wp-content/uploads/2024/04/Post-2.jpg",
    level: "intermedio",
    price: 197,
    modules: [
      { title: "Foundations of Ethics in Bilingual Practice", lessons: [L("Why ethics looks different across cultures", "20 min"), L("Core ethical principles and their cultural tensions", "28 min"), L("Ethics code comparison chart", "PDF")] },
      { title: "Confidentiality and Mandated Reporting", lessons: [L("Confidentiality with immigrant clients", "25 min"), L("Mandated reporting: cultural and legal issues", "30 min"), L("State-by-state reporting guide", "PDF")] },
      { title: "Dual Relationships and Boundaries", lessons: [] },
      { title: "Licensure and Professional Standards", lessons: [] },
    ],
  },
  {
    slug: "terapia-trauma",
    title: "Terapia del Trauma con Comunidades Latinas",
    subtitle: "Terapia del Trauma",
    description:
      "Aprende enfoques basados en evidencia para el tratamiento del trauma en comunidades latinas, incluyendo trauma de migración, violencia política, trauma intergeneracional y duelo cultural.",
    cover_url: "https://yolitiacademy.com/wp-content/uploads/2026/03/pexels-photo-6683491-6683491-scaled.jpg",
    level: "avanzado",
    price: 397,
    modules: [
      { title: "Fundamentos del Trauma en Contexto Latino", lessons: [L("¿Qué es el trauma cultural?", "22 min"), L("Neurobiología del trauma — resumen clínico", "35 min"), L("Guía de evaluación de trauma", "PDF")] },
      { title: "Trauma de Migración y Desplazamiento", lessons: [L("El ciclo del migrante: pérdidas y duelo", "38 min"), L("Trabajo clínico con familias separadas", "32 min"), L("Recursos para clientes inmigrantes", "PDF")] },
      { title: "Modelos de Tratamiento Basados en Evidencia", lessons: [] },
      { title: "Trauma Intergeneracional y Cierre Terapéutico", lessons: [] },
    ],
  },
  {
    slug: "motivational-interviewing",
    title: "Motivational Interviewing: Entrevista Motivacional",
    subtitle: "Motivational Interviewing",
    description:
      "Domina la entrevista motivacional para facilitar el cambio de comportamiento y trabajar con la ambivalencia — con aplicaciones específicas para pacientes latinos y contextos bilingües.",
    cover_url: "https://yolitiacademy.com/wp-content/uploads/2024/04/Post-4.jpg",
    level: "intermedio",
    price: 247,
    modules: [
      { title: "The Spirit and Foundations of MI", lessons: [L("What is motivational interviewing?", "18 min"), L("The spirit of MI: PACE", "30 min"), L("Quick guide to MI principles", "PDF")] },
      { title: "The Four OARS Skills", lessons: [L("Open questions and affirmations", "30 min"), L("Reflective listening and summaries", "35 min"), L("OARS practice template", "PDF")] },
      { title: "Change Talk and Ambivalence", lessons: [] },
      { title: "Planning and Clinical Applications", lessons: [] },
    ],
  },
  {
    slug: "supervision-grupal",
    title: "Supervisión Grupal para Clínicos Bilingües",
    subtitle: "Supervisión Grupal",
    description:
      "Aprende a facilitar y participar en procesos de supervisión grupal efectivos, con estrategias específicas para grupos bilingües y multiculturales en contextos de práctica privada e institucional.",
    cover_url: "https://yolitiacademy.com/wp-content/uploads/2024/04/Post-2.jpg",
    level: "avanzado",
    price: 197,
    modules: [
      { title: "Fundamentos de la Supervisión Grupal", lessons: [L("¿Por qué supervisión grupal?", "15 min"), L("Formatos y estructuras posibles", "28 min"), L("Guía de encuadre grupal", "PDF")] },
      { title: "Facilitación de Grupos Clínicos", lessons: [L("El rol del facilitador grupal", "25 min"), L("Manejo de dinámicas difíciles", "30 min"), L("Rúbrica de evaluación grupal", "PDF")] },
      { title: "Diversidad Cultural en el Grupo", lessons: [] },
      { title: "Ética y Documentación Grupal", lessons: [] },
    ],
  },
  {
    slug: "documentacion-clinica",
    title: "Documentación Clínica en Español",
    subtitle: "Documentación Clínica",
    description:
      "Domina la escritura clínica profesional en español: notas de progreso, planes de tratamiento, informes de evaluación y cartas clínicas con precisión, claridad y sensibilidad cultural.",
    cover_url: "https://yolitiacademy.com/wp-content/uploads/2024/04/Post-3.jpg",
    level: "principiante",
    price: 197,
    modules: [
      { title: "Fundamentos de la Documentación Clínica", lessons: [L("¿Para qué documentamos?", "12 min"), L("Formatos SOAP y DAP en español", "30 min"), L("Plantillas de notas de progreso", "PDF")] },
      { title: "Planes de Tratamiento en Español", lessons: [L("Componentes del plan de tratamiento", "28 min"), L("Metas SMART en español", "25 min"), L("Plantilla de plan de tratamiento", "PDF")] },
      { title: "Evaluaciones e Informes Diagnósticos", lessons: [] },
      { title: "Documentación de Crisis y Situaciones Especiales", lessons: [] },
    ],
  },
];

async function main() {
  // 1) Buscar al "maestro": super_admin primero, si no, cualquier perfil.
  let { data: teacher } = await supabase
    .from("profiles")
    .select("id, full_name, role")
    .eq("role", "super_admin")
    .order("created_at")
    .limit(1)
    .maybeSingle();

  if (!teacher) {
    const { data: any } = await supabase
      .from("profiles")
      .select("id, full_name, role")
      .order("created_at")
      .limit(1)
      .maybeSingle();
    teacher = any;
  }

  if (!teacher) {
    console.error("❌ No hay ningún usuario registrado todavía.");
    console.error("   Regístrate primero en la app (http://localhost:3000/registro) y vuelve a correr esto.");
    process.exit(1);
  }

  console.log(`👤 Maestro asignado: ${teacher.full_name || "(sin nombre)"} [${teacher.role}]`);

  let okCourses = 0;
  let okModules = 0;
  let okLessons = 0;

  for (const c of COURSES) {
    // 2) Upsert del curso por slug.
    const { data: course, error: cErr } = await supabase
      .from("courses")
      .upsert(
        {
          slug: c.slug,
          title: c.title,
          subtitle: c.subtitle,
          description: c.description,
          cover_url: c.cover_url,
          level: c.level,
          price_cents: c.price * 100,
          currency: "usd",
          status: "publicado",
          teacher_id: teacher.id,
        },
        { onConflict: "slug" }
      )
      .select("id")
      .single();

    if (cErr) {
      console.error(`❌ Curso "${c.slug}":`, cErr.message);
      continue;
    }
    okCourses++;

    // 3) Borrar módulos previos (cascade borra lecciones) para no duplicar.
    await supabase.from("modules").delete().eq("course_id", course.id);

    // 4) Insertar módulos + lecciones.
    for (let mi = 0; mi < c.modules.length; mi++) {
      const m = c.modules[mi];
      const { data: mod, error: mErr } = await supabase
        .from("modules")
        .insert({ course_id: course.id, title: m.title, position: mi })
        .select("id")
        .single();

      if (mErr) {
        console.error(`  ❌ Módulo "${m.title}":`, mErr.message);
        continue;
      }
      okModules++;

      if (m.lessons.length) {
        const rows = m.lessons.map((l, li) => ({
          module_id: mod.id,
          title: l.title,
          duration_minutes: l.duration_minutes,
          content: l.content,
          position: li,
        }));
        const { error: lErr } = await supabase.from("lessons").insert(rows);
        if (lErr) console.error(`  ❌ Lecciones de "${m.title}":`, lErr.message);
        else okLessons += rows.length;
      }
    }
    console.log(`✅ ${c.title}`);
  }

  console.log(`\n🌼 Listo: ${okCourses} cursos, ${okModules} módulos, ${okLessons} lecciones.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
