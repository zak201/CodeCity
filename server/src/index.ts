import './loadEnv';
import express from 'express';
import { authRouter } from './routes/auth';
import { meRouter } from './routes/me';
import { usersRouter } from './routes/users';
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

app.use('/api/auth', authRouter);
app.use('/api/me', meRouter);
app.use('/api/users', usersRouter);
app.use('/api/log', logRouter);

app.use(errorHandler);

const server = app.listen(PORT);

server.once('listening', () => {
  console.log(`CodeCity API en écoute sur http://localhost:${PORT}`);
});

server.on('error', (err: NodeJS.ErrnoException) => {
  if (err.code === 'EADDRINUSE') {
    console.error(
      `Impossible d’utiliser le port ${PORT} : il est déjà pris (arrête l’autre processus ou change PORT dans server/.env).`
    );
    process.exit(1);
  }
  throw err;
});
