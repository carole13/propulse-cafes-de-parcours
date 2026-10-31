import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import type { ArticleListItem } from "@/lib/content.functions";
import { ARTICLE_CATEGORIES } from "@/lib/brand";
import { Badge, BrandSymbol } from "./Brand";

/** Article card: image, category, title, "Lire". Whole card is one link. */
export function ArticleCard({ article }: { article: ArticleListItem }) {
  return (
    <article className="group overflow-hidden rounded-2xl bg-brand-white shadow-sm ring-1 ring-border transition-transform hover:-translate-y-1">
      <Link to="/parcours/$slug" params={{ slug: article.slug }} className="flex h-full flex-col">
        <div className="aspect-[4/3] overflow-hidden bg-brand-mint">
          {article.cover_image_url ? (
            <img
              src={article.cover_image_url}
              alt=""
              loading="lazy"
              className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex size-full items-center justify-center">
              <BrandSymbol kind="star" className="text-7xl" />
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-3 p-5">
          <Badge>{ARTICLE_CATEGORIES[article.category]}</Badge>
          <h3 className="text-lg">{article.title}</h3>
          <span className="mt-auto inline-flex items-center gap-1 text-sm font-bold">
            Lire <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </span>
        </div>
      </Link>
    </article>
  );
}
