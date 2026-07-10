import './loadEnv';
import express from 'express';
import { usersRouter } from './routes/users';
import { progressRouter } from './routes/progress';
import { logRouter } from './routes/log';
import { cors } from './middlewares/cors';
import { errorHandler } from './middlewares/errorHandler';

const app = express();
// 3050 si absent du .env : évite le 3000 souvent pris (Docker, etc.)
const PORT = Number(process.env.PORT) || 3050;

app.use(cors);
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/users', usersRouter);
app.use('/api/progress', progressRouter);
app.use('/api/log', logRouter);

app.use(errorHandler);

const server = app.listen(PORT);

server.once('listening', () => {
  console.log(`CodeCity API en écoute sur http://localhost:${PORT}`);
});

server.on('error', (err: NodeJS.ErrnoException) => {
  if (err.code === 'EADDRINUSE') {
    console.error(
      `Impossible d’utiliser le port ${PORT} : il est déjà pris (arrête l’autre processus ou changes PORT dans server/.env).`
    );
  }
  throw err;
});
