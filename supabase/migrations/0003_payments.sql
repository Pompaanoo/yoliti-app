-- ─── Pagos / historial de compras ────────────────────────────────────────────
create table public.payments (
  id                    uuid primary key default gen_random_uuid(),
  user_id               uuid not null references public.profiles (id) on delete cascade,
  course_id             uuid references public.courses (id) on delete set null,
  amount_cents          integer not null,
  currency              text not null default 'mxn',
  stripe_session_id     text unique,           -- cs_live_... / cs_test_...
  stripe_payment_intent text,                  -- pi_...
  status                text not null default 'pending',  -- pending | paid | failed | refunded
  paid_at               timestamptz,
  created_at            timestamptz not null default now()
);

alter table public.payments enable row level security;

-- Solo super_admin ve y gestiona todos los pagos
create policy "admin_payments_all" on public.payments
  for all using (public.is_admin());

-- Cada alumno ve sus propios pagos
create policy "user_own_payments_select" on public.payments
  for select using (user_id = auth.uid());
