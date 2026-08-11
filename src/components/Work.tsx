import { ArrowUpRight } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

const projects = [
  {
    name: "Nordlicht Studio",
    category: "Branding & Webdesign",
    year: "2025",
    gradient: "from-[#2b2b1f] via-surface to-background",
  },
  {
    name: "Feld & Form",
    category: "E-Commerce",
    year: "2025",
    gradient: "from-[#1f2b23] via-surface to-background",
  },
  {
    name: "Klarwerk",
    category: "UX / UI · Entwicklung",
    year: "2024",
    gradient: "from-[#1f2229] via-surface to-background",
  },
  {
    name: "Atelier Bó",
    category: "Webdesign",
    year: "2024",
    gradient: "from-[#2b2320] via-surface to-background",
  },
];

export default function Work() {
  return (
    <section id="arbeiten" className="px-6 py-28 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="text-sm text-accent">Ausgewählte Arbeiten</span>
            <h2 className="text-balance mt-4 font-display text-4xl leading-tight tracking-tight sm:text-5xl">
              Projekte, auf die ich stolz bin.
            </h2>
          </div>
          <p className="max-w-sm text-muted">
            Platzhalter-Projekte zur Illustration des Layouts — reale Cases
            werden hier mit Screenshots und Ergebnissen ersetzt.
          </p>
        </ScrollReveal>

        <div className="mt-16 grid gap-8 sm:grid-cols-2">
          {projects.map((project, i) => (
            <ScrollReveal key={project.name} delay={i * 0.08}>
              <a
                href="#"
                className="group block overflow-hidden rounded-2xl border border-border"
              >
                <div
                  className={`relative flex aspect-[4/3] items-center justify-center bg-gradient-to-br ${project.gradient} transition-transform duration-500 group-hover:scale-[1.02]`}
                >
                  <span className="font-display text-5xl text-foreground/10">
                    {project.name}
                  </span>
                  <div className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-background/80 text-foreground opacity-0 transition-opacity group-hover:opacity-100">
                    <ArrowUpRight size={18} />
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-border bg-surface px-6 py-5">
                  <div>
                    <h3 className="font-display text-xl">{project.name}</h3>
                    <p className="mt-1 text-sm text-muted">
                      {project.category}
                    </p>
                  </div>
                  <span className="text-sm text-muted">{project.year}</span>
                </div>
              </a>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
