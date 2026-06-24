// Tipos centrales del dominio Yoliti Academy.

export type UserRole = "alumno" | "maestro" | "super_admin";

export interface Profile {
  id: string; // = auth.users.id
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  created_at: string;
}

export type CourseLevel = "principiante" | "intermedio" | "avanzado";
export type CourseStatus = "borrador" | "publicado" | "archivado";

export interface Course {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  cover_url: string | null;
  level: CourseLevel;
  price_cents: number; // 0 = gratis
  currency: string; // "mxn" | "usd"
  status: CourseStatus;
  teacher_id: string;
  created_at: string;
}

export interface Module {
  id: string;
  course_id: string;
  title: string;
  position: number;
}

export interface Lesson {
  id: string;
  module_id: string;
  title: string;
  video_url: string | null;
  content: string | null;
  duration_minutes: number | null;
  position: number;
}

export interface Enrollment {
  id: string;
  user_id: string;
  course_id: string;
  status: "activo" | "pendiente" | "cancelado";
  created_at: string;
}

export interface LessonProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  completed: boolean;
  completed_at: string | null;
}
