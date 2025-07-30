import { Request, Response } from 'express';
import { BookController } from '../../../src/controllers/book-controller';
import { BookService } from '../../../src/interfaces/BookService';
import { TestBookFactory } from '../../factories/book-factory';
import { missingIdError } from '../../../src/errors/missing-id-error';
import httpStatus from 'http-status';

describe('BookController', () => {
  let controller: BookController;
  let mockService: jest.Mocked<BookService>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockService = {
      createBook: jest.fn(),
      getBooks: jest.fn(),
      getBookById: jest.fn(),
      updateBook: jest.fn(),
      patchBook: jest.fn(),
      deleteBook: jest.fn(),
    };

    controller = new BookController(mockService);

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
  });

  describe('createBook', () => {
    it('should create a book and return 201', async () => {
      const bookData = TestBookFactory.createValidBook();
      const createdBook = { ...bookData, id: 'test-id' };
      mockRequest = { body: bookData };
      mockService.createBook.mockResolvedValue(createdBook);

      await controller.createBook(mockRequest as Request, mockResponse as Response);

      expect(mockService.createBook).toHaveBeenCalledWith(bookData);
      expect(mockResponse.status).toHaveBeenCalledWith(httpStatus.CREATED);
      expect(mockResponse.send).toHaveBeenCalledWith(createdBook);
    });
  });

  describe('getBooks', () => {
    it('should return all books with 200', async () => {
      const books = [
        { ...TestBookFactory.createValidBook(), id: 'id-1' },
        { ...TestBookFactory.createValidBook(), id: 'id-2' }
      ];
      mockRequest = {};
      mockService.getBooks.mockResolvedValue(books);

      await controller.getBooks(mockRequest as Request, mockResponse as Response);

      expect(mockService.getBooks).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(httpStatus.OK);
      expect(mockResponse.send).toHaveBeenCalledWith(books);
    });
  });

  describe('getBookById', () => {
    it('should return a book with 200 when id exists', async () => {
      const book = { ...TestBookFactory.createValidBook(), id: 'test-id' };
      mockRequest = { params: { id: 'test-id' } };
      mockService.getBookById.mockResolvedValue(book);

      await controller.getBookById(mockRequest as Request, mockResponse as Response);

      expect(mockService.getBookById).toHaveBeenCalledWith('test-id');
      expect(mockResponse.status).toHaveBeenCalledWith(httpStatus.OK);
      expect(mockResponse.send).toHaveBeenCalledWith(book);
    });

    it('should throw missingIdError when id is not provided', async () => {
      mockRequest = { params: {} };

      let error: Error | undefined;
      try {
        await controller.getBookById(mockRequest as Request, mockResponse as Response);
      } catch (e) {
        error = e as Error;
      }

      expect(error?.message).toBe(missingIdError().message);
      expect(mockService.getBookById).not.toHaveBeenCalled();
    });
  });

  describe('updateBook', () => {
    it('should update a book and return 200', async () => {
      const bookData = TestBookFactory.createValidBook();
      const updatedBook = { ...bookData, id: 'test-id' };
      mockRequest = {
        params: { id: 'test-id' },
        body: bookData
      };
      mockService.updateBook.mockResolvedValue(updatedBook);

      await controller.updateBook(mockRequest as Request, mockResponse as Response);

      expect(mockService.updateBook).toHaveBeenCalledWith('test-id', bookData);
      expect(mockResponse.status).toHaveBeenCalledWith(httpStatus.OK);
      expect(mockResponse.send).toHaveBeenCalledWith(updatedBook);
    });

    it('should throw missingIdError when id is not provided', async () => {
      mockRequest = {
        params: {},
        body: TestBookFactory.createValidBook()
      };

      let error: Error | undefined;
      try {
        await controller.updateBook(mockRequest as Request, mockResponse as Response);
      } catch (e) {
        error = e as Error;
      }

      expect(error?.message).toBe(missingIdError().message);
      expect(mockService.updateBook).not.toHaveBeenCalled();
    });
  });

  describe('patchBook', () => {
    it('should patch a book and return 200', async () => {
      const partialUpdate = { title: 'New Title' };
      const updatedBook = { ...TestBookFactory.createValidBook(), id: 'test-id', ...partialUpdate };
      mockRequest = {
        params: { id: 'test-id' },
        body: partialUpdate
      };
      mockService.patchBook.mockResolvedValue(updatedBook);

      await controller.patchBook(mockRequest as Request, mockResponse as Response);

      expect(mockService.patchBook).toHaveBeenCalledWith('test-id', partialUpdate);
      expect(mockResponse.status).toHaveBeenCalledWith(httpStatus.OK);
      expect(mockResponse.send).toHaveBeenCalledWith(updatedBook);
    });

    it('should throw missingIdError when id is not provided', async () => {
      mockRequest = {
        params: {},
        body: { title: 'New Title' }
      };

      let error: Error | undefined;
      try {
        await controller.patchBook(mockRequest as Request, mockResponse as Response);
      } catch (e) {
        error = e as Error;
      }

      expect(error?.message).toBe(missingIdError().message);
      expect(mockService.patchBook).not.toHaveBeenCalled();
    });
  });

  describe('deleteBook', () => {
    it('should delete a book and return 200 with success message', async () => {
      mockRequest = { params: { id: 'test-id' } };
      mockService.deleteBook.mockResolvedValue();

      await controller.deleteBook(mockRequest as Request, mockResponse as Response);

      expect(mockService.deleteBook).toHaveBeenCalledWith('test-id');
      expect(mockResponse.status).toHaveBeenCalledWith(httpStatus.OK);
      expect(mockResponse.send).toHaveBeenCalledWith({
        message: 'Book successfully deleted'
      });
    });

    it('should throw missingIdError when id is not provided', async () => {
      mockRequest = { params: {} };

      let error: Error | undefined;
      try {
        await controller.deleteBook(mockRequest as Request, mockResponse as Response);
      } catch (e) {
        error = e as Error;
      }

      expect(error?.message).toBe(missingIdError().message);
      expect(mockService.deleteBook).not.toHaveBeenCalled();
    });
  });
}); 