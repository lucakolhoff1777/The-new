import ScrollReveal from "./ScrollReveal";

const testimonials = [
  {
    quote:
      "Bernhard hat unsere Vision besser verstanden als wir selbst. Das Ergebnis wirkt hochwertig, ist aber trotzdem einfach zu pflegen.",
    name: "Anna Reiter",
    role: "Gründerin, Nordlicht Studio",
  },
  {
    quote:
      "Klare Kommunikation, schnelle Umsetzung, und ein Auge für Details, das man selten findet. Absolute Empfehlung.",
    name: "Markus Vogt",
    role: "Geschäftsführer, Feld & Form",
  },
  {
    quote:
      "Unsere Conversion-Rate hat sich nach dem Relaunch spürbar verbessert. Design, das tatsächlich funktioniert.",
    name: "Lea Brunner",
    role: "Marketing Lead, Klarwerk",
  },
];

export default function Testimonials() {
  return (
    <section id="stimmen" className="border-y border-border bg-surface px-6 py-28 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal className="max-w-2xl">
          <span className="text-sm text-accent">Stimmen</span>
          <h2 className="text-balance mt-4 font-display text-4xl leading-tight tracking-tight sm:text-5xl">
            Was Kund:innen über die Zusammenarbeit sagen.
          </h2>
        </ScrollReveal>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <ScrollReveal key={t.name} delay={i * 0.08}>
              <figure className="flex h-full flex-col justify-between rounded-2xl border border-border bg-background p-8">
                <blockquote className="font-display text-xl leading-relaxed text-foreground">
                  „{t.quote}“
                </blockquote>
                <figcaption className="mt-8">
                  <p className="text-sm text-foreground">{t.name}</p>
                  <p className="text-sm text-muted">{t.role}</p>
                </figcaption>
              </figure>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
