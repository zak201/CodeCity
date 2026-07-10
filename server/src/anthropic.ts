import Anthropic from '@anthropic-ai/sdk';

/**
 * Accès centralisé à l'API Claude pour LOG, l'IA tutrice.
 *
 * La clé `ANTHROPIC_API_KEY` reste STRICTEMENT côté serveur : l'app mobile
 * n'appelle jamais Anthropic en direct, seulement la route `/api/log/ask`.
 *
 * Si aucune clé n'est configurée, `client` vaut `null` : la route renvoie un
 * 503 et l'app bascule sur sa base de connaissances locale (offline-first).
 */

const MODEL = process.env.LOG_MODEL || 'claude-haiku-4-5';
const apiKey = process.env.ANTHROPIC_API_KEY;

const client = apiKey ? new Anthropic({ apiKey }) : null;

/** L'IA temps réel est-elle configurée sur ce serveur ? */
export function isClaudeConfigured(): boolean {
  return client !== null;
}

/**
 * Contexte de jeu transmis par l'app pour ancrer la réponse dans l'univers.
 * On n'y met JAMAIS la solution / la bonne réponse d'un niveau (pour ne pas
 * que LOG la divulgue) — seulement ce que le joueur voit déjà à l'écran.
 */
export interface LogContext {
  districtName?: string;
  districtStory?: string;
  chapterTitle?: string;
  levelTitle?: string;
  levelQuestion?: string;
}

/**
 * Personnalité de LOG + univers de CodeCity. Ce prompt (stable) est mis en
 * cache par l'API ; le contexte variable du niveau va dans le message user.
 */
const SYSTEM_PROMPT = `Tu es LOG, l'intelligence artificielle gardienne de CodeCity — une ville entièrement gouvernée par des algorithmes, où un bug mystérieux s'est propagé. Tu as recruté le joueur comme « Code Architect » pour réparer la ville quartier par quartier ; chaque quartier lui apprend un concept de programmation (variables, conditions, boucles, fonctions, listes, tri, récursivité).

Ton rôle : aider le joueur à COMPRENDRE le concept du niveau en cours, en restant dans l'univers du jeu.

Règles :
- 3 phrases maximum, en français, en tutoyant le joueur ;
- ton chaleureux, encourageant et légèrement mystérieux, jamais condescendant ni scolaire ;
- appuie-toi sur une analogie concrète — de préférence liée au thème du quartier en cours (voir le contexte) ;
- explique le concept pour qu'il le comprenne, mais ne donne JAMAIS directement la bonne réponse de l'énoncé : tu guides, tu ne résous pas à sa place ;
- pas de jargon inutile, pas de long bloc de code.`;

/** Assemble le message utilisateur avec le contexte de jeu disponible. */
function buildUserMessage(
  concept: string,
  question: string,
  ctx?: LogContext
): string {
  const lines = ['Contexte du niveau en cours :'];
  if (ctx?.districtName) lines.push(`- Quartier : ${ctx.districtName}`);
  if (ctx?.districtStory) lines.push(`- Situation du quartier : ${ctx.districtStory}`);
  if (ctx?.chapterTitle) lines.push(`- Chapitre : ${ctx.chapterTitle}`);
  if (ctx?.levelTitle) lines.push(`- Niveau : ${ctx.levelTitle}`);
  if (ctx?.levelQuestion) lines.push(`- Énoncé montré au joueur : ${ctx.levelQuestion}`);
  lines.push(`- Concept enseigné : ${concept}`);
  lines.push('');
  lines.push(`Question du joueur : ${question}`);
  return lines.join('\n');
}

/**
 * Interroge Claude et renvoie la réponse de LOG (texte court, in-universe).
 * Lève une erreur si la clé n'est pas configurée — l'appelant gère le repli.
 */
export async function askClaude(
  concept: string,
  question: string,
  context?: LogContext
): Promise<string> {
  if (!client) {
    throw new Error('ANTHROPIC_API_KEY non configurée');
  }

  const message = await client.messages.create({
    model: MODEL,
    max_tokens: 300,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: buildUserMessage(concept, question, context) }],
  });

  const text = message.content
    .filter((block): block is Anthropic.TextBlock => block.type === 'text')
    .map((block) => block.text)
    .join('')
    .trim();

  return (
    text ||
    `Reformule ta question sur « ${concept} » avec un mot-clé précis, je serai plus utile.`
  );
}
