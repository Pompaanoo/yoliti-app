import { Suspense } from "react";
import AuthForm from "@/components/AuthForm";

export const metadata = { title: "Registro — Yoliti Academy" };

export default function RegistroPage() {
  return (
    <Suspense>
      <AuthForm mode="registro" />
    </Suspense>
  );
}
