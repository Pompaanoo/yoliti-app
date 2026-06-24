"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import Logo from "@/components/Logo";

export default function AuthForm({ mode }: { mode: "login" | "registro" }) {
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get("redirect") ?? "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const isLogin = mode === "login";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setInfo(null);
    const supabase = createClient();

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      router.push(redirect);
      router.refresh();
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
          emailRedirectTo: `${location.origin}/auth/callback`,
        },
      });
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      if (data.session) {
        router.push("/dashboard");
        router.refresh();
      } else {
        setInfo(
          "Te enviamos un correo de confirmación. Revisa tu bandeja para activar tu cuenta."
        );
        setLoading(false);
      }
    }
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-12">
      <Link href="/" className="mb-8 flex justify-center">
        <Logo className="h-14" />
      </Link>

      <div className="rounded-box border border-base-300 bg-base-100 p-8 shadow-lg">
        <h1 className="text-2xl font-bold text-secondary">
          {isLogin ? "Bienvenido de vuelta" : "Crea tu cuenta"}
        </h1>
        <p className="mt-1 text-sm text-base-content/60">
          {isLogin
            ? "Ingresa para continuar tu aprendizaje."
            : "Empieza gratis en menos de un minuto."}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {!isLogin && (
            <label className="form-control">
              <span className="label-text mb-1 font-medium">Nombre completo</span>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="input input-bordered"
                placeholder="María García"
              />
            </label>
          )}
          <label className="form-control">
            <span className="label-text mb-1 font-medium">Correo</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input input-bordered"
              placeholder="tucorreo@ejemplo.com"
            />
          </label>
          <label className="form-control">
            <span className="label-text mb-1 font-medium">Contraseña</span>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input input-bordered"
              placeholder="••••••••"
            />
          </label>

          {error && (
            <div className="alert alert-error py-2 text-sm">
              <i className="fa-solid fa-circle-exclamation" />
              <span>{error}</span>
            </div>
          )}
          {info && (
            <div className="alert alert-success py-2 text-sm">
              <i className="fa-solid fa-circle-check" />
              <span>{info}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-block"
          >
            {loading ? (
              <span className="loading loading-spinner loading-sm" />
            ) : isLogin ? (
              "Entrar"
            ) : (
              "Crear cuenta"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-base-content/60">
          {isLogin ? (
            <>
              ¿No tienes cuenta?{" "}
              <Link href="/registro" className="link link-primary font-medium">
                Regístrate
              </Link>
            </>
          ) : (
            <>
              ¿Ya tienes cuenta?{" "}
              <Link href="/login" className="link link-primary font-medium">
                Entra aquí
              </Link>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
