-- Add "privado" course status: visible only to enrolled students (via group), not in public catalog

-- Update RLS policy on courses to allow enrolled students to read "privado" courses
drop policy if exists "cursos publicados visibles para todos" on public.courses;

create policy "cursos visibles" on public.courses
  for select using (
    status = 'publicado'
    or teacher_id = auth.uid()
    or public.is_admin()
    or (
      status = 'privado'
      and exists (
        select 1 from public.enrollments
        where enrollments.course_id = courses.id
          and enrollments.user_id = auth.uid()
      )
    )
  );

-- Same pattern for modules: visible if course is visible
drop policy if exists "modulos visibles si curso visible" on public.modules;

create policy "modulos visibles si curso visible" on public.modules
  for select using (
    exists (
      select 1 from public.courses
      where courses.id = modules.course_id
    )
  );

-- Same pattern for lessons
drop policy if exists "lecciones visibles si curso visible" on public.lessons;

create policy "lecciones visibles si curso visible" on public.lessons
  for select using (
    exists (
      select 1 from public.modules
      where modules.id = lessons.module_id
    )
  );
