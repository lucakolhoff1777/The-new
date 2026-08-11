import { Layers, Palette, Rocket, Wand2 } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

const services = [
  {
    icon: Palette,
    title: "Webdesign",
    description:
      "Individuelle, markenstarke Designs, die deine Zielgruppe verstehen und überzeugen — von der ersten Skizze bis zum finalen Pixel.",
  },
  {
    icon: Layers,
    title: "Branding",
    description:
      "Logo, Farbwelt, Typografie und Tonalität als stimmiges System, das über die Website hinaus funktioniert.",
  },
  {
    icon: Wand2,
    title: "UX / UI",
    description:
      "Nutzerfreundliche Strukturen und Interaktionen, die Besucher:innen führen statt verwirren.",
  },
  {
    icon: Rocket,
    title: "Entwicklung",
    description:
      "Schnelle, zugängliche und wartbare Umsetzung mit modernen Web-Technologien — startklar für Wachstum.",
  },
];

export default function Services() {
  return (
    <section id="leistungen" className="px-6 py-28 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal className="max-w-2xl">
          <span className="text-sm text-accent">Leistungen</span>
          <h2 className="text-balance mt-4 font-display text-4xl leading-tight tracking-tight sm:text-5xl">
            Alles, was deine Website braucht — aus einer Hand.
          </h2>
        </ScrollReveal>

        <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2">
          {services.map((service, i) => (
            <ScrollReveal key={service.title} delay={i * 0.08}>
              <div className="group h-full bg-background p-8 transition-colors hover:bg-surface sm:p-10">
                <service.icon
                  size={28}
                  className="text-accent transition-transform group-hover:-translate-y-1"
                />
                <h3 className="mt-6 font-display text-2xl">
                  {service.title}
                </h3>
                <p className="mt-3 leading-relaxed text-muted">
                  {service.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
