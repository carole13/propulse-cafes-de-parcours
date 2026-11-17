import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import ReactMarkdown from "react-markdown";
import { ArrowLeft } from "lucide-react";
import { articleQuery } from "@/lib/queries";
import { ARTICLE_CATEGORIES, ARTICLE_CATEGORIES_EN } from "@/lib/brand";
import { defineCopy, pick, useCopy, useLang } from "@/lib/i18n";
import { formatLongDate } from "@/lib/format";
import { Badge } from "@/components/site/Brand";

export const Route = createFileRoute("/parcours/$slug")({
  loader: async ({ context, params }) => {
    const a = await context.queryClient.ensureQueryData(articleQuery(params.slug));
    if (!a) throw notFound();
    return { title: a.title, excerpt: a.excerpt, image: a.cover_image_url };
  },
  head: ({ loaderData, match }) => {
    const lang = match.context.lang;
    if (!loaderData) {
      return { meta: [{ title: pick(lang, "Article introuvable | Pro'pulse", "Story not found | Pro'pulse") }, { name: "robots", content: "noindex" }] };
    }
    const desc = (loaderData.excerpt ?? pick(lang, "Un parcours partagé sur Pro'pulse.", "A career story shared on Pro'pulse.")).slice(0, 160);
    const meta = [
      { title: `${loaderData.title} | Pro'pulse` },
      { name: "description", content: desc },
      { property: "og:title", content: loaderData.title },
      { property: "og:description", content: desc },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ];
    if (loaderData.image?.startsWith("https://")) {
      meta.push({ property: "og:image", content: loaderData.image }, { name: "twitter:image", content: loaderData.image });
    }
    return { meta };
  },
  notFoundComponent: NotFound,
  component: ArticlePage,
});

const COPY = defineCopy({
  fr: { notFound: "Cet article est introuvable.", all: "Voir tous les parcours", back: "Parcours" },
  en: { notFound: "This story could not be found.", all: "See all stories", back: "Stories" },
});

function NotFound() {
  const t = useCopy(COPY);
  return (
    <div className="container-page py-20 text-center">
      <h1 className="text-3xl">{t.notFound}</h1>
      <Link to="/parcours" className="mt-6 inline-block font-bold underline">
        {t.all}
      </Link>
    </div>
  );
}

function ArticlePage() {
  const lang = useLang();
  const t = useCopy(COPY);
  const { slug } = Route.useParams();
  const { data: a } = useSuspenseQuery(articleQuery(slug));
  if (!a) return null;

  return (
    <article>
      <header className="bg-brand-blue text-brand-white">
        <div className="container-page max-w-3xl py-10 md:py-16">
          <Link to="/parcours" className="inline-flex items-center gap-2 text-sm font-semibold hover:text-brand-yellow">
            <ArrowLeft className="size-4" aria-hidden="true" /> {t.back}
          </Link>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Badge tone="mint">{(lang === "en" ? ARTICLE_CATEGORIES_EN : ARTICLE_CATEGORIES)[a.category]}</Badge>
            {a.published_at && <time dateTime={a.published_at} className="text-sm">{formatLongDate(a.published_at, lang)}</time>}
          </div>
          <h1 className="mt-4 text-4xl md:text-5xl">{a.title}</h1>
          {a.excerpt && <p className="mt-4 text-lg text-brand-white/90">{a.excerpt}</p>}
        </div>
      </header>
      <div className="container-page max-w-3xl py-10 md:py-16">
        {a.cover_image_url && <img src={a.cover_image_url} alt="" className="mb-10 aspect-[16/9] w-full rounded-2xl object-cover" />}
        <div className="prose-propulse">
          <ReactMarkdown>{a.content ?? ""}</ReactMarkdown>
        </div>
      </div>
    </article>
  );
}
