"use client";

import { createBrowserClient } from "@supabase/ssr";

/**
 * Cliente de Supabase para componentes del navegador ("use client").
 * Usa la llave anónima pública; la seguridad real vive en las
 * políticas RLS de la base de datos.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
