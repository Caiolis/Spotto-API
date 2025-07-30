import { CreateBookDTO, PartialBookDTO } from '../factories/book-factory';
import { DateHelper } from './date-helper';

export class RequestHelper {
  static formatBookData(book: CreateBookDTO | PartialBookDTO): any {
    if (!book.publishedDate) return book;
    
    return {
      ...book,
      publishedDate: DateHelper.formatForRequest(book.publishedDate)
    };
  }
} 