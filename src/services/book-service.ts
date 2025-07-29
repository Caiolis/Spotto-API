import { bookRepository } from '@/repositories/book-repository';
import { BookRepository } from '@/interfaces/BookRepository';
import { BookService } from '@/interfaces/BookService';
import { BookFactory, CreateBookDTO } from '@/factories/book-factory';
import { missingFieldsError } from '@/errors/missing-fields-error';
import { unchangedFieldsError } from '@/errors/unchanged-fields-error';
import Book from "@/models/book";

export class DefaultBookService implements BookService {
  constructor(private repository: BookRepository = bookRepository) {}

  async createBook(bookData: CreateBookDTO): Promise<Book> {
    const book = BookFactory.create(bookData);
    return await this.repository.post(book);
  }

  async getBooks(): Promise<Book[]> {
    return await this.repository.findAll();
  }

  async getBookById(id: string): Promise<Book> {
    return await this.repository.findById(id);
  }

  async updateBook(id: string, bookData: Omit<Book, 'id'>): Promise<Book> {
    if (!bookData.title || !bookData.author || !bookData.publishedDate || !bookData.genre) {
      throw missingFieldsError();
    }

    const currentBook = await this.repository.findById(id);
    
    const hasChanges = Object.entries(bookData).some(([key, value]) => 
      currentBook[key as keyof Book] !== value
    );

    if (!hasChanges) {
      throw unchangedFieldsError();
    }

    if(bookData.publishedDate && new Date(bookData.publishedDate) > new Date()) {
      throw BookFactory.validatePublishedDate(bookData.publishedDate);
    }

    return await this.repository.update(id, bookData);
  }

  async patchBook(id: string, bookData: Partial<Omit<Book, 'id'>>): Promise<Book> {
    const currentBook = await this.repository.findById(id);
    
    const hasChanges = Object.entries(bookData).some(([key, value]) => 
      currentBook[key as keyof Book] !== value
    );

    if (!hasChanges) {
      throw unchangedFieldsError();
    }

    if(bookData.publishedDate) {
      BookFactory.validatePublishedDate(bookData.publishedDate);
    }
    
    return await this.repository.patch(id, bookData);
  }

  async deleteBook(id: string): Promise<void> {
    await this.repository.findById(id);
    await this.repository.delete(id);
  }
}

export const bookService = new DefaultBookService();