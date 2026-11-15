/**
 * Bandeau défilant des valeurs Pro'pulse (décoratif : les valeurs sont aussi écrites
 * juste en dessous, donc il est masqué aux lecteurs d'écran).
 */
const ITEMS = [
  "Sans évaluation",
  "Sans compétition",
  "Toutes les questions sont permises",
  "Comme autour d'un café",
  "Des parcours, pas des CV",
];

export function Marquee() {
  // Deux copies identiques à la suite : en glissant de -50 %, la boucle est invisible.
  const row = [...ITEMS, ...ITEMS];
  return (
    <div aria-hidden="true" className="marquee overflow-hidden bg-brand-yellow py-4 text-brand-blue md:py-5">
      <div className="marquee-track flex w-max items-center">
        {row.map((text, i) => (
          <span key={i} className="flex items-center whitespace-nowrap text-xl font-extrabold md:text-2xl">
            <span className="px-6">{text}</span>
            <span className="text-brand-blue">✱</span>
          </span>
        ))}
      </div>
    </div>
  );
}
