"use client";

import { useLocale } from "next-intl";

export default function LanguageSwitcher() {
  const locale = useLocale();

  function setLang(lang: "es" | "en") {
    if (lang === locale) return;
    document.cookie = `NEXT_LOCALE=${lang};path=/;max-age=31536000;samesite=lax`;
    window.location.reload();
  }

  return (
    <div className="flex flex-shrink-0 items-center overflow-hidden rounded-lg border border-base-300 text-xs font-semibold">
      <button
        onClick={() => setLang("es")}
        className={`px-2.5 py-1.5 transition-colors ${
          locale === "es"
            ? "bg-primary text-primary-content"
            : "text-base-content/60 hover:text-primary"
        }`}
      >
        ES
      </button>
      <button
        onClick={() => setLang("en")}
        className={`px-2.5 py-1.5 transition-colors ${
          locale === "en"
            ? "bg-primary text-primary-content"
            : "text-base-content/60 hover:text-primary"
        }`}
      >
        EN
      </button>
    </div>
  );
}
