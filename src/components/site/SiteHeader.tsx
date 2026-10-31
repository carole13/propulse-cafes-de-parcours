import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { Logo } from "./Brand";

const NAV = [
  { to: "/", label: "Accueil" },
  { to: "/agenda", label: "Agenda" },
  { to: "/parcours", label: "Parcours" },
  { to: "/a-propos", label: "À propos" },
] as const;

/** Blue header with yellow logo; burger menu below md. */
export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 bg-brand-blue text-brand-white">
      <div className="container-page flex h-16 items-center justify-between md:h-20">
        <Link to="/" aria-label="Pro'pulse — accueil" onClick={() => setOpen(false)}>
          <Logo className="h-9 md:h-11" />
        </Link>

        <nav aria-label="Navigation principale" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {NAV.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  activeOptions={{ exact: item.to === "/" }}
                  className="rounded-full px-4 py-2 text-sm font-semibold transition-colors hover:text-brand-yellow"
                  activeProps={{ className: "text-brand-yellow" }}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          className="inline-flex size-11 items-center justify-center rounded-full md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {open && (
        <nav id="mobile-menu" aria-label="Navigation mobile" className="border-t border-brand-white/20 md:hidden">
          <ul className="container-page flex flex-col py-4">
            {NAV.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  activeOptions={{ exact: item.to === "/" }}
                  onClick={() => setOpen(false)}
                  className="block py-3 text-2xl font-extrabold"
                  activeProps={{ className: "text-brand-yellow" }}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
