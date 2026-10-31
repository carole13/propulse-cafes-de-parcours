/** Contact form for professionals, protected by Turnstile + server function. */
import { useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { contactSchema } from "@/lib/validation";
import { sendContactMessage } from "@/lib/forms.functions";
import { Button } from "@/components/ui/button";
import { TextAreaField, TextField } from "./FormField";
import { Turnstile } from "./Turnstile";
import { BrandSymbol } from "./Brand";

export function ContactForm() {
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
    const parsed = contactSchema.safeParse({ ...v, turnstileToken: token ?? "" });
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const i of parsed.error.issues) errs[String(i.path[0])] ??= i.message;
      setErrors(errs);
      if (errs.turnstileToken) setFormError(errs.turnstileToken);
      return;
    }
    setErrors({});
    setPending(true);
    try {
      const res = await submit({ data: parsed.data });
      if (res.ok) setDone(true);
      else {
        setFormError(res.error);
        setToken(null);
        setWidgetKey((k) => k + 1);
      }
    } catch {
      setFormError("Oups, quelque chose n'a pas marché. Réessayez dans un instant.");
      setToken(null);
      setWidgetKey((k) => k + 1);
    } finally {
      setPending(false);
    }
  }

  if (done) {
    return (
      <div role="status" className="flex flex-col items-start gap-4 rounded-2xl bg-brand-white p-8">
        <BrandSymbol kind="face" />
        <h3 className="text-2xl">Merci pour votre message !</h3>
        <p>On revient vers vous très vite pour imaginer un cercle ensemble.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5 rounded-2xl bg-brand-white p-6 md:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField id="name" label="Nom" autoComplete="name" required value={v.name} onChange={(e) => setV({ ...v, name: e.target.value })} error={errors.name} maxLength={120} />
        <TextField id="contact-email" type="email" label="Email" autoComplete="email" required value={v.email} onChange={(e) => setV({ ...v, email: e.target.value })} error={errors.email} maxLength={255} />
      </div>
      <TextField id="companyRole" label="Entreprise / poste" autoComplete="organization-title" required value={v.companyRole} onChange={(e) => setV({ ...v, companyRole: e.target.value })} error={errors.companyRole} maxLength={160} />
      <TextAreaField id="message" label="Message" required maxLength={2000} rows={5} value={v.message} onChange={(e) => setV({ ...v, message: e.target.value })} error={errors.message} />
      <Turnstile key={widgetKey} onToken={setToken} />
      {formError && <p role="alert" className="rounded-2xl bg-brand-mist p-4 text-sm font-semibold text-destructive">{formError}</p>}
      <Button type="submit" size="lg" disabled={pending} className="w-full sm:w-auto">
        {pending ? "Envoi…" : "Envoyer"}
      </Button>
    </form>
  );
}
