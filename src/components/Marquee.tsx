const words = [
  "Webdesign",
  "Branding",
  "UX / UI",
  "Entwicklung",
  "Design-Systeme",
  "Motion",
];

export default function Marquee() {
  const items = [...words, ...words];

  return (
    <div className="overflow-hidden border-y border-border bg-surface py-6">
      <div className="animate-marquee flex w-max gap-12 whitespace-nowrap">
        {items.map((word, i) => (
          <span
            key={i}
            className="flex items-center gap-12 font-display text-2xl text-muted sm:text-3xl"
          >
            {word}
            <span className="text-accent">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
