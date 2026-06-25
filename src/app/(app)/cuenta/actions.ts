"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth";

export async function updateProfileAction(formData: FormData) {
  const user = await requireUser();
  const supabase = await createClient();

  const full_name = String(formData.get("full_name") ?? "").trim() || null;

  const { error } = await supabase
    .from("profiles")
    .update({ full_name })
    .eq("id", user.id);

  if (error) redirect(`/cuenta?error=${encodeURIComponent(error.message)}`);
  redirect("/cuenta?msg=Perfil+actualizado+correctamente");
}

export async function updateAvatarAction(formData: FormData) {
  const user = await requireUser();
  const supabase = await createClient();

  const file = formData.get("avatar") as File | null;
  if (!file || file.size === 0)
    redirect("/cuenta?error=Selecciona+una+imagen");
  if (file.size > 5 * 1024 * 1024)
    redirect("/cuenta?error=La+imagen+no+puede+superar+5+MB");

  const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!allowed.includes(file.type))
    redirect("/cuenta?error=Formato+no+soportado.+Usa+JPG%2C+PNG+o+WebP");

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const path = `${user.id}/avatar.${ext}`;

  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(path, buffer, { contentType: file.type, upsert: true });

  if (uploadError)
    redirect(`/cuenta?error=${encodeURIComponent(uploadError.message)}`);

  const {
    data: { publicUrl },
  } = supabase.storage.from("avatars").getPublicUrl(path);

  // Cache-bust para forzar recarga inmediata
  const avatarUrl = `${publicUrl}?v=${Date.now()}`;

  const { error: updateError } = await supabase
    .from("profiles")
    .update({ avatar_url: avatarUrl })
    .eq("id", user.id);

  if (updateError)
    redirect(`/cuenta?error=${encodeURIComponent(updateError.message)}`);

  redirect("/cuenta?msg=Foto+de+perfil+actualizada");
}

export async function updateEmailAction(formData: FormData) {
  await requireUser();
  const supabase = await createClient();

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!email || !email.includes("@"))
    redirect("/cuenta?error=Ingresa+un+correo+válido");

  const { error } = await supabase.auth.updateUser({ email });
  if (error) redirect(`/cuenta?error=${encodeURIComponent(error.message)}`);

  redirect("/cuenta?msg=Revisa+tu+nuevo+correo+para+confirmar+el+cambio");
}

export async function requestPasswordResetAction() {
  const user = await requireUser();
  const supabase = await createClient();

  if (!user.email)
    redirect("/cuenta?error=No+se+encontró+correo+registrado");

  const headersList = await headers();
  const host = headersList.get("host") ?? "yoliti-app.vercel.app";
  const proto = host.startsWith("localhost") ? "http" : "https";
  const siteUrl = `${proto}://${host}`;

  const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
    redirectTo: `${siteUrl}/auth/callback?next=/cuenta/nueva-contrasena`,
  });

  if (error) redirect(`/cuenta?error=${encodeURIComponent(error.message)}`);
  redirect("/cuenta?msg=Revisa+tu+correo+para+establecer+una+nueva+contraseña");
}
