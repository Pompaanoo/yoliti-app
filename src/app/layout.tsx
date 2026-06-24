import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Yoliti Academy — Aprendizaje con propósito",
  description:
    "Cursos en línea de bienestar, inteligencia emocional y comunicación clínica. Plataforma educativa Yoliti.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" data-theme="yoliti">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
        />
      </head>
      <body className="min-h-screen bg-base-100 text-base-content antialiased">
        {children}
      </body>
    </html>
  );
}
