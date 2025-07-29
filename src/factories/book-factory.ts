import Book from "@/models/book";
import { generateId } from "@/utils/id-generator";
import { futureDateError } from "@/errors/future-date-error";

export type CreateBookDTO = Omit<Book, 'id'>;

export class BookFactory {
  static validatePublishedDate(date: Date): void {
    if (new Date(date) > new Date()) {
      throw futureDateError();
    }
  }

  static create(bookData: CreateBookDTO): Book {
    this.validatePublishedDate(bookData.publishedDate);
    
    return new Book(
      generateId(),
      bookData.title,
      bookData.author,
      bookData.publishedDate,
      bookData.genre
    );
  }
} 