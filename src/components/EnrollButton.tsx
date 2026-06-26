"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

interface Props {
  courseId: string;
  isFree: boolean;
  isLoggedIn: boolean;
  alreadyEnrolled: boolean;
  courseSlug: string;
}

export default function EnrollButton({
  courseId,
  isFree,
  isLoggedIn,
  alreadyEnrolled,
  courseSlug,
}: Props) {
  const t = useTranslations("course");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  if (alreadyEnrolled) {
    return (
      <button
        onClick={() => router.push(`/aprender/${courseSlug}`)}
        className="btn btn-secondary btn-block"
      >
        <i className="fa-solid fa-play" /> {t("continueCourse")}
      </button>
    );
  }

  async function handleEnroll() {
    if (!isLoggedIn) {
      router.push(`/login?redirect=/cursos/${courseSlug}`);
      return;
    }
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? t("enrollError"));
      if (data.stub) setMsg(t("stripeTest"));
      window.location.href = data.url;
    } catch (e) {
      setMsg((e as Error).message);
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <button
        onClick={handleEnroll}
        disabled={loading}
        className="btn btn-primary btn-block"
      >
        {loading ? (
          <span className="loading loading-spinner loading-sm" />
        ) : (
          <>
            <i className="fa-solid fa-circle-check" />
            {isFree ? t("enrollFree") : t("enrollNow")}
          </>
        )}
      </button>
      {msg && <p className="text-center text-sm text-base-content/70">{msg}</p>}
    </div>
  );
}
