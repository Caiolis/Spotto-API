import booksDatabase from "@/database/database";
import Book from "@/models/book";
import { BookRepository } from "@/interfaces/BookRepository";
import { bookNotFoundError } from "@/errors/book-not-found-error";

export class MemoryBookRepository implements BookRepository {
  async post(book: Book): Promise<Book> {
    booksDatabase.push(book);
    return book;
  }

  async findAll(): Promise<Book[]> {
    return booksDatabase;
  }

  async findById(id: string): Promise<Book> {
    const book = booksDatabase.find(book => book.id === id);
    if (!book) throw bookNotFoundError();
    return book;
  }
}

export const bookRepository = new MemoryBookRepository();