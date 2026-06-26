-- Allow enrolled students to read their courses regardless of status
drop policy if exists "cursos publicados visibles para todos" on public.courses;

create policy "cursos visibles" on public.courses
  for select using (
    status = 'publicado'
    or teacher_id = auth.uid()
    or public.is_admin()
    or exists (
      select 1 from public.enrollments
      where enrollments.course_id = courses.id
        and enrollments.user_id = auth.uid()
    )
  );
