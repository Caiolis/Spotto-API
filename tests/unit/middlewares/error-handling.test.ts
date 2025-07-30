import { Request, Response, NextFunction } from 'express';
import { errorHandling } from '../../../src/middlewares/errorHandling';
import { futureDateError } from '../../../src/errors/future-date-error';
import { bookNotFoundError } from '../../../src/errors/book-not-found-error';
import { missingIdError } from '../../../src/errors/missing-id-error';
import { missingFieldsError } from '../../../src/errors/missing-fields-error';
import { unchangedFieldsError } from '../../../src/errors/unchanged-fields-error';
import httpStatus from 'http-status';

describe('errorHandling middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
  });

  describe('when handling futureDateError', () => {
    it('should return 417 with error message', () => {
      const error = futureDateError();

      errorHandling(error, mockRequest as Request, mockResponse as Response, mockNext as NextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(httpStatus.EXPECTATION_FAILED);
      expect(mockResponse.send).toHaveBeenCalledWith(error.message);
    });
  });

  describe('when handling bookNotFoundError', () => {
    it('should return 404 with error message', () => {
      const error = bookNotFoundError();

      errorHandling(error, mockRequest as Request, mockResponse as Response, mockNext as NextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(httpStatus.NOT_FOUND);
      expect(mockResponse.send).toHaveBeenCalledWith(error.message);
    });
  });

  describe('when handling missingIdError', () => {
    it('should return 400 with error message', () => {
      const error = missingIdError();

      errorHandling(error, mockRequest as Request, mockResponse as Response, mockNext as NextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(httpStatus.BAD_REQUEST);
      expect(mockResponse.send).toHaveBeenCalledWith(error.message);
    });
  });

  describe('when handling missingFieldsError', () => {
    it('should return 422 with error message', () => {
      const error = missingFieldsError();

      errorHandling(error, mockRequest as Request, mockResponse as Response, mockNext as NextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(httpStatus.UNPROCESSABLE_ENTITY);
      expect(mockResponse.send).toHaveBeenCalledWith(error.message);
    });
  });

  describe('when handling unchangedFieldsError', () => {
    it('should return 422 with error message', () => {
      const error = unchangedFieldsError();

      errorHandling(error, mockRequest as Request, mockResponse as Response, mockNext as NextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(httpStatus.UNPROCESSABLE_ENTITY);
      expect(mockResponse.send).toHaveBeenCalledWith(error.message);
    });
  });

  describe('when handling unknown error', () => {
    it('should return 500 with error message', () => {
      const error = new Error('Unknown error');

      errorHandling(error, mockRequest as Request, mockResponse as Response, mockNext as NextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(httpStatus.INTERNAL_SERVER_ERROR);
      expect(mockResponse.send).toHaveBeenCalledWith(error.message);
    });
  });
}); 