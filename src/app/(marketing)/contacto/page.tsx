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
          <div>
            <label htmlFor="nombre" className="mb-2 block text-sm font-medium">
              Nombre
            </label>
            <input
              id="nombre"
              type="text"
              className="input w-full"
              placeholder="Tu nombre"
            />
          </div>
          <div>
            <label htmlFor="correo" className="mb-2 block text-sm font-medium">
              Correo
            </label>
            <input
              id="correo"
              type="email"
              className="input w-full"
              placeholder="tucorreo@ejemplo.com"
            />
          </div>
        </div>
        <div>
          <label htmlFor="mensaje" className="mb-2 block text-sm font-medium">
            Mensaje
          </label>
          <textarea
            id="mensaje"
            className="textarea h-32 w-full"
            placeholder="¿En qué podemos ayudarte?"
          />
        </div>
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
