import { Link } from "@tanstack/react-router";
import { Instagram, Mail } from "lucide-react";
import {
  CONTACT_EMAIL,
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
  PROJECT_FRAME,
  PROJECT_FRAME_EN,
} from "@/lib/brand";
import { defineCopy, useCopy } from "@/lib/i18n";
import { Logo } from "./Brand";

const COPY = defineCopy({
  fr: {
    tagline:
      "Des rencontres informelles entre étudiants et professionnels, comme autour d'un café.",
    frame: PROJECT_FRAME,
    legal: "Mentions légales",
    privacy: "Politique de confidentialité",
    newTab: "(nouvel onglet)",
    rights: "un projet étudiant",
  },
  en: {
    tagline: "Informal meetups between students and professionals, over a coffee.",
    frame: PROJECT_FRAME_EN,
    legal: "Legal notice",
    privacy: "Privacy policy",
    newTab: "(new tab)",
    rights: "a student project",
  },
});

export function SiteFooter() {
  const t = useCopy(COPY);
  return (
    <footer className="bg-brand-blue text-brand-white">
      <div className="container-page grid gap-10 py-14 md:grid-cols-[1.2fr_1fr] md:items-end">
        <div className="space-y-4">
          <Logo className="h-14" />
          <p className="max-w-sm text-sm text-brand-white/90">{t.tagline}</p>
          <p className="max-w-sm text-xs text-brand-white/70">{t.frame}.</p>
        </div>
        <div className="flex flex-col gap-4 md:items-end">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-semibold text-brand-yellow hover:underline"
          >
            <Instagram className="size-5" aria-hidden="true" /> {INSTAGRAM_HANDLE}
            <span className="sr-only">{t.newTab}</span>
          </a>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="inline-flex items-center gap-2 font-semibold text-brand-yellow hover:underline"
          >
            <Mail className="size-5" aria-hidden="true" /> {CONTACT_EMAIL}
          </a>
        </div>
      </div>
      <div className="border-t border-brand-white/15">
        <div className="container-page flex flex-col gap-3 py-5 text-xs text-brand-white/75 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} Pro'pulse, {t.rights}
          </p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            <li>
              <Link to="/mentions-legales" className="hover:text-brand-yellow">
                {t.legal}
              </Link>
            </li>
            <li>
              <Link to="/confidentialite" className="hover:text-brand-yellow">
                {t.privacy}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
