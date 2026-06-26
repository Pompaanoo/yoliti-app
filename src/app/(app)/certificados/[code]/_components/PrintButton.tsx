"use client";

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="btn btn-outline btn-sm gap-2"
    >
      <i className="fa-solid fa-print" />
      Imprimir / Guardar PDF
    </button>
  );
}
