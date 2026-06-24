export const metadata = { title: "Contacto — Yoliti Academy" };

export default function ContactoPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-4xl font-extrabold text-secondary">Contacto</h1>
      <p className="mt-3 text-base-content/60">
        ¿Tienes preguntas? Escríbenos y te responderemos pronto.
      </p>

      <form className="mt-10 space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="form-control">
            <span className="label-text mb-1 font-medium">Nombre</span>
            <input
              type="text"
              className="input input-bordered"
              placeholder="Tu nombre"
            />
          </label>
          <label className="form-control">
            <span className="label-text mb-1 font-medium">Correo</span>
            <input
              type="email"
              className="input input-bordered"
              placeholder="tucorreo@ejemplo.com"
            />
          </label>
        </div>
        <label className="form-control">
          <span className="label-text mb-1 font-medium">Mensaje</span>
          <textarea
            className="textarea textarea-bordered h-32"
            placeholder="¿En qué podemos ayudarte?"
          />
        </label>
        <button type="button" className="btn btn-primary btn-block">
          Enviar mensaje
        </button>
        <p className="text-center text-xs text-base-content/40">
          Formulario de demostración — conecta tu proveedor de correo para
          activarlo.
        </p>
      </form>
    </div>
  );
}
