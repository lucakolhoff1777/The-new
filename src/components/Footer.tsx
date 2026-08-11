export default function Footer() {
  return (
    <footer className="border-t border-border px-6 py-10 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-muted sm:flex-row">
        <p>© {new Date().getFullYear()} Bernhard. Alle Rechte vorbehalten.</p>
        <div className="flex items-center gap-6">
          <a href="#" className="transition-colors hover:text-foreground">
            Impressum
          </a>
          <a href="#" className="transition-colors hover:text-foreground">
            Datenschutz
          </a>
          <a href="#top" className="transition-colors hover:text-foreground">
            Nach oben ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
