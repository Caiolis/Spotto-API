import { bookRepository } from '@/repositories/book-repository';
import { BookRepository } from '@/interfaces/BookRepository';
import { BookService } from '@/interfaces/BookService';
import { BookFactory, CreateBookDTO } from '@/factories/book-factory';
import { missingFieldsError } from '@/errors/missing-fields-error';
import { unchangedFieldsError } from '@/errors/unchanged-fields-error';
import { futureDateError } from '@/errors/future-date-error';
import Book from "@/models/book";

export class DefaultBookService implements BookService {
  constructor(private repository: BookRepository = bookRepository) {}

  private isFutureDate(date: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);
    return compareDate.getTime() > today.getTime();
  }

  private areValuesEqual(value1: any, value2: any): boolean {
    if (value1 instanceof Date && value2 instanceof Date) {
      const date1 = new Date(value1);
      const date2 = new Date(value2);
      date1.setHours(0, 0, 0, 0);
      date2.setHours(0, 0, 0, 0);
      return date1.getTime() === date2.getTime();
    }
    return value1 === value2;
  }

  async createBook(bookData: CreateBookDTO): Promise<Book> {
    if(bookData.publishedDate && this.isFutureDate(bookData.publishedDate)) {
      throw futureDateError();
    }

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

    if(bookData.publishedDate && this.isFutureDate(bookData.publishedDate)) {
      throw futureDateError();
    }

    const currentBook = await this.repository.findById(id);
    
    const hasChanges = Object.entries(bookData).some(([key, value]) => 
      !this.areValuesEqual(currentBook[key as keyof Book], value)
    );

    if (!hasChanges) {
      throw unchangedFieldsError();
    }

    return await this.repository.update(id, bookData);
  }

  async patchBook(id: string, bookData: Partial<Omit<Book, 'id'>>): Promise<Book> {
    if(bookData.publishedDate && this.isFutureDate(bookData.publishedDate)) {
      throw futureDateError();
    }

    const currentBook = await this.repository.findById(id);
    
    const hasChanges = Object.entries(bookData).some(([key, value]) => 
      !this.areValuesEqual(currentBook[key as keyof Book], value)
    );

    if (!hasChanges) {
      throw unchangedFieldsError();
    }
    
    return await this.repository.patch(id, bookData);
  }

  async deleteBook(id: string): Promise<void> {
    await this.repository.findById(id);
    await this.repository.delete(id);
  }
}

export const bookService = new DefaultBookService();