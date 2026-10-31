/** Circle registration form: client validation (shared zod schema) + Turnstile + server function. */
import { useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQueryClient } from "@tanstack/react-query";
import { registrationSchema } from "@/lib/validation";
import { registerToCircle } from "@/lib/forms.functions";
import { Button } from "@/components/ui/button";
import { TextAreaField, TextField } from "./FormField";
import { Turnstile } from "./Turnstile";
import { BrandSymbol } from "./Brand";

type Errors = Partial<Record<string, string>>;

export function RegistrationForm({ eventId, onFull }: { eventId: string; onFull?: () => void }) {
  const submit = useServerFn(registerToCircle);
  const qc = useQueryClient();
  const [values, setValues] = useState({ firstName: "", lastName: "", email: "", motivation: "", questions: "", consent: false });
  const [token, setToken] = useState<string | null>(null);
  const [widgetKey, setWidgetKey] = useState(0);
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);

  const set = <K extends keyof typeof values>(k: K, v: (typeof values)[K]) => setValues((s) => ({ ...s, [k]: v }));

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError(null);
    const parsed = registrationSchema.safeParse({ ...values, eventId, turnstileToken: token ?? "" });
    if (!parsed.success) {
      const errs: Errors = {};
      for (const issue of parsed.error.issues) errs[String(issue.path[0])] ??= issue.message;
      setErrors(errs);
      if (errs.turnstileToken) setFormError(errs.turnstileToken);
      return;
    }
    setErrors({});
    setPending(true);
    try {
      const res = await submit({ data: parsed.data });
      if (res.ok) {
        setDone(true);
        qc.invalidateQueries({ queryKey: ["events"] });
      } else {
        setFormError(res.error);
        if (res.code === "full") onFull?.();
        setToken(null);
        setWidgetKey((k) => k + 1); // tokens are single-use: re-render the widget
      }
    } catch {
      setFormError("Oups, quelque chose n'a pas marché. Vérifie tes informations et réessaie.");
      setToken(null);
      setWidgetKey((k) => k + 1);
    } finally {
      setPending(false);
    }
  }

  if (done) {
    return (
      <div role="status" className="flex flex-col items-start gap-4 rounded-2xl bg-brand-mint p-8">
        <BrandSymbol kind="face" />
        <h3 className="text-2xl">C'est noté !</h3>
        <p className="text-lg">On a hâte de te rencontrer. On t'envoie les détails pratiques avant le cercle.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5" aria-describedby={formError ? "form-error" : undefined}>
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField id="firstName" label="Prénom" autoComplete="given-name" required value={values.firstName} onChange={(e) => set("firstName", e.target.value)} error={errors.firstName} maxLength={80} />
        <TextField id="lastName" label="Nom" autoComplete="family-name" required value={values.lastName} onChange={(e) => set("lastName", e.target.value)} error={errors.lastName} maxLength={80} />
      </div>
      <TextField
        id="email"
        type="email"
        label="Email académique"
        autoComplete="email"
        inputMode="email"
        required
        placeholder="prenom.nom@ecole.fr"
        hint="Ton adresse fournie par ton école ou ton université."
        value={values.email}
        onChange={(e) => set("email", e.target.value)}
        error={errors.email}
        maxLength={255}
      />
      <TextAreaField id="motivation" label="Pourquoi ce cercle t'intéresse ?" required maxLength={500} value={values.motivation} onChange={(e) => set("motivation", e.target.value)} error={errors.motivation} />
      <TextAreaField id="questions" label="Quelles questions aimerais-tu poser à l'intervenant·e ?" optional maxLength={1000} value={values.questions} onChange={(e) => set("questions", e.target.value)} error={errors.questions} />

      <div className="space-y-1.5">
        <label htmlFor="consent" className="flex cursor-pointer items-start gap-3 text-sm">
          <input
            id="consent"
            type="checkbox"
            required
            checked={values.consent}
            onChange={(e) => set("consent", e.target.checked)}
            aria-invalid={!!errors.consent}
            aria-describedby={errors.consent ? "consent-error" : undefined}
            className="mt-0.5 size-5 shrink-0 accent-brand-blue"
          />
          <span>
            J'accepte que mes données soient utilisées par Pro'pulse uniquement pour l'organisation de ce cercle.{" "}
            <Link to="/confidentialite" className="font-bold underline underline-offset-2">Politique de confidentialité</Link>
          </span>
        </label>
        {errors.consent && <p id="consent-error" className="text-sm font-semibold text-destructive">{errors.consent}</p>}
      </div>

      <Turnstile key={widgetKey} onToken={setToken} />

      {formError && (
        <p id="form-error" role="alert" className="rounded-2xl bg-brand-mist p-4 text-sm font-semibold text-destructive">
          {formError}
        </p>
      )}

      <Button type="submit" size="lg" disabled={pending} className="w-full sm:w-auto">
        {pending ? "Envoi…" : "Je m'inscris"}
      </Button>
    </form>
  );
}
