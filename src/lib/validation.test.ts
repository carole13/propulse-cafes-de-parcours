import { describe, expect, it } from "vitest";
import { registrationSchema, ACADEMIC_EMAIL_MESSAGE } from "./validation";

const base = {
  eventId: "8b1f7c1e-5d6a-4b9e-9f2a-1c3d4e5f6a7b",
  firstName: "Léa",
  lastName: "Martin",
  email: "lea.martin@etu.univ-paris.fr",
  motivation: "J'aimerais découvrir ce secteur.",
  consent: true as const,
  turnstileToken: "tok",
};

describe("registration rules", () => {
  it("accepts an academic email", () => {
    expect(registrationSchema.safeParse(base).success).toBe(true);
  });

  it.each(["x@gmail.com", "x@hotmail.fr", "x@wanadoo.fr", "X@Yahoo.FR"])(
    "refuses personal domain %s with the student message",
    (email) => {
      const r = registrationSchema.safeParse({ ...base, email });
      expect(r.success).toBe(false);
      if (!r.success) expect(r.error.issues[0]?.message).toBe(ACADEMIC_EMAIL_MESSAGE);
    },
  );

  it("limits motivation to 500 characters", () => {
    expect(registrationSchema.safeParse({ ...base, motivation: "a".repeat(501) }).success).toBe(false);
  });

  it("limits questions to 1000 characters and keeps them optional", () => {
    expect(registrationSchema.safeParse({ ...base, questions: "a".repeat(1001) }).success).toBe(false);
    expect(registrationSchema.safeParse({ ...base, questions: undefined }).success).toBe(true);
  });

  it("requires consent", () => {
    expect(registrationSchema.safeParse({ ...base, consent: false }).success).toBe(false);
  });
});
