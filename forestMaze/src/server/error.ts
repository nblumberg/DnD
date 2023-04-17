import { Response } from 'express';

export function errorResponse(res: Response, code = 500, message = 'Unknown error occurred') {
  console.error(`[${code}] ${message}`);
  res.status(code).send(message);
}
