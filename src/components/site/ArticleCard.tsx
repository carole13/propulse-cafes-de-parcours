import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import type { ArticleListItem } from "@/lib/content.functions";
import { ARTICLE_CATEGORIES, ARTICLE_CATEGORIES_EN } from "@/lib/brand";
import { defineCopy, useCopy, useLang } from "@/lib/i18n";
import { Badge, BrandSymbol } from "./Brand";

const COPY = defineCopy({ fr: { read: "Lire" }, en: { read: "Read" } });

/** Carte d'article : image, catégorie, titre, « Lire ». Toute la carte est un lien. */
export function ArticleCard({ article }: { article: ArticleListItem }) {
  const lang = useLang();
  const t = useCopy(COPY);
  const category = (lang === "en" ? ARTICLE_CATEGORIES_EN : ARTICLE_CATEGORIES)[article.category];
  return (
    <article className="group overflow-hidden rounded-2xl bg-brand-white ring-1 ring-border transition-all hover:-translate-y-1 hover:shadow-lg">
      <Link to="/parcours/$slug" params={{ slug: article.slug }} className="flex h-full flex-col">
        <div className="aspect-[4/3] overflow-hidden bg-brand-blue">
          {article.cover_image_url ? (
            <img
              src={article.cover_image_url}
              alt=""
              loading="lazy"
              className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex size-full items-center justify-center">
              <BrandSymbol kind="star" className="text-5xl text-brand-yellow" />
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-3 p-5">
          <Badge tone="mint" className="self-start">
            {category}
          </Badge>
          <h3 className="text-lg">{article.title}</h3>
          <span className="mt-auto inline-flex items-center gap-1 text-sm font-bold">
            {t.read}{" "}
            <ArrowRight
              className="size-4 transition-transform group-hover:translate-x-1"
              aria-hidden="true"
            />
          </span>
        </div>
      </Link>
    </article>
  );
}
