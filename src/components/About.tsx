import ScrollReveal from "./ScrollReveal";

const stats = [
  { value: "8+", label: "Jahre Erfahrung" },
  { value: "60+", label: "Projekte realisiert" },
  { value: "24", label: "Zufriedene Kund:innen" },
];

export default function About() {
  return (
    <section id="ueber-mich" className="px-6 py-28 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <ScrollReveal>
          <div className="aspect-[4/5] w-full max-w-sm overflow-hidden rounded-2xl bg-surface">
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-surface via-background to-accent/10">
              <span className="font-display text-8xl text-border">B.</span>
            </div>
          </div>
        </ScrollReveal>

        <div>
          <ScrollReveal>
            <span className="text-sm text-accent">Über mich</span>
            <h2 className="text-balance mt-4 font-display text-4xl leading-tight tracking-tight sm:text-5xl">
              Gestaltung ist für mich kein Endprodukt, sondern ein
              Denkprozess.
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
              Seit über acht Jahren gestalte und entwickle ich Websites für
              Unternehmen, Selbstständige und Marken, die auffallen wollen —
              ohne dabei die Klarheit zu verlieren. Mein Ansatz verbindet
              reduziertes Design mit sauberem Code, damit jede Website nicht
              nur gut aussieht, sondern auch performt.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="mt-10 grid grid-cols-3 gap-6 border-t border-border pt-8">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p className="font-display text-3xl text-foreground sm:text-4xl">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-sm text-muted">{stat.label}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
