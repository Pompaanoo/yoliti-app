# Deploy en Vercel

El proyecto está listo para Vercel (zero-config Next.js + `vercel.json`).

## 1. Subir a GitHub

```bash
# Crea un repo vacío en GitHub (p. ej. yoliti-app) y luego:
git remote add origin https://github.com/<usuario>/yoliti-app.git
git push -u origin main
```

## 2. Importar en Vercel

1. [vercel.com/new](https://vercel.com/new) → importa el repo.
2. Framework: **Next.js** (se detecta solo). Build: `next build`. No cambies nada.

## 3. Variables de entorno (Project → Settings → Environment Variables)

Copia las mismas de `.env.local` (que **no** se sube por seguridad):

| Variable | Entornos | Notas |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Production, Preview, Development | URL del proyecto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Production, Preview, Development | llave anónima |
| `SUPABASE_SERVICE_ROLE_KEY` | Production, Preview | **secreta**, solo servidor |
| `NEXT_PUBLIC_SITE_URL` | Production | `https://<tu-dominio>.vercel.app` |
| `STRIPE_SECRET_KEY` | Production, Preview | dejar vacía hasta tener credenciales |
| `STRIPE_WEBHOOK_SECRET` | Production | dejar vacía hasta tener credenciales |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Production, Preview | dejar vacía hasta tener credenciales |

> Mientras las llaves de Stripe estén vacías, el checkout corre en **modo stub**
> (inscribe sin cobrar). Al rellenarlas, el cobro real se activa solo.

## 4. Supabase: redirect URLs

En Supabase → Authentication → URL Configuration añade tu dominio de Vercel a
**Site URL** y **Redirect URLs** (`https://<tu-dominio>.vercel.app/auth/callback`).

## 5. Webhook de Stripe (cuando lleguen las credenciales)

Endpoint: `https://<tu-dominio>.vercel.app/api/stripe/webhook`
Evento: `checkout.session.completed` → copia el signing secret a
`STRIPE_WEBHOOK_SECRET`.
