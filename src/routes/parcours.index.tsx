import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { z } from "zod";
import { articlesQuery } from "@/lib/queries";
import { ARTICLE_CATEGORIES, ARTICLE_CATEGORIES_EN } from "@/lib/brand";
import { defineCopy, pick, useCopy, useLang } from "@/lib/i18n";
import { ArticleCard } from "@/components/site/ArticleCard";
import { Emph } from "@/components/site/Brand";
import { cn } from "@/lib/utils";

const searchSchema = z.object({
  categorie: z.enum(["toutes", "interview", "parcours-atypique", "vos-questions"]).catch("toutes").default("toutes"),
});

export const Route = createFileRoute("/parcours/")({
  validateSearch: searchSchema,
  head: ({ match }) => {
    const lang = match.context.lang;
    const title = pick(lang, "Parcours | Pro'pulse", "Stories | Pro'pulse");
    const description = pick(
      lang,
      "Interviews, parcours atypiques et réponses à vos questions sur le passage des études au monde pro.",
      "Interviews, unconventional paths and answers to your questions about moving from university to work.",
    );
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  loader: ({ context }) => context.queryClient.ensureQueryData(articlesQuery()),
  component: Parcours,
});

const COPY = defineCopy({
  fr: {
    eyebrow: "Parcours",
    title: { plain: "Des", emph: "parcours" },
    intro: "Des histoires vraies, des détours, et vos questions.",
    all: "Tous",
    filterLabel: "Filtrer par catégorie",
    soon: "Les premiers parcours arrivent très bientôt.",
    emptyCat: "Rien dans cette catégorie pour l'instant.",
    note: "",
  },
  en: {
    eyebrow: "Stories",
    title: { plain: "Real", emph: "career stories" },
    intro: "True stories, detours, and your questions.",
    all: "All",
    filterLabel: "Filter by category",
    soon: "The first stories are coming very soon.",
    emptyCat: "Nothing in this category yet.",
    note: "Stories are published in French.",
  },
});

type Cat = z.infer<typeof searchSchema>["categorie"];

function Parcours() {
  const lang = useLang();
  const t = useCopy(COPY);
  const labels = lang === "en" ? ARTICLE_CATEGORIES_EN : ARTICLE_CATEGORIES;
  const FILTERS: { value: Cat; label: string }[] = [
    { value: "toutes", label: t.all },
    ...(Object.keys(labels) as (keyof typeof labels)[]).map((value) => ({ value, label: labels[value] })),
  ];
  const { categorie } = Route.useSearch();
  const { data: articles } = useSuspenseQuery(articlesQuery());
  const list = categorie === "toutes" ? articles : articles.filter((a) => a.category === categorie);

  return (
    <>
      <section className="bg-brand-blue text-brand-white">
        <div className="container-page py-12 md:py-20">
          <p className="eyebrow text-brand-yellow">{t.eyebrow}</p>
          <h1 className="mt-4 text-5xl md:text-7xl">
            {t.title.plain} <Emph className="text-brand-yellow">{t.title.emph}</Emph>
          </h1>
          <p className="mt-4 max-w-lg text-lg text-brand-white/90">{t.intro}</p>
          {t.note && <p className="mt-2 text-sm text-brand-white/70">{t.note}</p>}
        </div>
      </section>

      <section className="container-page py-10 md:py-16">
        {articles.length === 0 ? (
          <p className="rounded-2xl bg-brand-mist px-6 py-16 text-center text-xl font-bold">{t.soon}</p>
        ) : (
          <>
            <div role="group" aria-label={t.filterLabel} className="flex flex-wrap gap-2">
              {FILTERS.map((f) => (
                <Link
                  key={f.value}
                  to="/parcours"
                  search={{ categorie: f.value }}
                  aria-current={categorie === f.value ? "page" : undefined}
                  className={cn(
                    "rounded-full border border-brand-blue px-4 py-2 text-sm font-semibold transition-colors",
                    categorie === f.value ? "bg-brand-blue text-brand-white" : "bg-brand-white text-brand-blue hover:bg-brand-mist",
                  )}
                >
                  {f.label}
                </Link>
              ))}
            </div>
            {list.length === 0 ? (
              <p className="mt-10 rounded-2xl bg-brand-mist p-8 text-center font-semibold">{t.emptyCat}</p>
            ) : (
              <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {list.map((a) => (
                  <div key={a.id} className="reveal">
                    <ArticleCard article={a} />
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </>
  );
}
