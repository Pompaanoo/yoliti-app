# Yoliti Academy — Plataforma LMS

Reconstrucción del sitio Yoliti como un **LMS real** con login, roles, cursos y
pagos. Mantiene la identidad visual original (paleta turquesa/coral).

## Stack

| Capa        | Tecnología                          |
| ----------- | ----------------------------------- |
| Framework   | Next.js 15 (App Router) + React 19  |
| Lenguaje    | TypeScript                          |
| Estilos     | Tailwind CSS v4 + DaisyUI v5        |
| Backend/DB  | Supabase (Postgres + Auth + RLS)    |
| Pagos       | Stripe — **modo stub** (ver abajo)  |

## Roles

- **alumno** — se inscribe y toma cursos (rol por defecto al registrarse).
- **maestro** — crea y administra sus propios cursos (`/maestro`).
- **super_admin** — gestiona usuarios, roles y toda la plataforma (`/admin`). joto git 

Las reglas se aplican en dos capas: `middleware.ts` (sesión + rutas privadas) y
`lib/auth.ts` → `requireRole()` (autorización por rol), respaldadas por
**Row Level Security** en Supabase.

## Puesta en marcha

```bash
npm install
npm run dev          # http://localhost:3000
```

### 1. Supabase

1. Crea un proyecto en [supabase.com](https://supabase.com).
2. Copia `Project URL`, `anon key` y `service_role key` a `.env.local`.
3. En **SQL Editor**, ejecuta `supabase/migrations/0001_init.sql`.
4. Regístrate en la app; serás `alumno`. Para promover roles, usa los snippets
   de `supabase/seed.sql`.

### 2. Stripe (PENDIENTE de credenciales del cliente)

Mientras `STRIPE_SECRET_KEY` esté vacío, el checkout corre en **modo stub**:
inscribe al alumno sin cobrar, para poder probar el flujo completo. Cuando
lleguen las llaves, rellénalas en `.env.local` y el cobro real se activa solo
(no hay que tocar código). El webhook vive en `/api/stripe/webhook`.

## Estructura

```
src/
  app/
    (marketing)/      → home, cursos, curso/[slug], nosotros, blog, contacto
    (auth)/           → login, registro
    (app)/            → dashboard, aprender/[slug], maestro, admin  (protegido)
    api/stripe/       → checkout (stub) + webhook
    auth/             → callback + sign-out
  components/         → Navbar, Footer, CourseCard, EnrollButton, AuthForm, LessonPlayer
  lib/
    supabase/         → client, server, middleware
    stripe/           → integración (stub)
    auth.ts           → getUser, getProfile, requireRole
    types.ts
supabase/migrations/  → esquema + RLS
```
