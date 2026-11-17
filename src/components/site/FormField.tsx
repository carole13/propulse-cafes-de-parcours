/** Accessible labelled field (input or textarea) with error + optional counter. */
import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { defineCopy, useCopy } from "@/lib/i18n";

const COPY = defineCopy({ fr: { optional: "(facultatif)" }, en: { optional: "(optional)" } });

const fieldClass =
  "w-full rounded-lg border border-input bg-brand-white px-4 py-3 text-base text-brand-blue placeholder:text-brand-ink/60 transition-shadow focus:border-brand-blue focus:outline-none focus:ring-4 focus:ring-brand-blue/15";

type Common = { id: string; label: string; error?: string | undefined; optional?: boolean; hint?: string };

export function TextField({ id, label, error, optional, hint, className, ...rest }: Common & InputHTMLAttributes<HTMLInputElement>) {
  const t = useCopy(COPY);
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-semibold">
        {label} {optional && <span className="font-normal text-brand-ink">{t.optional}</span>}
      </label>
      <input
        id={id}
        name={id}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={cn(fieldClass, error && "border-destructive", className)}
        {...rest}
      />
      {hint && !error && <p id={`${id}-hint`} className="text-xs text-brand-ink">{hint}</p>}
      {error && <p id={`${id}-error`} className="text-sm font-semibold text-destructive">{error}</p>}
    </div>
  );
}

export function TextAreaField({
  id,
  label,
  error,
  optional,
  maxLength,
  value,
  className,
  ...rest
}: Common & TextareaHTMLAttributes<HTMLTextAreaElement> & { value: string }) {
  const t = useCopy(COPY);
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-semibold">
        {label} {optional && <span className="font-normal text-brand-ink">{t.optional}</span>}
      </label>
      <textarea
        id={id}
        name={id}
        rows={4}
        value={value}
        maxLength={maxLength}
        aria-invalid={!!error}
        aria-describedby={`${id}-count${error ? ` ${id}-error` : ""}`}
        className={cn(fieldClass, "resize-y", error && "border-destructive", className)}
        {...rest}
      />
      <div className="flex justify-between gap-4">
        {error ? <p id={`${id}-error`} className="text-sm font-semibold text-destructive">{error}</p> : <span />}
        {maxLength && (
          <p id={`${id}-count`} className="text-xs text-brand-ink" aria-live="polite">
            {value.length}/{maxLength}
          </p>
        )}
      </div>
    </div>
  );
}
