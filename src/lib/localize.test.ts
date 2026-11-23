import { localizeEvent } from "./localize";
import { makeRegistrationSchema, ACADEMIC_EMAIL_MESSAGE_EN } from "./validation";
import { findFileCircle } from "./circles-file";
import raw from "@/data/evenements-externes.json";
import { parseExternalEvents } from "./external-events";

describe("version anglaise", () => {
  it("affiche la traduction du cercle en anglais, le français sinon", () => {
    const c = findFileCircle("cercle-conseil-isotta-marcelli-2026-11")!;
    expect(localizeEvent(c, "en").title).toBe("Consulting, from the inside");
    expect(localizeEvent(c, "fr").title).toBe("Le conseil, vu de l'intérieur");
  });

  it("garde le texte français quand une traduction manque", () => {
    const [e] = parseExternalEvents([
      {
        id: "x",
        title: "Titre",
        start_at: "2027-01-01T10:00:00+01:00",
        external_url: "https://example.com",
        en: { description: "Desc" },
      },
    ]);
    expect(localizeEvent(e!, "en")).toMatchObject({ title: "Titre", description: "Desc" });
  });

  it("tous les événements de la veille ont un titre anglais", () => {
    for (const e of parseExternalEvents(raw)) expect(e.en?.title, e.id).toBeTruthy();
  });

  it("affiche les erreurs de formulaire en anglais", () => {
    const r = makeRegistrationSchema("en").safeParse({
      eventId: "8b1f7c1e-5d6a-4b9e-9f2a-1c3d4e5f6a7b",
      firstName: "Ana",
      lastName: "B",
      email: "ana@gmail.com",
      motivation: "x",
      consent: true,
      turnstileToken: "t",
    });
    expect(r.success).toBe(false);
    if (!r.success) expect(r.error.issues[0]?.message).toBe(ACADEMIC_EMAIL_MESSAGE_EN);
  });
});
