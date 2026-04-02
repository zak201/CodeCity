import type { ErrorRequestHandler } from 'express';

export class HttpError extends Error {
  readonly statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.name = 'HttpError';
    this.statusCode = statusCode;
  }
}

export const errorHandler: ErrorRequestHandler = (
  err,
  _req,
  res,
  _next
): void => {
  if (err instanceof HttpError) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }

  const message =
    err instanceof Error ? err.message : 'Erreur interne du serveur';

  const statusFromErr =
    typeof err === 'object' &&
    err !== null &&
    'statusCode' in err &&
    typeof (err as { statusCode: unknown }).statusCode === 'number'
      ? (err as { statusCode: number }).statusCode
      : typeof err === 'object' &&
          err !== null &&
          'status' in err &&
          typeof (err as { status: unknown }).status === 'number'
        ? (err as { status: number }).status
        : 500;

  const statusCode = statusFromErr >= 400 && statusFromErr < 600 ? statusFromErr : 500;

  if (statusCode === 500) {
    console.error(err);
  }

  res.status(statusCode).json({ error: message });
};
