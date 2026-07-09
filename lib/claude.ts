/**
 * Point d'accès unique aux répliques de LOG (l'IA tutrice).
 *
 * Règle d'architecture : aucun écran n'appelle l'IA en direct — tout passe
 * par ce module. En MVP, les réponses sont générées localement à partir d'une
 * petite base de connaissances par concept (utile et variée, sans réseau).
 *
 * V1 : `askLog` appellera le backend (`POST /api/log/ask`), qui relaiera la
 * requête à l'API Claude côté serveur — la clé ANTHROPIC_API_KEY ne doit
 * JAMAIS être embarquée dans l'app mobile. Seul le corps de cette fonction
 * changera ; les écrans resteront inchangés.
 */

export interface AskLogParams {
  concept: string;
  question: string;
}

/** Indicateur : l'IA temps réel est-elle branchée ? (false en MVP) */
export const LOG_AI_ENABLED = false;

interface KnowledgeEntry {
  keywords: string[];
  answer: string;
}

/** Base de connaissances locale : mots-clés → explication de LOG. */
const KNOWLEDGE: KnowledgeEntry[] = [
  {
    keywords: ['variable', 'données', 'valeur', 'stocker', 'mémoire'],
    answer:
      'Une variable, c’est une boîte étiquetée : un nom auquel on associe une valeur. On peut lire son contenu ou le remplacer plus tard. Pense à `score = 0`, puis `score = 10`.',
  },
  {
    keywords: ['condition', 'si', 'else', 'sinon', 'if', 'vrai', 'faux', 'booléen'],
    answer:
      'Une condition teste si quelque chose est vrai. `si (age >= 18) { ... } sinon { ... }` : seule la branche qui correspond s’exécute. La machine choisit un chemin, jamais les deux.',
  },
  {
    keywords: ['boucle', 'for', 'while', 'répéter', 'itération', 'tour'],
    answer:
      'Une boucle répète un bloc plusieurs fois. `for i de 1 à 3` fait 3 tours. Vérifie toujours qu’il existe une condition d’arrêt, sinon la boucle tourne à l’infini.',
  },
  {
    keywords: ['fonction', 'paramètre', 'return', 'retour', 'appeler'],
    answer:
      'Une fonction est un bloc réutilisable qu’on appelle par son nom. Elle reçoit des paramètres (entrées) et peut retourner un résultat. Écris-la une fois, réutilise-la partout.',
  },
  {
    keywords: ['liste', 'tableau', 'index', 'élément', 'array'],
    answer:
      'Une liste range plusieurs valeurs dans l’ordre, repérées par un index qui commence souvent à 0. `fruits[0]` est le premier élément. On la parcourt en général avec une boucle.',
  },
  {
    keywords: ['tri', 'trier', 'ordre', 'ordonner'],
    answer:
      'Trier, c’est réorganiser une collection selon un ordre (croissant, alphabétique…). On compare des paires d’éléments et on les échange jusqu’à ce que tout soit rangé.',
  },
  {
    keywords: ['récursiv', 'récursion', 'appelle elle', 'cas de base'],
    answer:
      'La récursivité, c’est une fonction qui s’appelle elle-même sur un problème plus petit, jusqu’à un cas de base qui arrête tout. Sans cas de base, elle ne s’arrête jamais.',
  },
];

const OPENERS = [
  'Bonne question.',
  'Voyons ça ensemble.',
  'Je te suis.',
  'Regarde bien.',
];

function findAnswer(haystack: string): string | null {
  const lower = haystack.toLowerCase();
  for (const entry of KNOWLEDGE) {
    if (entry.keywords.some((k) => lower.includes(k))) {
      return entry.answer;
    }
  }
  return null;
}

/**
 * Retourne une réponse de LOG, tirée de la base locale selon le concept et la
 * question. Toujours asynchrone : quand l'IA réelle sera branchée (V1), les
 * appelants n'auront rien à changer.
 */
export async function askLog({ concept, question }: AskLogParams): Promise<string> {
  const trimmed = question.trim();

  if (trimmed.length === 0) {
    return `Pose-moi ta question sur ${concept}, je t'expliquerai simplement.`;
  }

  // On cherche d'abord dans la question, puis dans le concept du niveau.
  const found = findAnswer(trimmed) ?? findAnswer(concept);
  const opener = OPENERS[trimmed.length % OPENERS.length];

  if (found) {
    return `${opener} ${found}`;
  }

  return (
    `${opener} Sur « ${concept} », le mieux est de relire l'explication du ` +
    `niveau et de repérer le mot-clé exact de ta question. Reformule avec un ` +
    `terme précis (variable, condition, boucle, fonction, liste…) et je serai ` +
    `plus utile.`
  );
}
