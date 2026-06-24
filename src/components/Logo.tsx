// Logo de Centro Yolitia. La imagen vive en /public/images/logo.png
// Usa `light` en fondos oscuros (lo vuelve blanco con un filtro).

export default function Logo({
  className = "h-9",
  light = false,
}: {
  className?: string;
  light?: boolean;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/images/logo.png"
      alt="Centro Yolitia"
      className={`${className} w-auto object-contain ${
        light ? "brightness-0 invert" : ""
      }`}
    />
  );
}
