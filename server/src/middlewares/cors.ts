import type { RequestHandler } from 'express';

/**
 * CORS maison (sans dépendance) : autorise le client React Native / navigateur
 * à appeler l’API. Répond directement aux pré-requêtes OPTIONS avec un 204.
 */
export const cors: RequestHandler = (req, res, next): void => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,PUT,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.sendStatus(204);
    return;
  }

  next();
};
