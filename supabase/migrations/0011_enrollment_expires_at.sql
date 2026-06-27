-- Fecha de caducidad opcional para inscripciones (null = vitalicio)
alter table public.enrollments
  add column if not exists expires_at timestamptz;
