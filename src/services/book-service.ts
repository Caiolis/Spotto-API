import { futureDateError } from "@/errors/future-date-error";
import { BookRepository, bookRepository } from '@/repositories/book-repository';
import { generateId } from '@/utils/id-generator';
import Book from "@/models/book";

export class BookService {
  constructor(private repository: BookRepository = bookRepository) {}

  async createBook(bookData: Omit<Book, 'id'>) {
    if(bookData.publishedDate && new Date(bookData.publishedDate) > new Date()) throw futureDateError();

    const book = new Book(
      generateId(),
      bookData.title,
      bookData.author,
      bookData.publishedDate,
      bookData.genre
    );

    return await this.repository.post(book);
  }
}  

export const bookService = new BookService();