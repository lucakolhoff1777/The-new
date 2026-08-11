import { ArrowUpRight, Globe, Mail, Share2 } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

export default function Contact() {
  return (
    <section id="kontakt" className="px-6 py-28 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal>
          <div className="rounded-3xl border border-border bg-surface px-8 py-16 text-center sm:px-16 sm:py-24">
            <span className="text-sm text-accent">Kontakt</span>
            <h2 className="text-balance mx-auto mt-4 max-w-2xl font-display text-4xl leading-tight tracking-tight sm:text-6xl">
              Lass uns deine Website zu etwas Besonderem machen.
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg text-muted">
              Erzähl mir kurz von deinem Projekt — ich melde mich innerhalb
              von 24 Stunden mit den nächsten Schritten zurück.
            </p>

            <div className="mt-10 flex flex-col items-center gap-6">
              <a
                href="mailto:hallo@bernhard-design.de"
                className="group inline-flex items-center gap-3 rounded-full bg-accent px-8 py-4 text-base font-medium text-background transition-transform hover:-translate-y-0.5"
              >
                hallo@bernhard-design.de
                <ArrowUpRight
                  size={18}
                  className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>

              <div className="flex items-center gap-5 text-muted">
                <a
                  href="#"
                  aria-label="E-Mail"
                  className="transition-colors hover:text-accent"
                >
                  <Mail size={20} />
                </a>
                <a
                  href="#"
                  aria-label="Portfolio"
                  className="transition-colors hover:text-accent"
                >
                  <Globe size={20} />
                </a>
                <a
                  href="#"
                  aria-label="Social Media"
                  className="transition-colors hover:text-accent"
                >
                  <Share2 size={20} />
                </a>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
