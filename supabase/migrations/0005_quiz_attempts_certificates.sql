-- ─── Intentos de quiz ──────────────────────────────────────────────────────
create table public.quiz_attempts (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references public.profiles (id) on delete cascade,
  lesson_id    uuid not null references public.lessons (id)  on delete cascade,
  score_pct    integer not null default 0,
  answers_json jsonb   not null default '{}',
  created_at   timestamptz not null default now()
);

alter table public.quiz_attempts enable row level security;

create policy "attempts_own_all" on public.quiz_attempts
  for all using (user_id = auth.uid() or public.is_admin());

-- ─── Certificados ───────────────────────────────────────────────────────────
create table public.certificates (
  id        uuid primary key default gen_random_uuid(),
  user_id   uuid not null references public.profiles (id) on delete cascade,
  course_id uuid not null references public.courses  (id) on delete cascade,
  code      text unique not null
              default upper(substring(md5(gen_random_uuid()::text), 1, 12)),
  issued_at timestamptz not null default now(),
  unique (user_id, course_id)
);

alter table public.certificates enable row level security;

-- Cualquiera puede verificar un certificado por código (página pública)
create policy "certs_public_read" on public.certificates
  for select using (true);

create policy "certs_own_insert" on public.certificates
  for insert with check (user_id = auth.uid() or public.is_admin());

create policy "certs_own_delete" on public.certificates
  for delete using (user_id = auth.uid() or public.is_admin());
