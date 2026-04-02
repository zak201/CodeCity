import path from 'node:path';
import dotenv from 'dotenv';

/**
 * Doit être importé en tout premier depuis `index.ts` pour que `process.env`
 * (PORT, DATABASE_URL, etc.) soit défini avant Prisma et les routes.
 * `override: true` : le fichier .env du projet l’emporte sur un PORT=3000 global Windows.
 */
dotenv.config({
  path: path.resolve(__dirname, '..', '.env'),
  override: true,
});
