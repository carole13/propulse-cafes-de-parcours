/** Formulaire d'inscription à un cercle : validation (schéma partagé) + Turnstile + fonction serveur. */
import { useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQueryClient } from "@tanstack/react-query";
import { CheckCircle2 } from "lucide-react";
import { makeRegistrationSchema } from "@/lib/validation";
import { registerToCircle, type FormErrorCode } from "@/lib/forms.functions";
import { defineCopy, useCopy, useLang } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { TextAreaField, TextField } from "./FormField";
import { Turnstile } from "./Turnstile";

const COPY = defineCopy({
  fr: {
    firstName: "Prénom",
    lastName: "Nom",
    email: "Email académique",
    emailPlaceholder: "prenom.nom@ecole.fr",
    emailHint: "Ton adresse fournie par ton école ou ton université.",
    motivation: "Pourquoi ce cercle t'intéresse ?",
    questions: "Quelles questions aimerais-tu poser à l'intervenant·e ?",
    consent:
      "J'accepte que mes données soient utilisées par Pro'pulse uniquement pour l'organisation de ce cercle.",
    privacy: "Politique de confidentialité",
    sending: "Envoi…",
    submit: "Je m'inscris",
    doneTitle: "C'est noté !",
    doneText: "On a hâte de te rencontrer. On t'envoie les détails pratiques avant le cercle.",
    errors: {
      captcha: "La vérification anti-robot a échoué. Merci de réessayer.",
      past: "Ce cercle a déjà eu lieu.",
      full: "Ce cercle est complet. Le prochain sera annoncé sur notre Instagram.",
      duplicate: "Tu es déjà inscrit·e à ce cercle avec cette adresse email.",
      notfound: "Ce cercle est introuvable.",
      error: "Oups, l'inscription n'a pas pu être enregistrée. Réessaie dans un instant.",
    } satisfies Record<FormErrorCode, string>,
    network: "Oups, quelque chose n'a pas marché. Vérifie tes informations et réessaie.",
  },
  en: {
    firstName: "First name",
    lastName: "Last name",
    email: "Student email",
    emailPlaceholder: "firstname.lastname@school.edu",
    emailHint: "The address provided by your school or university.",
    motivation: "Why does this circle interest you?",
    questions: "What would you like to ask the speaker?",
    consent: "I agree that Pro'pulse may use my data only to organise this circle.",
    privacy: "Privacy policy",
    sending: "Sending…",
    submit: "Register",
    doneTitle: "You're in!",
    doneText: "We can't wait to meet you. We'll send you the practical details before the circle.",
    errors: {
      captcha: "The anti-bot check failed. Please try again.",
      past: "This circle has already taken place.",
      full: "This circle is full. The next one will be announced on our Instagram.",
      duplicate: "You're already registered for this circle with this email address.",
      notfound: "This circle could not be found.",
      error: "Sorry, your registration couldn't be saved. Please try again in a moment.",
    },
    network: "Sorry, something went wrong. Check your details and try again.",
  },
});

type Errors = Partial<Record<string, string>>;

export function RegistrationForm({ eventId, onFull }: { eventId: string; onFull?: () => void }) {
  const lang = useLang();
  const t = useCopy(COPY);
  const submit = useServerFn(registerToCircle);
  const qc = useQueryClient();
  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    motivation: "",
    questions: "",
    consent: false,
  });
  const [token, setToken] = useState<string | null>(null);
  const [widgetKey, setWidgetKey] = useState(0);
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);

  const set = <K extends keyof typeof values>(k: K, v: (typeof values)[K]) =>
    setValues((s) => ({ ...s, [k]: v }));

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError(null);
    const parsed = makeRegistrationSchema(lang).safeParse({
      ...values,
      eventId,
      turnstileToken: token ?? "",
    });
    if (!parsed.success) {
      const errs: Errors = {};
      for (const issue of parsed.error.issues) errs[String(issue.path[0])] ??= issue.message;
      setErrors(errs);
      if (errs["turnstileToken"]) setFormError(errs["turnstileToken"]);
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
        setFormError(t.errors[res.code]);
        if (res.code === "full") onFull?.();
        setToken(null);
        setWidgetKey((k) => k + 1); // un jeton ne sert qu'une fois : on réaffiche le widget
      }
    } catch {
      setFormError(t.network);
      setToken(null);
      setWidgetKey((k) => k + 1);
    } finally {
      setPending(false);
    }
  }

  if (done) {
    return (
      <div
        role="status"
        className="flex flex-col items-start gap-3 rounded-2xl bg-brand-white p-8 ring-1 ring-border"
      >
        <CheckCircle2 className="size-8 text-brand-blue" aria-hidden="true" />
        <h3 className="text-2xl">{t.doneTitle}</h3>
        <p className="text-lg text-brand-ink">{t.doneText}</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="space-y-5"
      aria-describedby={formError ? "form-error" : undefined}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          id="firstName"
          label={t.firstName}
          autoComplete="given-name"
          required
          value={values.firstName}
          onChange={(e) => set("firstName", e.target.value)}
          error={errors["firstName"]}
          maxLength={80}
        />
        <TextField
          id="lastName"
          label={t.lastName}
          autoComplete="family-name"
          required
          value={values.lastName}
          onChange={(e) => set("lastName", e.target.value)}
          error={errors["lastName"]}
          maxLength={80}
        />
      </div>
      <TextField
        id="email"
        type="email"
        label={t.email}
        autoComplete="email"
        inputMode="email"
        required
        placeholder={t.emailPlaceholder}
        hint={t.emailHint}
        value={values.email}
        onChange={(e) => set("email", e.target.value)}
        error={errors["email"]}
        maxLength={255}
      />
      <TextAreaField
        id="motivation"
        label={t.motivation}
        required
        maxLength={500}
        value={values.motivation}
        onChange={(e) => set("motivation", e.target.value)}
        error={errors["motivation"]}
      />
      <TextAreaField
        id="questions"
        label={t.questions}
        optional
        maxLength={1000}
        value={values.questions}
        onChange={(e) => set("questions", e.target.value)}
        error={errors["questions"]}
      />

      <div className="space-y-1.5">
        <label htmlFor="consent" className="flex cursor-pointer items-start gap-3 text-sm">
          <input
            id="consent"
            type="checkbox"
            required
            checked={values.consent}
            onChange={(e) => set("consent", e.target.checked)}
            aria-invalid={!!errors["consent"]}
            aria-describedby={errors["consent"] ? "consent-error" : undefined}
            className="mt-0.5 size-5 shrink-0 accent-brand-blue"
          />
          <span>
            {t.consent}{" "}
            <Link to="/confidentialite" className="font-bold underline underline-offset-2">
              {t.privacy}
            </Link>
          </span>
        </label>
        {errors["consent"] && (
          <p id="consent-error" className="text-sm font-semibold text-destructive">
            {errors["consent"]}
          </p>
        )}
      </div>

      <Turnstile key={widgetKey} onToken={setToken} />

      {formError && (
        <p
          id="form-error"
          role="alert"
          className="rounded-lg bg-brand-white p-4 text-sm font-semibold text-destructive ring-1 ring-destructive/30"
        >
          {formError}
        </p>
      )}

      <Button type="submit" size="lg" disabled={pending} className="w-full sm:w-auto">
        {pending ? t.sending : t.submit}
      </Button>
    </form>
  );
}
