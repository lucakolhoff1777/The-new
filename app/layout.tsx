import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  variable: "--font-open-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Zahnarzt Berichte",
  description: "Unterstützung für Zahnarztpraxen beim Schreiben von Berichten",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={openSans.variable}>
      <body>{children}</body>
    </html>
  );
}
