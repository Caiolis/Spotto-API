import { DefaultBookService } from '../../../src/services/book-service';
import { BookRepository } from '../../../src/interfaces/BookRepository';
import { TestBookFactory } from '../../factories/book-factory';
import { futureDateError } from '../../../src/errors/future-date-error';
import { unchangedFieldsError } from '../../../src/errors/unchanged-fields-error';
import { missingFieldsError } from '../../../src/errors/missing-fields-error';
import { ApplicationError } from '../../../src/errors/ApplicationError';
import Book from '../../../src/models/book';

describe('DefaultBookService', () => {
  let bookService: DefaultBookService;
  let mockRepository: jest.Mocked<BookRepository>;
  let today: Date;

  beforeEach(() => {
    mockRepository = {
      post: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      patch: jest.fn(),
      delete: jest.fn(),
    };
    bookService = new DefaultBookService(mockRepository);

    today = new Date();
    today.setHours(0, 0, 0, 0);
    jest.useFakeTimers();
    jest.setSystemTime(today);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('createBook', () => {
    describe('when creating a book with valid data', () => {
      it('should create and return the book with generated id', async () => {
        const validBook = TestBookFactory.createValidBook();
        mockRepository.post.mockResolvedValue({ ...validBook, id: 'test-id' });

        const result = await bookService.createBook(validBook);

        expect(result).toHaveProperty('id', 'test-id');
        expect(mockRepository.post).toHaveBeenCalledWith(expect.objectContaining(validBook));
      });
    });

    describe('when creating a book with future date', () => {
      it('should throw futureDateError', async () => {
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const futureBook = TestBookFactory.createValidBook({
          publishedDate: tomorrow
        });

        let error: ApplicationError | undefined;
        try {
          await bookService.createBook(futureBook);
        } catch (e) {
          error = e as ApplicationError;
        }

        expect(error?.name).toBe('futureDateError');
        expect(error?.message).toBe(futureDateError().message);
        expect(mockRepository.post).not.toHaveBeenCalled();
      });
    });
  });

  describe('getBooks', () => {
    it('should return all books from repository', async () => {
      const books = [
        { ...TestBookFactory.createValidBook(), id: 'id-1' },
        { ...TestBookFactory.createValidBook(), id: 'id-2' }
      ];
      mockRepository.findAll.mockResolvedValue(books);

      const result = await bookService.getBooks();

      expect(result).toEqual(books);
      expect(mockRepository.findAll).toHaveBeenCalled();
    });
  });

  describe('getBookById', () => {
    it('should return book from repository when found', async () => {
      const book = { ...TestBookFactory.createValidBook(), id: 'test-id' };
      mockRepository.findById.mockResolvedValue(book);

      const result = await bookService.getBookById('test-id');

      expect(result).toEqual(book);
      expect(mockRepository.findById).toHaveBeenCalledWith('test-id');
    });

    it('should propagate error when book not found', async () => {
      const error = new Error('Not found');
      mockRepository.findById.mockRejectedValue(error);

      await expect(bookService.getBookById('test-id')).rejects.toThrow(error);
    });
  });

  describe('updateBook', () => {
    describe('when updating with unchanged data', () => {
      it('should throw unchangedFieldsError', async () => {
        const book = TestBookFactory.createValidBook();
        const bookWithId = { ...book, id: 'test-id' };
        mockRepository.findById.mockResolvedValue(bookWithId);

        let error: ApplicationError | undefined;
        try {
          await bookService.updateBook('test-id', book);
        } catch (e) {
          error = e as ApplicationError;
        }

        expect(error?.name).toBe('unchangedFieldsError');
        expect(error?.message).toBe(unchangedFieldsError().message);
        expect(mockRepository.update).not.toHaveBeenCalled();
      });
    });

    describe('when updating with missing fields', () => {
      it('should throw missingFieldsError', async () => {
        const partialBook = { title: 'test' } as Book;

        let error: ApplicationError | undefined;
        try {
          await bookService.updateBook('test-id', partialBook);
        } catch (e) {
          error = e as ApplicationError;
        }

        expect(error?.name).toBe('missingFieldsError');
        expect(error?.message).toBe(missingFieldsError().message);
        expect(mockRepository.update).not.toHaveBeenCalled();
      });
    });

    describe('when updating with future date', () => {
      it('should throw futureDateError', async () => {
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const futureBook = TestBookFactory.createValidBook({
          publishedDate: tomorrow
        });

        let error: ApplicationError | undefined;
        try {
          await bookService.updateBook('test-id', futureBook);
        } catch (e) {
          error = e as ApplicationError;
        }

        expect(error?.name).toBe('futureDateError');
        expect(error?.message).toBe(futureDateError().message);
        expect(mockRepository.update).not.toHaveBeenCalled();
      });
    });

    describe('when updating with valid changes', () => {
      it('should update and return the book', async () => {
        const originalBook = TestBookFactory.createValidBook();
        const bookWithId = { ...originalBook, id: 'test-id' };
        const updatedBook = TestBookFactory.createValidBook();
        
        mockRepository.findById.mockResolvedValue(bookWithId);
        mockRepository.update.mockResolvedValue({ ...updatedBook, id: 'test-id' });

        const result = await bookService.updateBook('test-id', updatedBook);

        expect(result).toMatchObject(updatedBook);
        expect(mockRepository.update).toHaveBeenCalledWith('test-id', updatedBook);
      });
    });
  });

  describe('patchBook', () => {
    describe('when patching with unchanged data', () => {
      it('should throw unchangedFieldsError', async () => {
        const book = TestBookFactory.createValidBook();
        const bookWithId = { ...book, id: 'test-id' };
        mockRepository.findById.mockResolvedValue(bookWithId);

        let error: ApplicationError | undefined;
        try {
          await bookService.patchBook('test-id', { title: book.title });
        } catch (e) {
          error = e as ApplicationError;
        }

        expect(error?.name).toBe('unchangedFieldsError');
        expect(error?.message).toBe(unchangedFieldsError().message);
        expect(mockRepository.patch).not.toHaveBeenCalled();
      });
    });

    describe('when patching with future date', () => {
      it('should throw futureDateError', async () => {
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const partialUpdate = { publishedDate: tomorrow };

        let error: ApplicationError | undefined;
        try {
          await bookService.patchBook('test-id', partialUpdate);
        } catch (e) {
          error = e as ApplicationError;
        }

        expect(error?.name).toBe('futureDateError');
        expect(error?.message).toBe(futureDateError().message);
        expect(mockRepository.patch).not.toHaveBeenCalled();
      });
    });

    describe('when patching with valid changes', () => {
      it('should update and return the book', async () => {
        const originalBook = TestBookFactory.createValidBook();
        const bookWithId = { ...originalBook, id: 'test-id' };
        const partialUpdate = { title: 'New Title' };
        
        mockRepository.findById.mockResolvedValue(bookWithId);
        mockRepository.patch.mockResolvedValue({ ...bookWithId, ...partialUpdate });

        const result = await bookService.patchBook('test-id', partialUpdate);

        expect(result.title).toBe('New Title');
        expect(mockRepository.patch).toHaveBeenCalledWith('test-id', partialUpdate);
      });
    });
  });

  describe('deleteBook', () => {
    describe('when deleting an existing book', () => {
      it('should delete the book', async () => {
        const bookId = 'test-id';
        mockRepository.findById.mockResolvedValue({ id: bookId } as Book);

        await bookService.deleteBook(bookId);

        expect(mockRepository.delete).toHaveBeenCalledWith(bookId);
      });
    });

    describe('when deleting a non-existent book', () => {
      it('should throw bookNotFoundError', async () => {
        const bookId = 'nonexistent-id';
        mockRepository.findById.mockRejectedValue(new Error('Book not found with the given id.'));

        let error: Error | undefined;
        try {
          await bookService.deleteBook(bookId);
        } catch (e) {
          error = e as Error;
        }

        expect(error?.message).toBe('Book not found with the given id.');
        expect(mockRepository.delete).not.toHaveBeenCalled();
      });
    });
  });
}); 