import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Goi",
  description: "A curated JLPT vocabulary list",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}