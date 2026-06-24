import { Suspense } from "react";
import AuthForm from "@/components/AuthForm";

export const metadata = { title: "Entrar — Yoliti Academy" };

export default function LoginPage() {
  return (
    <Suspense>
      <AuthForm mode="login" />
    </Suspense>
  );
}
