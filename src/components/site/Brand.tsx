/** Brand primitives: logo, serif emphasis, decorative symbols, badges. */
import type { ReactNode } from "react";
import logoYellow from "@/assets/logo-yellow.png.asset.json";
import logoBlue from "@/assets/logo-blue.png.asset.json";
import { cn } from "@/lib/utils";

export function Logo({ variant = "yellow", className }: { variant?: "yellow" | "blue"; className?: string }) {
  const src = variant === "yellow" ? logoYellow.url : logoBlue.url;
  return <img src={src} alt="Pro'pulse" width={955} height={769} className={cn("h-10 w-auto", className)} />;
}

/** Italic Noto Serif word inside a title. */
export function Emph({ children, className }: { children: ReactNode; className?: string }) {
  return <em className={cn("emph", className)}>{children}</em>;
}

type SymbolKind = "star" | "face" | "hash" | "tilde";
/** Decorative brand symbols: ✱ (blue), ^^ (yellow face), # (mint), ~ (fuchsia). */
export function BrandSymbol({ kind, className }: { kind: SymbolKind; className?: string }) {
  if (kind === "face") {
    return (
      <span
        aria-hidden="true"
        className={cn(
          "inline-flex size-14 flex-col items-center justify-center rounded-full bg-brand-yellow font-extrabold leading-none text-brand-blue",
          className,
        )}
      >
        <span className="text-lg tracking-widest">^^</span>
        <span className="-mt-1 block h-1 w-4 rounded-full bg-brand-blue" />
      </span>
    );
  }
  const map = {
    star: { char: "✱", color: "text-brand-blue" },
    hash: { char: "#", color: "text-brand-mint" },
    tilde: { char: "~", color: "text-brand-fuchsia" },
  } as const;
  const s = map[kind];
  return (
    <span aria-hidden="true" className={cn("inline-block font-extrabold leading-none select-none", s.color, className)}>
      {s.char}
    </span>
  );
}

/** Fuchsia pill badge (labels like "Prochain cercle"). Blue text keeps AA contrast. */
export function Badge({ children, tone = "fuchsia", className }: { children: ReactNode; tone?: "fuchsia" | "mint" | "yellow" | "blue"; className?: string }) {
  const tones = {
    fuchsia: "bg-brand-fuchsia text-brand-blue",
    mint: "bg-brand-mint text-brand-blue",
    yellow: "bg-brand-yellow text-brand-blue",
    blue: "bg-brand-blue text-brand-white",
  };
  return (
    <span className={cn("inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide", tones[tone], className)}>
      {children}
    </span>
  );
}
