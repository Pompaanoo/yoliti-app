-- ════════════════════════════════════════════════════════════════
--  Yoliti Academy – Migración 002
--  Grupos de aprendizaje + Módulos interactivos
--  Ejecutar en: Supabase Studio → SQL Editor
-- ════════════════════════════════════════════════════════════════

-- ─── Tipo de contenido de capítulo ────────────────────────────
create type public.lesson_type as enum (
  'video', 'texto', 'quiz', 'dragdrop', 'flashcards', 'pdf'
);

-- ─── Columnas interactivas en lessons ─────────────────────────
alter table public.lessons
  add column content_type public.lesson_type not null default 'video',
  add column content_data  jsonb;

-- ─── Porcentaje en progreso ────────────────────────────────────
alter table public.lesson_progress
  add column progress_pct integer not null default 0;

-- ─── groups ────────────────────────────────────────────────────
create table public.groups (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  description text,
  image_url   text,
  teacher_id  uuid not null references public.profiles (id) on delete cascade,
  created_at  timestamptz not null default now()
);

-- ─── group_students ────────────────────────────────────────────
create table public.group_students (
  group_id uuid not null references public.groups (id) on delete cascade,
  user_id  uuid not null references public.profiles (id) on delete cascade,
  added_at timestamptz not null default now(),
  primary key (group_id, user_id)
);

-- ─── group_courses ─────────────────────────────────────────────
create table public.group_courses (
  group_id    uuid not null references public.groups (id) on delete cascade,
  course_id   uuid not null references public.courses (id) on delete cascade,
  assigned_at timestamptz not null default now(),
  primary key (group_id, course_id)
);

-- ─── RLS: groups ───────────────────────────────────────────────
alter table public.groups enable row level security;

create policy "grupos_select" on public.groups for select
  using (is_admin() or teacher_id = auth.uid());

create policy "grupos_insert" on public.groups for insert
  with check (
    current_user_role() in ('maestro', 'super_admin')
    and teacher_id = auth.uid()
  );

create policy "grupos_update" on public.groups for update
  using (is_admin() or teacher_id = auth.uid());

create policy "grupos_delete" on public.groups for delete
  using (is_admin() or teacher_id = auth.uid());

-- ─── RLS: group_students ───────────────────────────────────────
alter table public.group_students enable row level security;

create policy "gs_staff_all" on public.group_students for all
  using (current_user_role() in ('maestro', 'super_admin'));

create policy "gs_alumno_self" on public.group_students for select
  using (user_id = auth.uid());

-- ─── RLS: group_courses ────────────────────────────────────────
alter table public.group_courses enable row level security;

create policy "gc_staff_all" on public.group_courses for all
  using (current_user_role() in ('maestro', 'super_admin'));

create policy "gc_public_select" on public.group_courses for select
  using (true);

-- ─── Política adicional: alumno lee progress_pct ──────────────
-- (lesson_progress ya tiene RLS desde migración 001;
--  progress_pct es columna nueva, no requiere política adicional)
