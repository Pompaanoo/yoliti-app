-- ─── Muchos-a-muchos: cursos ↔ categorías ────────────────────────────────────
create table public.course_categories (
  course_id   uuid not null references public.courses(id) on delete cascade,
  category_id uuid not null references public.categories(id) on delete cascade,
  primary key (course_id, category_id)
);

-- Migrar datos existentes del campo antiguo
insert into public.course_categories (course_id, category_id)
select id, category_id
from public.courses
where category_id is not null;

-- Eliminar columna antigua
alter table public.courses drop column category_id;

-- RLS
alter table public.course_categories enable row level security;

create policy "cc_public_read" on public.course_categories
  for select using (true);

create policy "cc_admin_teacher_all" on public.course_categories
  for all using (
    public.is_admin() or
    exists (
      select 1 from public.courses c
      where c.id = course_categories.course_id
        and c.teacher_id = auth.uid()
    )
  );
