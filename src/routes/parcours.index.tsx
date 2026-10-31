import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { z } from "zod";
import { articlesQuery } from "@/lib/queries";
import { ARTICLE_CATEGORIES } from "@/lib/brand";
import { ArticleCard } from "@/components/site/ArticleCard";
import { BrandSymbol, Emph } from "@/components/site/Brand";
import { cn } from "@/lib/utils";

const searchSchema = z.object({
  categorie: z.enum(["toutes", "interview", "parcours-atypique", "vos-questions"]).catch("toutes").default("toutes"),
});

export const Route = createFileRoute("/parcours/")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Parcours | Pro'pulse" },
      { name: "description", content: "Interviews, parcours atypiques et réponses à vos questions sur le passage des études au monde pro." },
      { property: "og:title", content: "Parcours | Pro'pulse" },
      { property: "og:description", content: "Interviews, parcours atypiques et réponses à vos questions." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(articlesQuery()),
  component: Parcours,
});

const FILTERS = [{ value: "toutes", label: "Tous" }, ...Object.entries(ARTICLE_CATEGORIES).map(([value, label]) => ({ value, label }))] as {
  value: z.infer<typeof searchSchema>["categorie"];
  label: string;
}[];

function Parcours() {
  const { categorie } = Route.useSearch();
  const { data: articles } = useSuspenseQuery(articlesQuery());
  const list = categorie === "toutes" ? articles : articles.filter((a) => a.category === categorie);

  return (
    <>
      <section className="bg-brand-blue text-brand-white">
        <div className="container-page py-12 md:py-20">
          <h1 className="text-5xl md:text-7xl">
            Des <Emph className="text-brand-yellow">parcours</Emph>
          </h1>
          <p className="mt-4 max-w-lg text-lg">Des histoires vraies, des détours, et vos questions.</p>
        </div>
      </section>

      <section className="container-page py-10 md:py-16">
        {articles.length === 0 ? (
          <div className="flex flex-col items-center gap-4 rounded-2xl bg-brand-mist px-6 py-16 text-center">
            <BrandSymbol kind="face" />
            <p className="text-xl font-bold">Les premiers parcours arrivent très bientôt.</p>
          </div>
        ) : (
          <>
            <div role="group" aria-label="Filtrer par catégorie" className="flex flex-wrap gap-2">
              {FILTERS.map((f) => (
                <Link
                  key={f.value}
                  to="/parcours"
                  search={{ categorie: f.value }}
                  aria-current={categorie === f.value ? "page" : undefined}
                  className={cn(
                    "rounded-full border-2 border-brand-blue px-5 py-2 text-sm font-bold transition-colors",
                    categorie === f.value ? "bg-brand-blue text-brand-white" : "bg-brand-white text-brand-blue hover:bg-brand-mint",
                  )}
                >
                  {f.label}
                </Link>
              ))}
            </div>
            {list.length === 0 ? (
              <p className="mt-10 rounded-2xl bg-brand-mist p-8 text-center font-semibold">Rien dans cette catégorie pour l'instant.</p>
            ) : (
              <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {list.map((a) => (
                  <ArticleCard key={a.id} article={a} />
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </>
  );
}
