/** Formulaire de contact pour les professionnels, protégé par Turnstile + fonction serveur. */
import { useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { CheckCircle2 } from "lucide-react";
import { makeContactSchema } from "@/lib/validation";
import { sendContactMessage, type FormErrorCode } from "@/lib/forms.functions";
import { defineCopy, useCopy, useLang } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { TextAreaField, TextField } from "./FormField";
import { Turnstile } from "./Turnstile";

const COPY = defineCopy({
  fr: {
    name: "Nom",
    email: "Email",
    companyRole: "Entreprise / poste",
    message: "Message",
    sending: "Envoi…",
    submit: "Envoyer",
    doneTitle: "Merci pour votre message !",
    doneText: "On revient vers vous très vite pour imaginer un cercle ensemble.",
    errors: {
      captcha: "La vérification anti-robot a échoué. Merci de réessayer.",
      error: "Oups, le message n'a pas pu être envoyé. Réessayez dans un instant.",
      past: "",
      full: "",
      duplicate: "",
      notfound: "",
    } satisfies Record<FormErrorCode, string>,
    network: "Oups, quelque chose n'a pas marché. Réessayez dans un instant.",
  },
  en: {
    name: "Name",
    email: "Email",
    companyRole: "Company / position",
    message: "Message",
    sending: "Sending…",
    submit: "Send",
    doneTitle: "Thank you for your message!",
    doneText: "We'll get back to you shortly to plan a circle together.",
    errors: {
      captcha: "The anti-bot check failed. Please try again.",
      error: "Sorry, your message couldn't be sent. Please try again in a moment.",
      past: "",
      full: "",
      duplicate: "",
      notfound: "",
    },
    network: "Sorry, something went wrong. Please try again in a moment.",
  },
});

export function ContactForm() {
  const lang = useLang();
  const t = useCopy(COPY);
  const submit = useServerFn(sendContactMessage);
  const [v, setV] = useState({ name: "", email: "", companyRole: "", message: "" });
  const [token, setToken] = useState<string | null>(null);
  const [widgetKey, setWidgetKey] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError(null);
    const parsed = makeContactSchema(lang).safeParse({ ...v, turnstileToken: token ?? "" });
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const i of parsed.error.issues) errs[String(i.path[0])] ??= i.message;
      setErrors(errs);
      if (errs["turnstileToken"]) setFormError(errs["turnstileToken"]);
      return;
    }
    setErrors({});
    setPending(true);
    try {
      const res = await submit({ data: parsed.data });
      if (res.ok) setDone(true);
      else {
        setFormError(t.errors[res.code] || t.errors.error);
        setToken(null);
        setWidgetKey((k) => k + 1);
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
        <p className="text-brand-ink">{t.doneText}</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="space-y-5 rounded-2xl bg-brand-white p-6 ring-1 ring-border md:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          id="name"
          label={t.name}
          autoComplete="name"
          required
          value={v.name}
          onChange={(e) => setV({ ...v, name: e.target.value })}
          error={errors["name"]}
          maxLength={120}
        />
        <TextField
          id="contact-email"
          type="email"
          label={t.email}
          autoComplete="email"
          required
          value={v.email}
          onChange={(e) => setV({ ...v, email: e.target.value })}
          error={errors["email"]}
          maxLength={255}
        />
      </div>
      <TextField
        id="companyRole"
        label={t.companyRole}
        autoComplete="organization-title"
        required
        value={v.companyRole}
        onChange={(e) => setV({ ...v, companyRole: e.target.value })}
        error={errors["companyRole"]}
        maxLength={160}
      />
      <TextAreaField
        id="message"
        label={t.message}
        required
        maxLength={2000}
        rows={5}
        value={v.message}
        onChange={(e) => setV({ ...v, message: e.target.value })}
        error={errors["message"]}
      />
      <Turnstile key={widgetKey} onToken={setToken} />
      {formError && (
        <p
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
