import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Control de Netbooks",
  description: "Escuela industrial N°9 El calafate.",
};

export default function RootLayout({
  children,
}: {
    children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body suppressHydrationWarning={true}>{children}</body>
    </html>
   );
}
