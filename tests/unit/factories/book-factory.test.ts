import { BookFactory } from '../../../src/factories/book-factory';
import { TestBookFactory } from '../../factories/book-factory';

describe('BookFactory', () => {
  describe('create', () => {
    it('should create a book with valid data', () => {
      const validData = TestBookFactory.createValidBook();
      
      const book = BookFactory.create(validData);

      expect(book).toHaveProperty('id');
      expect(book.title).toBe(validData.title);
      expect(book.author).toBe(validData.author);
      expect(book.genre).toBe(validData.genre);
      expect(book.publishedDate).toBe(validData.publishedDate);
    });
  });
}); 