export const metadata = {
  title: "Contacto — Centro Yolitia",
  description:
    "Estamos aquí para ayudarte a encontrar el curso ideal para tu práctica clínica.",
};

const CONTACT = [
  ["fa-location-dot", "Dirección", "3450 E Russell Rd, Las Vegas, NV 89120"],
  ["fa-phone", "Teléfono", "+1 702-292-7026"],
  ["fa-envelope", "Correo electrónico", "info@centroyolitia.com"],
  ["fa-clock", "Horario de atención", "Lun–Vie · 9am–6pm PST"],
];

const FAQ = [
  ["¿Los cursos están acreditados para CEUs?", "Sí, todos nuestros cursos ofrecen CEUs aprobados por NASW, NBCC, CAMFT y otras organizaciones. Cada curso indica el número de CEUs y las organizaciones que lo reconocen."],
  ["¿Puedo acceder desde cualquier país?", "Absolutamente. Nuestros cursos están disponibles en línea y puedes acceder desde cualquier dispositivo con conexión a internet, en cualquier parte del mundo."],
  ["¿Tienen garantía de devolución?", "Sí. Si en los primeros 30 días no estás satisfecho con el curso, te devolvemos el 100% de tu inversión, sin preguntas."],
  ["¿Cuánto tiempo tengo acceso al material?", "El acceso es de por vida. Una vez inscrito, puedes regresar al material cuantas veces quieras y sin límite de tiempo."],
  ["¿Hay descuentos grupales para instituciones?", "Sí. Ofrecemos planes institucionales con descuentos para grupos de 5 o más personas. Contáctanos para recibir una cotización personalizada."],
];

export default function ContactoPage() {
  return (
    <div className="bg-base-200">
      {/* Encabezado */}
      <section className="bg-base-100">
        <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8">
          <h1 className="text-4xl font-extrabold text-secondary">Contáctanos</h1>
          <p className="mt-2 text-base-content/60">
            Estamos aquí para ayudarte a encontrar el curso ideal para tu
            práctica clínica.
          </p>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 sm:px-8 lg:grid-cols-[1fr_360px]">
        {/* Formulario */}
        <div className="rounded-box border border-base-300 bg-base-100 p-8 shadow-sm lg:p-10">
          <h2 className="text-xl font-bold text-secondary">Envíanos un mensaje</h2>
          <p className="mb-8 mt-1 text-sm text-base-content/50">
            Respondemos en menos de 24 horas en días hábiles.
          </p>

          <form className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="nombre" className="mb-2 block text-sm font-medium">
                  Nombre completo
                </label>
                <input id="nombre" type="text" className="input w-full" />
              </div>
              <div>
                <label htmlFor="correo" className="mb-2 block text-sm font-medium">
                  Correo electrónico
                </label>
                <input id="correo" type="email" className="input w-full" />
              </div>
            </div>
            <div>
              <label htmlFor="asunto" className="mb-2 block text-sm font-medium">
                Asunto
              </label>
              <select id="asunto" className="select w-full" defaultValue="">
                <option value="" disabled>
                  Selecciona un tema
                </option>
                <option>Información sobre cursos</option>
                <option>Preguntas sobre CEUs</option>
                <option>Soporte técnico</option>
                <option>Facturación</option>
                <option>Otro</option>
              </select>
            </div>
            <div>
              <label htmlFor="profesion" className="mb-2 block text-sm font-medium">
                Profesión
              </label>
              <input id="profesion" type="text" className="input w-full" />
            </div>
            <div>
              <label htmlFor="mensaje" className="mb-2 block text-sm font-medium">
                Mensaje
              </label>
              <textarea id="mensaje" className="textarea h-36 w-full" />
            </div>
            <label className="flex items-start gap-3">
              <input type="checkbox" className="checkbox checkbox-primary checkbox-sm mt-0.5" />
              <span className="text-xs text-base-content/50">
                Acepto la política de privacidad y el uso de mis datos para
                responder a esta consulta.
              </span>
            </label>
            <button type="button" className="btn btn-accent w-full sm:w-auto">
              <i className="fa-solid fa-paper-plane" /> Enviar mensaje
            </button>
            <p className="text-xs text-base-content/40">
              Formulario de demostración — conecta tu proveedor de correo para
              activarlo.
            </p>
          </form>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="rounded-box bg-secondary p-7 text-secondary-content">
            <h3 className="mb-5 text-base font-bold">Información de contacto</h3>
            <div className="space-y-4 text-sm">
              {CONTACT.map(([icon, label, value]) => (
                <div key={label} className="flex items-start gap-3">
                  <span className="mt-0.5 grid h-8 w-8 flex-shrink-0 place-items-center rounded-lg bg-white/10 text-xs text-info">
                    <i className={`fa-solid ${icon}`} />
                  </span>
                  <div>
                    <p className="text-xs text-secondary-content/50">{label}</p>
                    <p className="font-medium">{value}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 border-t border-white/10 pt-5">
              <p className="mb-3 text-xs text-secondary-content/50">Síguenos</p>
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
                Respondemos rápido
              </p>
            </div>
            <p className="text-xs text-base-content/50">
              El tiempo promedio de respuesta es de 4 horas en días hábiles. Para
              urgencias, escríbenos por WhatsApp.
            </p>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <section className="bg-base-100">
        <div className="mx-auto max-w-3xl px-6 py-16 sm:px-8">
          <div className="mb-10 text-center">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-primary">
              Preguntas frecuentes
            </span>
            <h2 className="text-3xl font-bold text-secondary">Respuestas rápidas</h2>
          </div>
          <div className="space-y-3">
            {FAQ.map(([q, a], i) => (
              <div
                key={q}
                className="collapse collapse-arrow rounded-xl border border-base-300 bg-base-200"
              >
                <input type="checkbox" defaultChecked={i === 0} />
                <div className="collapse-title text-sm font-semibold text-secondary">
                  {q}
                </div>
                <div className="collapse-content text-sm text-base-content/60">
                  <p>{a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
