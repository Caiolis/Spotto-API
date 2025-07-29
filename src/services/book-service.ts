import { futureDateError } from "@/errors/future-date-error";
import { BookRepository, bookRepository } from '@/repositories/book-repository';
import Book from "@/models/book";

export class BookService {
  constructor(private repository: BookRepository = bookRepository) {}

  async createBook(book: Book) {
    if(book.publishedDate && new Date(book.publishedDate) > new Date()) throw futureDateError;

    return await this.repository.post(book);
  }
}  

export const bookService = new BookService();