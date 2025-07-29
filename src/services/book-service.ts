import { bookRepository } from '@/repositories/book-repository';
import { BookRepository } from '@/interfaces/BookRepository';
import { BookService } from '@/interfaces/BookService';
import { BookFactory, CreateBookDTO } from '@/factories/book-factory';
import Book from "@/models/book";

export class DefaultBookService implements BookService {
  constructor(private repository: BookRepository = bookRepository) {}

  async createBook(bookData: CreateBookDTO): Promise<Book> {
    const book = BookFactory.create(bookData);
    return await this.repository.post(book);
  }
}  

export const bookService = new DefaultBookService();