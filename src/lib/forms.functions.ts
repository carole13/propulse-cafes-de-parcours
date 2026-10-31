/**
 * Form submissions. These server functions are the ONLY path that writes
 * registrations and contact messages: tables have no public insert policy.
 * Each call verifies the Cloudflare Turnstile token server-side first.
 */
import { createServerFn } from "@tanstack/react-start";
import { contactSchema, registrationSchema } from "./validation";

type Result = { ok: true } | { ok: false; error: string; code?: "full" | "past" | "duplicate" | "captcha" };

async function verifyTurnstile(token: string): Promise<boolean> {
  const secret = process.env["TURNSTILE_SECRET_KEY"];
  if (!secret) {
    console.error("TURNSTILE_SECRET_KEY is not configured");
    return false;
  }
  const body = new URLSearchParams({ secret, response: token });
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body });
    const json = (await res.json()) as { success?: boolean };
    return json.success === true;
  } catch (e) {
    console.error("Turnstile verify failed", e);
    return false;
  }
}

export const registerToCircle = createServerFn({ method: "POST" })
  .inputValidator((d) => registrationSchema.parse(d))
  .handler(async ({ data }): Promise<Result> => {
    if (!(await verifyTurnstile(data.turnstileToken))) {
      return { ok: false, code: "captcha", error: "La vérification anti-robot a échoué. Merci de réessayer." };
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: event } = await supabaseAdmin
      .from("events")
      .select("id,type,start_at,capacity,published")
      .eq("id", data.eventId)
      .maybeSingle();
    if (!event || !event.published || event.type !== "propulse") {
      return { ok: false, error: "Ce cercle est introuvable." };
    }
    if (new Date(event.start_at).getTime() < Date.now()) {
      return { ok: false, code: "past", error: "Ce cercle a déjà eu lieu." };
    }
    if (event.capacity !== null) {
      const { count } = await supabaseAdmin
        .from("registrations")
        .select("id", { count: "exact", head: true })
        .eq("event_id", event.id);
      if ((count ?? 0) >= event.capacity) {
        return { ok: false, code: "full", error: "Ce cercle est complet. Le prochain sera annoncé sur notre Instagram." };
      }
    }

    const { error } = await supabaseAdmin.from("registrations").insert({
      event_id: event.id,
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      motivation: data.motivation,
      questions: data.questions || null,
      consent: data.consent,
    });
    if (error) {
      if (error.code === "23505") {
        return { ok: false, code: "duplicate", error: "Tu es déjà inscrit·e à ce cercle avec cette adresse email." };
      }
      console.error("registration insert", error);
      return { ok: false, error: "Oups, l'inscription n'a pas pu être enregistrée. Réessaie dans un instant." };
    }
    return { ok: true };
  });

export const sendContactMessage = createServerFn({ method: "POST" })
  .inputValidator((d) => contactSchema.parse(d))
  .handler(async ({ data }): Promise<Result> => {
    if (!(await verifyTurnstile(data.turnstileToken))) {
      return { ok: false, code: "captcha", error: "La vérification anti-robot a échoué. Merci de réessayer." };
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("contact_messages").insert({
      name: data.name,
      email: data.email,
      company_role: data.companyRole,
      message: data.message,
    });
    if (error) {
      console.error("contact insert", error);
      return { ok: false, error: "Oups, le message n'a pas pu être envoyé. Réessayez dans un instant." };
    }
    return { ok: true };
  });
