import express from 'express';
import { usersRouter } from './routes/users';
import { progressRouter } from './routes/progress';
import { errorHandler } from './middlewares/errorHandler';

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

app.use('/api/users', usersRouter);
app.use('/api/progress', progressRouter);

app.use(errorHandler);

app
  .listen(PORT, () => {
    console.log(`CodeCity API en écoute sur http://localhost:${PORT}`);
  })
  .on('error', (err: NodeJS.ErrnoException) => {
    if (err.code === 'EADDRINUSE') {
      console.error(
        `Impossible d’utiliser le port ${PORT} : il est déjà pris (arrête l’autre processus ou définis PORT dans .env).`
      );
    }
    throw err;
  });
