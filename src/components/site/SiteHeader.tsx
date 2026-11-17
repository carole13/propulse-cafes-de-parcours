import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Menu, X } from "lucide-react";
import { articlesQuery } from "@/lib/queries";
import { defineCopy, LANGS, useCopy, useLang, useSetLang } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { Logo } from "./Brand";

const COPY = defineCopy({
  fr: {
    nav: { "/": "Accueil", "/agenda": "Agenda", "/parcours": "Parcours", "/a-propos": "À propos" },
    home: "Pro'pulse, accueil",
    main: "Navigation principale",
    mobile: "Navigation mobile",
    open: "Ouvrir le menu",
    close: "Fermer le menu",
    language: "Langue du site",
    switchTo: { fr: "Afficher le site en français", en: "Show the site in English" },
  },
  en: {
    nav: { "/": "Home", "/agenda": "Events", "/parcours": "Stories", "/a-propos": "About" },
    home: "Pro'pulse, home",
    main: "Main navigation",
    mobile: "Mobile navigation",
    open: "Open menu",
    close: "Close menu",
    language: "Site language",
    switchTo: { fr: "Afficher le site en français", en: "Show the site in English" },
  },
});

const ROUTES = ["/", "/agenda", "/parcours", "/a-propos"] as const;

/** Bouton FR | EN : la langue active est en jaune. */
function LanguageSwitch({ className }: { className?: string }) {
  const lang = useLang();
  const setLang = useSetLang();
  const t = useCopy(COPY);
  return (
    <div
      role="group"
      aria-label={t.language}
      className={cn("inline-flex rounded-full border border-brand-white/40 p-0.5", className)}
    >
      {LANGS.map((l) => (
        <button
          key={l}
          type="button"
          lang={l}
          aria-pressed={lang === l}
          aria-label={t.switchTo[l]}
          onClick={() => lang !== l && setLang(l)}
          className={cn(
            "min-w-10 rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wider transition-colors",
            lang === l
              ? "bg-brand-yellow text-brand-blue"
              : "text-brand-white hover:text-brand-yellow",
          )}
        >
          {l}
        </button>
      ))}
    </div>
  );
}

/** En-tête bleu avec logo jaune, menu et bouton de langue ; menu burger sous md. */
export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const t = useCopy(COPY);
  // « Parcours » n'apparaît dans le menu qu'à partir du premier article publié.
  const { data: articles } = useQuery(articlesQuery(1));
  const nav = ROUTES.filter((to) => to !== "/parcours" || (articles?.length ?? 0) > 0);

  return (
    <header className="sticky top-0 z-40 bg-brand-blue text-brand-white">
      <div className="container-page flex h-16 items-center justify-between gap-4 md:h-20">
        <Link to="/" aria-label={t.home} onClick={() => setOpen(false)}>
          <Logo className="h-9 md:h-11" />
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          <nav aria-label={t.main}>
            <ul className="flex items-center gap-1">
              {nav.map((to) => (
                <li key={to}>
                  <Link
                    to={to}
                    activeOptions={{ exact: to === "/" }}
                    className="rounded-full px-4 py-2 text-sm font-semibold transition-colors hover:text-brand-yellow"
                    activeProps={{ className: "text-brand-yellow" }}
                  >
                    {t.nav[to]}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <LanguageSwitch />
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <LanguageSwitch />
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-full"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? t.close : t.open}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="mobile-menu"
          aria-label={t.mobile}
          className="border-t border-brand-white/20 md:hidden"
        >
          <ul className="container-page flex flex-col py-4">
            {nav.map((to) => (
              <li key={to}>
                <Link
                  to={to}
                  activeOptions={{ exact: to === "/" }}
                  onClick={() => setOpen(false)}
                  className="block py-3 text-2xl font-bold"
                  activeProps={{ className: "text-brand-yellow" }}
                >
                  {t.nav[to]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
