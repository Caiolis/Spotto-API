import { ApplicationError } from "@/errors/ApplicationError";

export function missingFieldsError(): ApplicationError {
  return {
    name: 'missingFieldsError',
    message: 'All fields are required when using PUT request.',
  };
} 