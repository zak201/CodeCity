import Constants from 'expo-constants';

/**
 * Point d'accès unique aux répliques de LOG (l'IA tutrice).
 *
 * Règle d'architecture : aucun écran n'appelle l'IA en direct — tout passe
 * par ce module.
 *
 * `askLog` interroge d'abord le backend (`POST /api/log/ask`), qui relaie vers
 * l'API Claude côté serveur — la clé ANTHROPIC_API_KEY n'est JAMAIS embarquée
 * dans l'app. En cas d'échec (hors-ligne, serveur absent, IA non configurée,
 * timeout), on retombe silencieusement sur une base de connaissances locale :
 * l'app reste utile sans réseau (offline-first).
 */

/** URL du backend, configurable via app.json → expo.extra.apiUrl. */
const BASE_URL = (
  (Constants.expoConfig?.extra?.apiUrl as string | undefined) ??
  'http://localhost:3050/api'
).replace(/\/+$/, '');

/** Timeout d'appel à l'IA temps réel (les modèles rapides répondent < 8 s). */
const REQUEST_TIMEOUT_MS = 8000;

/**
 * Contexte de jeu envoyé à LOG pour ancrer sa réponse dans l'univers CodeCity.
 * On n'y met jamais la solution du niveau (LOG ne doit pas la divulguer).
 */
export interface LogContext {
  districtName?: string;
  districtStory?: string;
  chapterTitle?: string;
  levelTitle?: string;
  levelQuestion?: string;
}

export interface AskLogParams {
  concept: string;
  question: string;
  context?: LogContext;
}

/** L'IA temps réel (Claude via backend) est-elle tentée avant la base locale ? */
export const LOG_AI_ENABLED = true;

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
 * Interroge l'IA temps réel via le backend. Renvoie `null` en cas d'échec
 * (réseau indisponible, serveur absent, IA non configurée, timeout) pour
 * laisser l'appelant retomber sur la base locale — aucune exception remontée.
 */
async function askLogRemote(
  concept: string,
  question: string,
  context?: LogContext
): Promise<string | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const res = await fetch(`${BASE_URL}/log/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ concept, question, context }),
      signal: controller.signal,
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { answer?: unknown };
    return typeof data.answer === 'string' && data.answer.trim().length > 0
      ? data.answer.trim()
      : null;
  } catch {
    // Réseau/serveur indisponible : on n'interrompt jamais le jeu.
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/** Réponse déterministe issue de la base de connaissances locale (repli). */
function localAnswer(concept: string, question: string): string {
  // On cherche d'abord dans la question, puis dans le concept du niveau.
  const found = findAnswer(question) ?? findAnswer(concept);
  const opener = OPENERS[question.length % OPENERS.length];

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

/**
 * Retourne une réponse de LOG. Tente l'IA temps réel (Claude via le backend)
 * puis, en cas d'échec, la base locale. Signature stable : écrans inchangés.
 */
export async function askLog({ concept, question, context }: AskLogParams): Promise<string> {
  const trimmed = question.trim();

  if (trimmed.length === 0) {
    return `Pose-moi ta question sur ${concept}, je t'expliquerai simplement.`;
  }

  if (LOG_AI_ENABLED) {
    const remote = await askLogRemote(concept, trimmed, context);
    if (remote) return remote;
  }

  return localAnswer(concept, trimmed);
}
