/**
 * Monthly calendar view of the agenda.
 * - Days with a Pro'pulse circle are fuchsia, days with an external event are mint.
 * - Tapping a day shows its events below the grid; otherwise the whole month is listed.
 * Dates are always computed in Paris time (same as src/lib/format.ts).
 */
import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { EventRow } from "@/lib/content.functions";
import { capitalize } from "@/lib/format";
import { cn } from "@/lib/utils";
import { BrandSymbol } from "./Brand";
import { EventCard } from "./EventCard";

const TZ = "Europe/Paris";
const WEEKDAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

/** "YYYY-MM-DD" of an ISO date, in Paris time. */
function dayKey(iso: string | Date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(typeof iso === "string" ? new Date(iso) : iso);
}
const monthKey = (y: number, m: number) => `${y}-${String(m + 1).padStart(2, "0")}`;
const keyOf = (y: number, m: number, d: number) =>
  `${monthKey(y, m)}-${String(d).padStart(2, "0")}`;

function monthLabel(y: number, m: number) {
  return capitalize(
    new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric", timeZone: "UTC" }).format(
      new Date(Date.UTC(y, m, 1)),
    ),
  );
}
function dayLabel(key: string) {
  const [y, m, d] = key.split("-").map(Number);
  return capitalize(
    new Intl.DateTimeFormat("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      timeZone: "UTC",
    }).format(new Date(Date.UTC(y!, m! - 1, d!))),
  );
}

export function EventCalendar({ events }: { events: EventRow[] }) {
  const todayKey = dayKey(new Date());
  const [ty, tm] = todayKey.split("-").map(Number) as [number, number];

  // Events grouped by Paris day.
  const byDay = useMemo(() => {
    const map = new Map<string, EventRow[]>();
    for (const e of events) {
      const k = dayKey(e.start_at);
      map.set(k, [...(map.get(k) ?? []), e]);
    }
    return map;
  }, [events]);

  // Start on the current month, or on the first month that has an event.
  const [cursor, setCursor] = useState(() => {
    const first = events[0] ? dayKey(events[0].start_at) : todayKey;
    const [fy, fm] = first.split("-").map(Number) as [number, number];
    return { y: fy, m: fm - 1 };
  });
  const [selected, setSelected] = useState<string | null>(null);

  const { y, m } = cursor;
  const firstWeekday = (new Date(Date.UTC(y, m, 1)).getUTCDay() + 6) % 7; // Monday = 0
  const daysInMonth = new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
  const isCurrentMonth = y === ty && m === tm - 1;

  const go = (delta: number) => {
    const d = new Date(Date.UTC(y, m + delta, 1));
    setCursor({ y: d.getUTCFullYear(), m: d.getUTCMonth() });
    setSelected(null);
  };

  const monthEvents = events.filter((e) => dayKey(e.start_at).startsWith(monthKey(y, m)));
  const shown = selected ? (byDay.get(selected) ?? []) : monthEvents;

  return (
    <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,26rem)_1fr]">
      {/* Month grid */}
      <div className="h-fit rounded-2xl bg-brand-white p-4 shadow-[0_0_0_2px_var(--brand-blue)] sm:p-6">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => go(-1)}
            disabled={isCurrentMonth}
            aria-label="Mois précédent"
            className="inline-flex size-11 items-center justify-center rounded-full text-brand-blue hover:bg-brand-mint disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <ChevronLeft className="size-6" />
          </button>
          <h2 className="text-xl md:text-2xl" aria-live="polite">
            {monthLabel(y, m)}
          </h2>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Mois suivant"
            className="inline-flex size-11 items-center justify-center rounded-full text-brand-blue hover:bg-brand-mint"
          >
            <ChevronRight className="size-6" />
          </button>
        </div>

        <div
          className="mt-4 grid grid-cols-7 gap-1 text-center"
          role="grid"
          aria-label={`Calendrier de ${monthLabel(y, m)}`}
        >
          {WEEKDAYS.map((w) => (
            <div
              key={w}
              role="columnheader"
              className="pb-2 text-xs font-bold uppercase text-brand-ink"
            >
              {w}
            </div>
          ))}
          {Array.from({ length: firstWeekday }, (_, i) => (
            <div key={`empty-${i}`} aria-hidden="true" />
          ))}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const d = i + 1;
            const k = keyOf(y, m, d);
            const dayEvents = byDay.get(k) ?? [];
            const hasCircle = dayEvents.some((e) => e.type === "propulse");
            const hasExternal = dayEvents.some((e) => e.type === "externe");
            const isPast = k < todayKey;
            const isToday = k === todayKey;
            const isSelected = k === selected;
            const label = `${dayLabel(k)}${dayEvents.length ? `, ${dayEvents.length} événement${dayEvents.length > 1 ? "s" : ""}` : ""}`;
            return (
              <button
                key={k}
                type="button"
                role="gridcell"
                aria-label={label}
                aria-pressed={isSelected}
                disabled={dayEvents.length === 0}
                onClick={() => setSelected(isSelected ? null : k)}
                className={cn(
                  "relative flex aspect-square items-center justify-center rounded-full text-sm font-semibold transition-colors sm:text-base",
                  dayEvents.length === 0 && (isPast ? "text-brand-ink/40" : "text-brand-ink"),
                  hasCircle &&
                    "bg-brand-fuchsia font-extrabold text-brand-night hover:brightness-95",
                  !hasCircle &&
                    hasExternal &&
                    "bg-brand-mint font-extrabold text-brand-ink hover:brightness-95",
                  isToday && !dayEvents.length && "ring-2 ring-brand-blue/40",
                  isSelected && "ring-4 ring-brand-blue",
                )}
              >
                {d}
                {hasCircle && hasExternal && (
                  <span
                    aria-hidden="true"
                    className="absolute bottom-1 size-1.5 rounded-full bg-brand-blue"
                  />
                )}
              </button>
            );
          })}
        </div>

        <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-brand-ink">
          <li className="flex items-center gap-2">
            <span aria-hidden="true" className="size-3.5 rounded-full bg-brand-fuchsia" /> Cercle
            Pro'pulse
          </li>
          <li className="flex items-center gap-2">
            <span aria-hidden="true" className="size-3.5 rounded-full bg-brand-mint" /> À ne pas
            rater
          </li>
        </ul>
      </div>

      {/* Events of the selected day / month */}
      <div>
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="text-2xl md:text-3xl">
            {selected ? dayLabel(selected) : `En ${monthLabel(y, m).toLowerCase()}`}
          </h2>
          {selected && (
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="text-sm font-bold underline underline-offset-4"
            >
              Voir tout le mois
            </button>
          )}
        </div>

        {shown.length === 0 ? (
          <div className="mt-6 flex flex-col items-start gap-4 rounded-2xl bg-brand-mist p-8">
            <BrandSymbol kind="face" />
            <p className="text-lg font-bold">Rien de prévu ce mois-ci pour l'instant.</p>
            <button
              type="button"
              onClick={() => go(1)}
              className="text-sm font-bold underline underline-offset-4"
            >
              Voir le mois suivant
            </button>
          </div>
        ) : (
          <ol className="mt-6 grid gap-6">
            {shown.map((e) => (
              <li key={e.id}>
                <EventCard event={e} />
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
