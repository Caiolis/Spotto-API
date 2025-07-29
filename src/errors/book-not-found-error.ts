import { ApplicationError } from "@/errors/ApplicationError";

export function bookNotFoundError(): ApplicationError {
  return {
    name: 'bookNotFoundError',
    message: 'Book not found with the given id.',
  };
} 