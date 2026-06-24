import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Profile, UserRole } from "@/lib/types";

/** Devuelve el usuario autenticado o null. */
export async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/** Devuelve el perfil (con rol) del usuario actual, o null. */
export async function getProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (data as Profile) ?? null;
}

/** Exige sesión. Redirige a /login si no hay usuario. */
export async function requireUser() {
  const user = await getUser();
  if (!user) redirect("/login");
  return user;
}

/**
 * Exige uno de los roles indicados. Redirige a /dashboard si el
 * usuario no tiene permiso. super_admin siempre pasa.
 */
export async function requireRole(roles: UserRole | UserRole[]) {
  const profile = await getProfile();
  if (!profile) redirect("/login");

  const allowed = Array.isArray(roles) ? roles : [roles];
  if (profile.role !== "super_admin" && !allowed.includes(profile.role)) {
    redirect("/dashboard");
  }
  return profile;
}
