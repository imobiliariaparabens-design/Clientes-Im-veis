import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Atualização de Cadastro de Imóvel | Para-Bens",
  description: "Página para proprietários atualizarem dados de imóveis com a imobiliária Para-Bens.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
