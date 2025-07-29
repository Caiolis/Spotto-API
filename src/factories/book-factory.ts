import Book from "@/models/book";
import { generateId } from "@/utils/id-generator";
import { futureDateError } from "@/errors/future-date-error";

export type CreateBookDTO = Omit<Book, 'id'>;

export class BookFactory {
  static create(bookData: CreateBookDTO): Book {

    if (bookData.publishedDate && new Date(bookData.publishedDate) > new Date()) {
      throw futureDateError();
    }

    return new Book(
      generateId(),
      bookData.title,
      bookData.author,
      bookData.publishedDate,
      bookData.genre
    );
  }
} 