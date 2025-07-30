import { Request, Response, NextFunction } from 'express';
import { schemaValidation } from '../../../src/middlewares/schemaValidation';
import Joi from 'joi';
import httpStatus from 'http-status';

describe('schemaValidation middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock;
  let schema: Joi.ObjectSchema;

  beforeEach(() => {
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();

    schema = Joi.object({
      title: Joi.string().required(),
      author: Joi.string().required(),
      publishedDate: Joi.date().required(),
      genre: Joi.string().required()
    });
  });

  describe('when validating request body', () => {
    it('should call next when validation passes', () => {
      const validBody = {
        title: 'Test Book',
        author: 'Test Author',
        publishedDate: new Date().toISOString(),
        genre: 'Test Genre'
      };
      mockRequest = { body: validBody };

      schemaValidation(schema)(mockRequest as Request, mockResponse as Response, mockNext as NextFunction);

      expect(mockNext).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.send).not.toHaveBeenCalled();
    });

    it('should return 422 when required field is missing', () => {
      const invalidBody = {
        title: 'Test Book',
        author: 'Test Author',
        genre: 'Test Genre'
      };
      mockRequest = { body: invalidBody };

      schemaValidation(schema)(mockRequest as Request, mockResponse as Response, mockNext as NextFunction);

      expect(mockNext).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(httpStatus.UNPROCESSABLE_ENTITY);
      expect(mockResponse.send).toHaveBeenCalledWith({ error: '"publishedDate" is required' });
    });

    it('should return 422 when field has wrong type', () => {
      const invalidBody = {
        title: 'Test Book',
        author: 'Test Author',
        publishedDate: 'not-a-date',
        genre: 'Test Genre'
      };
      mockRequest = { body: invalidBody };

      schemaValidation(schema)(mockRequest as Request, mockResponse as Response, mockNext as NextFunction);

      expect(mockNext).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(httpStatus.UNPROCESSABLE_ENTITY);
      expect(mockResponse.send).toHaveBeenCalledWith({ error: '"publishedDate" must be a valid date' });
    });

    it('should return 422 when body is empty', () => {
      mockRequest = { body: {} };

      schemaValidation(schema)(mockRequest as Request, mockResponse as Response, mockNext as NextFunction);

      expect(mockNext).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(httpStatus.UNPROCESSABLE_ENTITY);
      expect(mockResponse.send).toHaveBeenCalledWith({ error: '"title" is required' });
    });
  });
}); 