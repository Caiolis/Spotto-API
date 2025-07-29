import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';

export type AppError = Error & {
  name: string;
};

export function errorHandling(
  error: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
) {

  if (error.name == 'futureDateError') {
    return res.status(httpStatus.EXPECTATION_FAILED).send(error.message);
  }

  return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
}