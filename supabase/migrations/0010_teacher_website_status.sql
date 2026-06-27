-- Agrega visibilidad pública a los perfiles de maestros
alter table public.profiles
  add column if not exists website_status text not null default 'oculto'
  check (website_status in ('publico', 'oculto'));
