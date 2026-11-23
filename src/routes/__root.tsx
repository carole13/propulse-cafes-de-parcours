import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import {
  SITE_DESCRIPTION,
  SITE_DESCRIPTION_EN,
  SITE_TITLE,
  SITE_TITLE_EN,
  SITE_URL,
} from "@/lib/brand";
import { defineCopy, pick, readLang, useCopy, useLang, type Lang } from "@/lib/i18n";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";

const COPY = defineCopy({
  fr: {
    notFoundTitle: "Cette page s'est perdue en chemin.",
    notFoundText: "Elle n'existe pas ou a été déplacée.",
    home: "Retour à l'accueil",
    errorTitle: "Cette page n'a pas pu s'afficher",
    errorText: "Un souci de notre côté. Réessaie ou reviens à l'accueil.",
    retry: "Réessayer",
    skip: "Aller au contenu",
  },
  en: {
    notFoundTitle: "This page got lost along the way.",
    notFoundText: "It doesn't exist or has been moved.",
    home: "Back to home",
    errorTitle: "This page couldn't load",
    errorText: "Something went wrong on our side. Try again or go back home.",
    retry: "Try again",
    skip: "Skip to content",
  },
});

function NotFoundComponent() {
  const t = useCopy(COPY);
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-20">
      <div className="max-w-md text-center">
        <p className="text-7xl font-extrabold text-brand-blue">404</p>
        <h1 className="mt-4 text-2xl">{t.notFoundTitle}</h1>
        <p className="mt-2 text-brand-ink">{t.notFoundText}</p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex h-11 items-center rounded-full bg-brand-blue px-6 font-bold text-brand-white"
          >
            {t.home}
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  const t = useCopy(COPY);
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">{t.errorTitle}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{t.errorText}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {t.retry}
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            {t.home}
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  // Langue lue dans le cookie, côté serveur comme côté navigateur.
  beforeLoad: (): { lang: Lang } => ({ lang: readLang() }),
  head: ({ match }) => {
    const lang = match.context.lang;
    const title = pick(lang, SITE_TITLE, SITE_TITLE_EN);
    const description = pick(lang, SITE_DESCRIPTION, SITE_DESCRIPTION_EN);
    return {
      meta: [
        { charSet: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { title },
        { name: "description", content: description },
        { name: "theme-color", content: "#4361EE" },
        { property: "og:site_name", content: "Pro'pulse" },
        { property: "og:locale", content: pick(lang, "fr_FR", "en_GB") },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        // Image d'aperçu quand le lien est partagé (LinkedIn, WhatsApp, Messenger…)
        { property: "og:image", content: `${SITE_URL}/og-propulse.jpg` },
        { property: "og:image:width", content: "1200" },
        { property: "og:image:height", content: "630" },
        {
          property: "og:image:alt",
          content: "Pro'pulse : un parcours atypique peut te propulser.",
        },
        { name: "twitter:image", content: `${SITE_URL}/og-propulse.jpg` },
        { property: "og:url", content: SITE_URL },
      ],
      links: [
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
        {
          // Montserrat (remplace Proxima Nova) + Noto Serif avec son axe de largeur,
          // pour retrouver le « Noto Serif Condensed » de la charte.
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Noto+Serif:ital,wdth,wght@1,62.5..100,400..600&display=swap",
        },
        { rel: "stylesheet", href: appCss },
        { rel: "icon", href: "/favicon.png", type: "image/png" },
        { rel: "icon", href: "/favicon.ico", sizes: "any" },
      ],
    };
  },
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  const lang = useLang();
  return (
    <html lang={lang}>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const t = useCopy(COPY);

  return (
    <QueryClientProvider client={queryClient}>
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-brand-yellow focus:px-4 focus:py-2 focus:font-bold"
      >
        {t.skip}
      </a>
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main id="contenu" className="flex-1">
          <Outlet />
        </main>
        <SiteFooter />
      </div>
    </QueryClientProvider>
  );
}
