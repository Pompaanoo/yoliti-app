export type UserRole = "alumno" | "maestro" | "super_admin";

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  created_at: string;
}

export type CourseLevel = "principiante" | "intermedio" | "avanzado";
export type CourseStatus = "borrador" | "publicado" | "archivado";

export interface Category {
  id: string;
  name: string;
  slug: string;
  color: string;
  created_at: string;
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  cover_url: string | null;
  level: CourseLevel;
  price_cents: number;
  currency: string;
  status: CourseStatus;
  teacher_id: string;
  created_at: string;
  categories?: Category[];
}

export interface Module {
  id: string;
  course_id: string;
  title: string;
  position: number;
}

// ─── Contenido interactivo ─────────────────────────────────────

export type LessonType = "video" | "texto" | "quiz" | "dragdrop" | "flashcards" | "pdf";

export interface VideoData {
  url: string;
  notes?: string;
}

export interface TextData {
  body: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: "single" | "truefalse";
  options: string[];
  correct: number;
  explanation?: string;
}

export interface QuizData {
  questions: QuizQuestion[];
}

export interface DragDropData {
  instruction: string;
  items: string[];
  zones: string[];
  mapping: Record<string, string>;
}

export interface FlashcardsData {
  cards: Array<{ front: string; back: string }>;
}

export interface PdfData {
  url: string;
}

export type LessonContentData =
  | VideoData
  | TextData
  | QuizData
  | DragDropData
  | FlashcardsData
  | PdfData;

export interface Lesson {
  id: string;
  module_id: string;
  title: string;
  video_url: string | null;
  content: string | null;
  duration_minutes: number | null;
  position: number;
  content_type: LessonType;
  content_data: LessonContentData | null;
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
  progress_pct: number;
}

// ─── Grupos ───────────────────────────────────────────────────

export interface Group {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  teacher_id: string;
  created_at: string;
}

export interface GroupStudent {
  group_id: string;
  user_id: string;
  added_at: string;
  profiles?: Profile;
}

export interface GroupCourse {
  group_id: string;
  course_id: string;
  assigned_at: string;
  courses?: Course;
}

export interface GroupWithDetails extends Group {
  group_students: GroupStudent[];
  group_courses: GroupCourse[];
}

// ─── Quiz y certificados ──────────────────────────────────────

export interface QuizAttempt {
  id: string;
  user_id: string;
  lesson_id: string;
  score_pct: number;
  answers_json: Record<string, number>;
  created_at: string;
}

export interface Certificate {
  id: string;
  user_id: string;
  course_id: string;
  code: string;
  issued_at: string;
}

// ─── Pagos ────────────────────────────────────────────────────

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface Payment {
  id: string;
  user_id: string;
  course_id: string | null;
  amount_cents: number;
  currency: string;
  stripe_session_id: string | null;
  stripe_payment_intent: string | null;
  status: PaymentStatus;
  paid_at: string | null;
  created_at: string;
}
