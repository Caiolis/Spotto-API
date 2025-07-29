import booksDatabase from "@/database/database";
import Book from "@/models/book";
import { BookRepository } from "@/interfaces/BookRepository";

export class MemoryBookRepository implements BookRepository {
  async post(book: Book): Promise<Book> {
    booksDatabase.push(book);
    return book;
  }
}

export const bookRepository = new MemoryBookRepository();