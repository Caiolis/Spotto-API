import Book from "@/models/book";
import { generateId } from "@/utils/id-generator";

export type CreateBookDTO = Omit<Book, 'id'>;

export class BookFactory {
  static create(bookData: CreateBookDTO): Book {
    return new Book(
      generateId(),
      bookData.title,
      bookData.author,
      bookData.publishedDate,
      bookData.genre
    );
  }
} 