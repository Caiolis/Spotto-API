import { ApplicationError } from "@/errors/ApplicationError";

export function futureDateError(): ApplicationError {
  return {
    name: 'futureDateError',
    message: 'A book cannot be added if it is not currently published.',
  };
}