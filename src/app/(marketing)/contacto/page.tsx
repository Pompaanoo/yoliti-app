import { getTranslations } from "next-intl/server";

export const metadata = {
  title: "Contacto — Centro Yolitia",
  description:
    "Estamos aquí para ayudarte a encontrar el curso ideal para tu práctica clínica.",
};

const CONTACT_ICONS = ["fa-location-dot", "fa-phone", "fa-envelope", "fa-clock"];

export default async function ContactoPage() {
  const t = await getTranslations("contacto");
  const labels = t.raw("infoLabels") as string[];
  const subjectOptions = t.raw("formSubjectOptions") as string[];
  const faq = t.raw("faq") as { q: string; a: string }[];

  const contactValues = [
    "3450 E Russell Rd, Las Vegas, NV 89120",
    "+1 702-292-7026",
    "info@centroyolitia.com",
    t("infoHours"),
  ];

  return (
    <div className="bg-base-200">
      {/* Encabezado */}
      <section className="bg-base-100">
        <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8">
          <h1 className="text-4xl font-extrabold text-secondary">{t("title")}</h1>
          <p className="mt-2 text-base-content/60">{t("sub")}</p>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 sm:px-8 lg:grid-cols-[1fr_360px]">
        {/* Formulario */}
        <div className="rounded-box border border-base-300 bg-base-100 p-8 shadow-sm lg:p-10">
          <h2 className="text-xl font-bold text-secondary">{t("formTitle")}</h2>
          <p className="mb-8 mt-1 text-sm text-base-content/50">{t("formSub")}</p>

          <form className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="nombre" className="mb-2 block text-sm font-medium">
                  {t("formName")}
                </label>
                <input id="nombre" type="text" className="input w-full" />
              </div>
              <div>
                <label htmlFor="correo" className="mb-2 block text-sm font-medium">
                  {t("formEmail")}
                </label>
                <input id="correo" type="email" className="input w-full" />
              </div>
            </div>
            <div>
              <label htmlFor="asunto" className="mb-2 block text-sm font-medium">
                {t("formSubject")}
              </label>
              <select id="asunto" className="select w-full" defaultValue="">
                <option value="" disabled>
                  {t("formSubjectPlaceholder")}
                </option>
                {subjectOptions.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="profesion" className="mb-2 block text-sm font-medium">
                {t("formProfession")}
              </label>
              <input id="profesion" type="text" className="input w-full" />
            </div>
            <div>
              <label htmlFor="mensaje" className="mb-2 block text-sm font-medium">
                {t("formMessage")}
              </label>
              <textarea id="mensaje" className="textarea h-36 w-full" />
            </div>
            <label className="flex items-start gap-3">
              <input type="checkbox" className="checkbox checkbox-primary checkbox-sm mt-0.5" />
              <span className="text-xs text-base-content/50">
                {t("formPrivacy")}
              </span>
            </label>
            <button type="button" className="btn btn-accent w-full sm:w-auto">
              <i className="fa-solid fa-paper-plane" /> {t("formSubmit")}
            </button>
            <p className="text-xs text-base-content/40">{t("formDemo")}</p>
          </form>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="rounded-box bg-secondary p-7 text-secondary-content">
            <h3 className="mb-5 text-base font-bold">{t("infoTitle")}</h3>
            <div className="space-y-4 text-sm">
              {CONTACT_ICONS.map((icon, i) => (
                <div key={icon} className="flex items-start gap-3">
                  <span className="mt-0.5 grid h-8 w-8 flex-shrink-0 place-items-center rounded-lg bg-white/10 text-xs text-info">
                    <i className={`fa-solid ${icon}`} />
                  </span>
                  <div>
                    <p className="text-xs text-secondary-content/50">
                      {labels[i]}
                    </p>
                    <p className="font-medium">{contactValues[i]}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 border-t border-white/10 pt-5">
              <p className="mb-3 text-xs text-secondary-content/50">
                {t("infoFollow")}
              </p>
              <div className="flex gap-2.5">
                {["instagram", "facebook-f", "linkedin-in", "youtube"].map((s) => (
                  <a
                    key={s}
                    href="#"
                    className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-xs transition-colors hover:bg-white/20"
                  >
                    <i className={`fa-brands fa-${s}`} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-box border border-base-300 bg-base-100 p-6 shadow-sm">
            <div className="mb-3 flex items-center gap-3">
              <span className="h-3 w-3 animate-pulse rounded-full bg-success" />
              <p className="text-sm font-semibold text-secondary">
                {t("responseTitle")}
              </p>
            </div>
            <p className="text-xs text-base-content/50">{t("responseDesc")}</p>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <section className="bg-base-100">
        <div className="mx-auto max-w-3xl px-6 py-16 sm:px-8">
          <div className="mb-10 text-center">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-primary">
              {t("faqLabel")}
            </span>
            <h2 className="text-3xl font-bold text-secondary">{t("faqTitle")}</h2>
          </div>
          <div className="space-y-3">
            {faq.map((item, i) => (
              <div
                key={item.q}
                className="collapse collapse-arrow rounded-xl border border-base-300 bg-base-200"
              >
                <input type="checkbox" defaultChecked={i === 0} />
                <div className="collapse-title text-sm font-semibold text-secondary">
                  {item.q}
                </div>
                <div className="collapse-content text-sm text-base-content/60">
                  <p>{item.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
