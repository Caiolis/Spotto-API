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
  if (error.name === 'futureDateError') {
    return res.status(httpStatus.EXPECTATION_FAILED).send(error.message);
  }

  if (error.name === 'missingIdError') {
    return res.status(httpStatus.BAD_REQUEST).send(error.message);
  }

  if (error.name === 'bookNotFoundError') {
    return res.status(httpStatus.NOT_FOUND).send(error.message);
  }

  return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error.message);
}