import { MemoryBookRepository } from '../../../src/repositories/book-repository';
import { TestBookFactory } from '../../factories/book-factory';
import booksDatabase from '../../../src/database/database';
import { bookNotFoundError } from '../../../src/errors/book-not-found-error';
import { ApplicationError } from '../../../src/errors/ApplicationError';

describe('MemoryBookRepository', () => {
  let repository: MemoryBookRepository;

  beforeEach(() => {
    while (booksDatabase.length > 0) {
      booksDatabase.pop();
    }
    repository = new MemoryBookRepository();
  });

  describe('post', () => {
    it('should add a book to the database', async () => {
      const book = { ...TestBookFactory.createValidBook(), id: 'test-id' };

      const result = await repository.post(book);

      expect(result).toEqual(book);
      expect(booksDatabase).toContainEqual(book);
    });
  });

  describe('findAll', () => {
    it('should return empty array when no books exist', async () => {
      const result = await repository.findAll();

      expect(result).toEqual([]);
    });

    it('should return all books', async () => {
      const books = [
        { ...TestBookFactory.createValidBook(), id: 'id-1' },
        { ...TestBookFactory.createValidBook(), id: 'id-2' }
      ];
      booksDatabase.push(...books);

      const result = await repository.findAll();

      expect(result).toEqual(books);
    });
  });

  describe('findById', () => {
    it('should return book when it exists', async () => {
      const book = { ...TestBookFactory.createValidBook(), id: 'test-id' };
      booksDatabase.push(book);

      const result = await repository.findById('test-id');

      expect(result).toEqual(book);
    });

    it('should throw bookNotFoundError when book does not exist', async () => {
      let error: ApplicationError | undefined;
      try {
        await repository.findById('nonexistent-id');
      } catch (e) {
        error = e as ApplicationError;
      }

      expect(error?.name).toBe('bookNotFoundError');
      expect(error?.message).toBe(bookNotFoundError().message);
    });
  });

  describe('update', () => {
    it('should update book when it exists', async () => {
      const originalBook = { ...TestBookFactory.createValidBook(), id: 'test-id' };
      booksDatabase.push(originalBook);

      const updateData = TestBookFactory.createValidBook();
      const result = await repository.update('test-id', updateData);

      expect(result).toEqual({ ...updateData, id: 'test-id' });
      expect(booksDatabase[0]).toEqual({ ...updateData, id: 'test-id' });
    });

    it('should throw bookNotFoundError when book does not exist', async () => {
      const updateData = TestBookFactory.createValidBook();

      let error: ApplicationError | undefined;
      try {
        await repository.update('nonexistent-id', updateData);
      } catch (e) {
        error = e as ApplicationError;
      }

      expect(error?.name).toBe('bookNotFoundError');
      expect(error?.message).toBe(bookNotFoundError().message);
    });
  });

  describe('patch', () => {
    it('should partially update book when it exists', async () => {
      const originalBook = { ...TestBookFactory.createValidBook(), id: 'test-id' };
      booksDatabase.push(originalBook);

      const partialUpdate = { title: 'New Title' };
      const result = await repository.patch('test-id', partialUpdate);

      expect(result).toEqual({ ...originalBook, ...partialUpdate });
      expect(booksDatabase[0]).toEqual({ ...originalBook, ...partialUpdate });
    });

    it('should throw bookNotFoundError when book does not exist', async () => {
      const partialUpdate = { title: 'New Title' };

      let error: ApplicationError | undefined;
      try {
        await repository.patch('nonexistent-id', partialUpdate);
      } catch (e) {
        error = e as ApplicationError;
      }

      expect(error?.name).toBe('bookNotFoundError');
      expect(error?.message).toBe(bookNotFoundError().message);
    });
  });

  describe('delete', () => {
    it('should delete book when it exists', async () => {
      const book = { ...TestBookFactory.createValidBook(), id: 'test-id' };
      booksDatabase.push(book);

      await repository.delete('test-id');

      expect(booksDatabase).not.toContainEqual(book);
      expect(booksDatabase.length).toBe(0);
    });

    it('should throw bookNotFoundError when book does not exist', async () => {
      let error: ApplicationError | undefined;
      try {
        await repository.delete('nonexistent-id');
      } catch (e) {
        error = e as ApplicationError;
      }

      expect(error?.name).toBe('bookNotFoundError');
      expect(error?.message).toBe(bookNotFoundError().message);
    });
  });
}); 