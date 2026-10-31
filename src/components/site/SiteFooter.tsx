import { Link } from "@tanstack/react-router";
import { Instagram } from "lucide-react";
import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from "@/lib/brand";
import { BrandSymbol, Logo } from "./Brand";

export function SiteFooter() {
  return (
    <footer className="bg-brand-blue text-brand-white">
      <div className="container-page flex flex-col gap-8 py-12 md:flex-row md:items-end md:justify-between">
        <div className="space-y-4">
          <Logo className="h-14" />
          <p className="max-w-xs text-sm text-brand-white/90">Des rencontres informelles entre étudiants et pros. Comme autour d'un café.</p>
        </div>
        <div className="flex flex-col gap-4 md:items-end">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-bold text-brand-yellow hover:underline"
          >
            <Instagram className="size-5" aria-hidden="true" /> {INSTAGRAM_HANDLE}
            <span className="sr-only">(nouvel onglet)</span>
          </a>
          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
            <li><Link to="/mentions-legales" className="hover:text-brand-yellow">Mentions légales</Link></li>
            <li><Link to="/confidentialite" className="hover:text-brand-yellow">Politique de confidentialité</Link></li>
          </ul>
          <p className="text-xs text-brand-white/80">
            <BrandSymbol kind="tilde" className="mr-1 text-brand-yellow" /> © {new Date().getFullYear()} Pro'pulse — un projet étudiant
          </p>
        </div>
      </div>
    </footer>
  );
}
