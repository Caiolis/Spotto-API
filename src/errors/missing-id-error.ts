import { ApplicationError } from "@/errors/ApplicationError";

export function missingIdError(): ApplicationError {
  return {
    name: 'missingIdError',
    message: 'Book id is required.',
  };
} 