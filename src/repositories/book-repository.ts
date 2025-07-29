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

  async update(id: string, bookData: Omit<Book, 'id'>): Promise<Book> {
    const index = booksDatabase.findIndex(book => book.id === id);
    if (index === -1) throw bookNotFoundError();

    const updatedBook = { ...bookData, id } as Book;
    booksDatabase[index] = updatedBook;
    return updatedBook;
  }

  async patch(id: string, bookData: Partial<Omit<Book, 'id'>>): Promise<Book> {
    const index = booksDatabase.findIndex(book => book.id === id);
    if (index === -1) throw bookNotFoundError();

    const currentBook = { ...booksDatabase[index] };
    const updatedBook = { ...currentBook, ...bookData } as Book;
    booksDatabase[index] = updatedBook;
    return updatedBook;
  }
}

export const bookRepository = new MemoryBookRepository();