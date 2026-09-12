import { intents, universes, type Intent, type Universe } from '@/config/intents';

/**
 * Reconnaissance de l'intention à partir de la phrase du visiteur.
 *
 * Fonction pure, sans dépendance à React : elle peut être appelée côté serveur
 * comme côté navigateur, et testée isolément.
 *
 * Principe : on compare la phrase, débarrassée de ses accents et de sa
 * ponctuation, aux expressions déclarées dans src/config/intents.ts. Chaque
 * expression reconnue rapporte un score proportionnel à sa longueur, de sorte
 * qu'une expression précise l'emporte toujours sur un mot isolé.
 * « résilier mon assurance » bat donc « résilier ».
 */

/** Minuscules, sans accents ni ponctuation, espaces normalisés. */
export function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    // Les apostrophes typographiques et droites deviennent des espaces :
    // « j'ai besoin d'un site » se compare comme « j ai besoin d un site ».
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

/** Vrai si l'expression apparaît dans la phrase, sur des mots entiers. */
function contains(haystack: string, needle: string): boolean {
  if (!needle) return false;
  const padded = ` ${haystack} `;
  return padded.includes(` ${needle} `);
}

export type MatchResult = {
  intent: Intent;
  universe: Universe;
  score: number;
};

/** En dessous de ce score, on considère qu'aucune intention n'est reconnue. */
const MIN_SCORE = 4;

export function matchIntent(query: string): MatchResult | null {
  const phrase = normalize(query);
  if (phrase.length < 2) return null;

  let best: { intent: Intent; score: number } | null = null;

  for (const intent of intents) {
    let score = 0;

    for (const raw of intent.motsCles) {
      const keyword = normalize(raw);
      if (!contains(phrase, keyword)) continue;

      // Le score est la longueur de l'expression hors espaces : plus elle est
      // précise, plus elle pèse. Une expression de plusieurs mots reçoit en
      // plus un petit bonus, pour départager les cas ambigus.
      const words = keyword.split(' ').length;
      score += keyword.replace(/ /g, '').length + (words - 1) * 3;
    }

    if (score > 0 && (!best || score > best.score)) {
      best = { intent, score };
    }
  }

  if (!best || best.score < MIN_SCORE) return null;

  const universe = universes.find((u) => u.id === best!.intent.universe);
  if (!universe) return null;

  return { intent: best.intent, universe, score: best.score };
}

/**
 * Adresse du formulaire de contact, avec le sujet pré-sélectionné et la phrase
 * du visiteur reportée dans le message : il n'a pas à réécrire ce qu'il vient
 * de taper.
 */
export function contactHref(query: string, sujet = 'autre'): string {
  const params = new URLSearchParams({ sujet });
  const besoin = query.trim();
  if (besoin) params.set('besoin', besoin);
  return `/contact?${params.toString()}`;
}
