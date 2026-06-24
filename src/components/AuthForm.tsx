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

      <div className="rounded-box border border-base-300 bg-base-100 p-8 shadow-lg sm:p-10">
        <h1 className="text-2xl font-bold text-secondary">
          {isLogin ? "Bienvenido de vuelta" : "Crea tu cuenta"}
        </h1>
        <p className="mt-1 text-sm text-base-content/60">
          {isLogin
            ? "Ingresa para continuar tu aprendizaje."
            : "Empieza gratis en menos de un minuto."}
        </p>

        <form onSubmit={handleSubmit} className="mt-7 space-y-5">
          {!isLogin && (
            <div>
              <label
                htmlFor="fullName"
                className="mb-2 block text-sm font-medium"
              >
                Nombre completo
              </label>
              <input
                id="fullName"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="input w-full"
                placeholder="María García"
              />
            </div>
          )}
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium">
              Correo
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input w-full"
              placeholder="tucorreo@ejemplo.com"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium"
            >
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input w-full"
              placeholder="••••••••"
            />
          </div>

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
