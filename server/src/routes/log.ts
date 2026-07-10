import { Router } from 'express';
import { HttpError } from '../middlewares/errorHandler';
import { askClaude, isClaudeConfigured, type LogContext } from '../anthropic';

/**
 * Proxy de l'IA tutrice LOG.
 *
 * L'app mobile POST `{ concept, question, context? }` ici ; le serveur relaie
 * vers l'API Claude (la clé ne quitte jamais le backend) et renvoie `{ answer }`.
 * En cas de clé absente (503) ou d'erreur, l'app retombe sur sa base locale.
 */
export const logRouter = Router();

/** Ne garde que des chaînes non vides, bornées, pour éviter tout abus de payload. */
function sanitizeContext(raw: unknown): LogContext | undefined {
  if (!raw || typeof raw !== 'object') return undefined;
  const r = raw as Record<string, unknown>;
  const pick = (v: unknown): string | undefined =>
    typeof v === 'string' && v.trim().length > 0 ? v.trim().slice(0, 600) : undefined;
  return {
    districtName: pick(r.districtName),
    districtStory: pick(r.districtStory),
    chapterTitle: pick(r.chapterTitle),
    levelTitle: pick(r.levelTitle),
    levelQuestion: pick(r.levelQuestion),
  };
}

logRouter.post('/ask', async (req, res, next) => {
  try {
    const { concept, question, context } = req.body ?? {};

    if (typeof question !== 'string' || question.trim().length === 0) {
      next(new HttpError(400, 'Le champ question est requis'));
      return;
    }

    const safeConcept =
      typeof concept === 'string' && concept.trim().length > 0
        ? concept.trim()
        : 'la programmation';

    if (!isClaudeConfigured()) {
      // Pas de clé : l'app utilisera sa base de connaissances locale.
      next(new HttpError(503, 'IA LOG non configurée sur le serveur'));
      return;
    }

    const answer = await askClaude(
      safeConcept,
      question.trim(),
      sanitizeContext(context)
    );
    res.json({ answer });
  } catch (e) {
    next(e);
  }
});
