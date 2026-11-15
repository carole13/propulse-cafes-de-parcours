/**
 * Section « Retrouve-nous sur Instagram » de l'accueil : grille des dernières publications.
 * Masquée tant que le flux n'est pas configuré ou ne renvoie rien (aucun trou sur la page).
 */
import { useQuery } from "@tanstack/react-query";
import { Copy, Instagram, Play } from "lucide-react";
import { instagramQuery } from "@/lib/queries";
import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from "@/lib/brand";
import { buttonVariants } from "@/components/ui/button";
import { Emph, Logo } from "./Brand";

export function InstagramFeed() {
  const { data: posts = [] } = useQuery(instagramQuery);
  if (posts.length === 0) return null;

  return (
    <section aria-labelledby="instagram-title" className="container-page pt-16 md:pt-24">
      <h2 id="instagram-title" className="text-3xl md:text-5xl">
        Retrouve-nous sur <Emph>Instagram</Emph>
      </h2>

      <a
        href={INSTAGRAM_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="group mt-8 inline-flex items-center gap-4"
      >
        <span className="flex size-16 shrink-0 items-center justify-center rounded-full bg-brand-blue p-3 md:size-20">
          <Logo className="h-auto w-full" />
        </span>
        <span className="text-lg font-extrabold group-hover:underline md:text-xl">
          {INSTAGRAM_HANDLE.replace("@", "")}
          <span className="sr-only"> sur Instagram (nouvel onglet)</span>
        </span>
      </a>

      <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-6">
        {posts.map((p) => (
          <li key={p.id} className="reveal">
            <a
              href={p.permalink}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block aspect-[4/5] overflow-hidden rounded-2xl bg-brand-mist"
            >
              <img
                src={p.imageUrl}
                alt={p.alt}
                width={p.width ?? undefined}
                height={p.height ?? undefined}
                loading="lazy"
                decoding="async"
                className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Voile bleu au survol, comme un aplat de la charte */}
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-brand-blue/0 transition-colors group-hover:bg-brand-blue/25"
              />
              {p.kind === "carousel" && (
                <Copy
                  aria-hidden="true"
                  className="absolute right-3 top-3 size-6 text-brand-white drop-shadow-md"
                />
              )}
              {p.kind === "video" && (
                <span
                  aria-hidden="true"
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <span className="flex size-14 items-center justify-center rounded-full bg-brand-white/90 text-brand-blue shadow-lg">
                    <Play className="ml-1 size-6 fill-current" />
                  </span>
                </span>
              )}
              <span className="sr-only">
                {p.kind === "video" ? "Vidéo" : p.kind === "carousel" ? "Carrousel" : "Photo"} :{" "}
                {p.alt} (nouvel onglet)
              </span>
            </a>
          </li>
        ))}
      </ul>

      <a
        href={INSTAGRAM_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonVariants({ size: "lg", className: "mt-8" })}
      >
        <Instagram aria-hidden="true" /> Suivre {INSTAGRAM_HANDLE}
        <span className="sr-only"> (nouvel onglet)</span>
      </a>
    </section>
  );
}
