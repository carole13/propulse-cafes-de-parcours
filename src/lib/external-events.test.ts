import { mergeEvents, parseExternalEvents } from "./external-events";
import raw from "@/data/evenements-externes.json";

const valid = {
  id: "salon-test-2026",
  title: "Salon test",
  start_at: "2026-11-17T09:00:00+01:00",
  location: "Paris",
  external_url: "https://example.com",
  why: "pour tester",
};

describe("événements de veille", () => {
  it("le fichier de veille est valide en entier", () => {
    expect(Array.isArray(raw)).toBe(true);
    expect(parseExternalEvents(raw)).toHaveLength((raw as unknown[]).length);
  });

  it("convertit une entrée valide en événement externe", () => {
    const [e] = parseExternalEvents([valid]);
    expect(e?.type).toBe("externe");
    expect(e?.id).toBe("veille-salon-test-2026");
  });

  it("ignore une entrée mal formée sans casser les autres", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const rows = parseExternalEvents([valid, { ...valid, id: "Mauvais ID", external_url: "pas-un-lien" }]);
    expect(rows).toHaveLength(1);
    spy.mockRestore();
  });

  it("fusionne sans doublon et trie par date", () => {
    const [ext] = parseExternalEvents([valid]);
    const db = { ...ext!, id: "uuid", start_at: "2026-11-17T10:00:00+01:00" };
    const early = { ...ext!, id: "x", title: "Avant", start_at: "2026-11-01T10:00:00+01:00" };
    const merged = mergeEvents([db], [ext!, early]);
    expect(merged.map((e) => e.title)).toEqual(["Avant", "Salon test"]);
  });
});
