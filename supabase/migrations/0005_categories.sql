-- ─── Clasificaciones / Categorías de cursos ──────────────────────────────────
create table public.categories (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  slug       text not null unique,
  color      text not null default '#6366f1',
  created_at timestamptz not null default now(),
  unique (name)
);

-- FK en cursos (set null si se borra la categoría)
alter table public.courses
  add column category_id uuid references public.categories (id) on delete set null;

-- RLS: todos pueden leer categorías; solo admin las gestiona
alter table public.categories enable row level security;

create policy "categories_public_read" on public.categories
  for select using (true);

create policy "categories_admin_all" on public.categories
  for all using (public.is_admin());
