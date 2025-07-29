import { ApplicationError } from "@/errors/ApplicationError";

export function unchangedFieldsError(): ApplicationError {
  return {
    name: 'unchangedFieldsError',
    message: 'To update a book, at least one field must be different from the current value.',
  };
} 