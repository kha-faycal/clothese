export default function Footer() {
  return (
    <footer className="bg-[var(--background)] text-[var(--foreground)] border-t border-[var(--border)] py-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 px-6">
        
        {/* Texte copyright */}
        <p className="text-sm md:text-base text-[var(--muted)]">
          &copy; {new Date().getFullYear()} Clothese. Tous droits réservés.
        </p>

        {/* Liens sociaux */}
        <div className="flex gap-6">
          <a
            href="https://github.com/clothese"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm md:text-base font-medium hover:text-[var(--secondary)] transition-colors"
          >
            GitHub
          </a>
          <a
            href="https://twitter.com/clothese"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm md:text-base font-medium hover:text-[var(--secondary)] transition-colors"
          >
            Twitter
          </a>
        </div>
      </div>
    </footer>
  );
}
