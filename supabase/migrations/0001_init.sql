-- ╔══════════════════════════════════════════════════════════════╗
-- ║  Yoliti Academy — Esquema inicial                              ║
-- ║  Roles: alumno · maestro · super_admin                         ║
-- ╚══════════════════════════════════════════════════════════════╝
-- Ejecutar en: Supabase Studio → SQL Editor (o `supabase db push`).

-- ─── Tipos ───────────────────────────────────────────────────────
create type public.user_role as enum ('alumno', 'maestro', 'super_admin');
create type public.course_level as enum ('principiante', 'intermedio', 'avanzado');
create type public.course_status as enum ('borrador', 'publicado', 'archivado');
create type public.enrollment_status as enum ('activo', 'pendiente', 'cancelado');

-- ─── profiles (1:1 con auth.users) ───────────────────────────────
create table public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  full_name   text,
  avatar_url  text,
  role        public.user_role not null default 'alumno',
  created_at  timestamptz not null default now()
);

-- ─── courses ─────────────────────────────────────────────────────
create table public.courses (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  title       text not null,
  subtitle    text,
  description text,
  cover_url   text,
  level       public.course_level not null default 'principiante',
  price_cents integer not null default 0,
  currency    text not null default 'mxn',
  status      public.course_status not null default 'borrador',
  teacher_id  uuid not null references public.profiles (id) on delete cascade,
  created_at  timestamptz not null default now()
);

-- ─── modules ─────────────────────────────────────────────────────
create table public.modules (
  id        uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses (id) on delete cascade,
  title     text not null,
  position  integer not null default 0
);

-- ─── lessons ─────────────────────────────────────────────────────
create table public.lessons (
  id               uuid primary key default gen_random_uuid(),
  module_id        uuid not null references public.modules (id) on delete cascade,
  title            text not null,
  video_url        text,
  content          text,
  duration_minutes integer,
  position         integer not null default 0
);

-- ─── enrollments ─────────────────────────────────────────────────
create table public.enrollments (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles (id) on delete cascade,
  course_id  uuid not null references public.courses (id) on delete cascade,
  status     public.enrollment_status not null default 'activo',
  created_at timestamptz not null default now(),
  unique (user_id, course_id)
);

-- ─── lesson_progress ─────────────────────────────────────────────
create table public.lesson_progress (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references public.profiles (id) on delete cascade,
  lesson_id    uuid not null references public.lessons (id) on delete cascade,
  completed    boolean not null default false,
  completed_at timestamptz,
  unique (user_id, lesson_id)
);

-- ╔══════════════════════════════════════════════════════════════╗
-- ║  Helpers de rol (security definer para evitar recursión RLS)  ║
-- ╚══════════════════════════════════════════════════════════════╝
create or replace function public.current_user_role()
returns public.user_role
language sql stable security definer set search_path = public as $$
  select role from public.profiles where id = auth.uid();
$$;

create or replace function public.is_admin()
returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce(public.current_user_role() = 'super_admin', false);
$$;

-- ─── Trigger: crear perfil automáticamente al registrarse ────────
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    'alumno'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ╔══════════════════════════════════════════════════════════════╗
-- ║  Row Level Security                                            ║
-- ╚══════════════════════════════════════════════════════════════╝
alter table public.profiles        enable row level security;
alter table public.courses         enable row level security;
alter table public.modules         enable row level security;
alter table public.lessons         enable row level security;
alter table public.enrollments     enable row level security;
alter table public.lesson_progress enable row level security;

-- profiles -------------------------------------------------------
create policy "perfil propio: leer" on public.profiles
  for select using (auth.uid() = id or public.is_admin());
create policy "perfil propio: actualizar" on public.profiles
  for update using (auth.uid() = id or public.is_admin());
create policy "admin gestiona perfiles" on public.profiles
  for all using (public.is_admin());

-- courses --------------------------------------------------------
create policy "cursos publicados visibles para todos" on public.courses
  for select using (
    status = 'publicado'
    or teacher_id = auth.uid()
    or public.is_admin()
  );
create policy "maestro crea sus cursos" on public.courses
  for insert with check (
    teacher_id = auth.uid()
    and public.current_user_role() in ('maestro', 'super_admin')
  );
create policy "maestro edita sus cursos" on public.courses
  for update using (teacher_id = auth.uid() or public.is_admin());
create policy "maestro borra sus cursos" on public.courses
  for delete using (teacher_id = auth.uid() or public.is_admin());

-- modules & lessons: visibles si el curso es visible; edita el dueño
create policy "ver modulos de cursos visibles" on public.modules
  for select using (
    exists (
      select 1 from public.courses c
      where c.id = course_id
        and (c.status = 'publicado' or c.teacher_id = auth.uid() or public.is_admin())
    )
  );
create policy "maestro gestiona sus modulos" on public.modules
  for all using (
    exists (
      select 1 from public.courses c
      where c.id = course_id and (c.teacher_id = auth.uid() or public.is_admin())
    )
  );

create policy "ver lecciones de cursos visibles" on public.lessons
  for select using (
    exists (
      select 1 from public.modules m
      join public.courses c on c.id = m.course_id
      where m.id = module_id
        and (c.status = 'publicado' or c.teacher_id = auth.uid() or public.is_admin())
    )
  );
create policy "maestro gestiona sus lecciones" on public.lessons
  for all using (
    exists (
      select 1 from public.modules m
      join public.courses c on c.id = m.course_id
      where m.id = module_id and (c.teacher_id = auth.uid() or public.is_admin())
    )
  );

-- enrollments ----------------------------------------------------
create policy "ver mis inscripciones" on public.enrollments
  for select using (user_id = auth.uid() or public.is_admin());
create policy "inscribirme yo mismo" on public.enrollments
  for insert with check (user_id = auth.uid() or public.is_admin());

-- lesson_progress ------------------------------------------------
create policy "ver mi progreso" on public.lesson_progress
  for select using (user_id = auth.uid() or public.is_admin());
create policy "guardar mi progreso" on public.lesson_progress
  for all using (user_id = auth.uid() or public.is_admin());
