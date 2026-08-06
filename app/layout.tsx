import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Zahnarzt Berichte",
  description: "Unterstützung für Zahnarztpraxen beim Schreiben von Berichten",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
