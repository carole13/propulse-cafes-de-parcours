import {
  findFileCircle,
  isFileCircleId,
  parseFileCircles,
  upcomingFileCircles,
} from "./circles-file";
import raw from "@/data/cercles.json";

const valid = {
  id: "test-cercle",
  title: "Cercle test",
  start_at: "2026-11-24T18:30:00+01:00",
  location: "Paris",
  speaker: { name: "Camille Test", role: "Cheffe de projet", photo: "/intervenants/test.jpg" },
};

describe("cercles du fichier", () => {
  it("le fichier des cercles est valide en entier", () => {
    expect(Array.isArray(raw)).toBe(true);
    expect(parseFileCircles(raw)).toHaveLength((raw as unknown[]).length);
  });

  it("transforme un cercle en événement Pro'pulse sur demande", () => {
    const [c] = parseFileCircles([valid]);
    expect(c).toMatchObject({
      id: "cercle-test-cercle",
      type: "propulse",
      speaker_name: "Camille Test",
      speaker_photo_url: "/intervenants/test.jpg",
      registration: "message",
    });
  });

  it("ignore une entrée mal formée", () => {
    expect(parseFileCircles([{ ...valid, id: "Avec Espaces" }, valid])).toHaveLength(1);
  });

  it("reconnaît les identifiants de page et retrouve le cercle", () => {
    expect(isFileCircleId("cercle-conseil-isotta-marcelli-2026-11")).toBe(true);
    expect(isFileCircleId("2b7c3f0e-0000-4000-8000-000000000000")).toBe(false);
    expect(findFileCircle("cercle-conseil-isotta-marcelli-2026-11")?.speaker_name).toBe(
      "Isotta Marcelli",
    );
  });

  it("ne garde que les cercles à venir", () => {
    expect(upcomingFileCircles(new Date("2030-01-01")).length).toBe(0);
  });
});
