import request from 'supertest';
import app from '../../src/app';
import httpStatus from 'http-status';
import { TestBookFactory } from '../factories/book-factory';
import { RequestHelper } from '../helpers/request-helper';
import booksDatabase from '../../src/database/database';

describe('Book API Tests', () => {
  beforeEach(() => {
    while (booksDatabase.length > 0) {
      booksDatabase.pop();
    }
  });

  describe('POST /books', () => {
    it('should create a book with valid data', async () => {
      const validBook = TestBookFactory.createValidBook();
      const response = await request(app)
        .post('/books')
        .send(RequestHelper.formatBookData(validBook));

      expect(response.status).toBe(httpStatus.CREATED);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toMatchObject(RequestHelper.formatBookData(validBook));
    });

    it('should not create a book with future date', async () => {
      const futureBook = TestBookFactory.createFutureBook();
      const response = await request(app)
        .post('/books')
        .send(RequestHelper.formatBookData(futureBook));

      expect(response.status).toBe(httpStatus.EXPECTATION_FAILED);
      expect(response.text).toBe('A book cannot be added if it is not currently published.');
    });

    it('should not create a book with missing fields', async () => {
      const invalidBook = { title: TestBookFactory.createValidBook().title };
      const response = await request(app)
        .post('/books')
        .send(invalidBook);

      expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
    });
  });

  describe('GET /books', () => {
    it('should return empty array when no books exist', async () => {
      const response = await request(app).get('/books');

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual([]);
    });

    it('should return all books', async () => {
      const validBook = TestBookFactory.createValidBook();
      await request(app)
        .post('/books')
        .send(RequestHelper.formatBookData(validBook));

      const response = await request(app).get('/books');

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toHaveLength(1);
      expect(response.body[0]).toMatchObject(RequestHelper.formatBookData(validBook));
    });
  });

  describe('GET /books/:id', () => {
    it('should return a book if it exists', async () => {
      const validBook = TestBookFactory.createValidBook();
      const createResponse = await request(app)
        .post('/books')
        .send(RequestHelper.formatBookData(validBook));

      const response = await request(app)
        .get(`/books/${createResponse.body.id}`);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toMatchObject(RequestHelper.formatBookData(validBook));
    });

    it('should return 404 if book does not exist', async () => {
      const response = await request(app)
        .get('/books/nonexistent-id');

      expect(response.status).toBe(httpStatus.NOT_FOUND);
      expect(response.text).toBe('Book not found with the given id.');
    });
  });

  describe('PUT /books/:id', () => {
    it('should update a book with valid data', async () => {
      const originalBook = TestBookFactory.createValidBook();
      const createResponse = await request(app)
        .post('/books')
        .send(RequestHelper.formatBookData(originalBook));

      const updatedBook = TestBookFactory.createValidBook();
      const response = await request(app)
        .put(`/books/${createResponse.body.id}`)
        .send(RequestHelper.formatBookData(updatedBook));

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toMatchObject(RequestHelper.formatBookData(updatedBook));
    });

    it('should not update with future date', async () => {
      const originalBook = TestBookFactory.createValidBook();
      const createResponse = await request(app)
        .post('/books')
        .send(RequestHelper.formatBookData(originalBook));

      const futureBook = TestBookFactory.createFutureBook();
      const response = await request(app)
        .put(`/books/${createResponse.body.id}`)
        .send(RequestHelper.formatBookData(futureBook));

      expect(response.status).toBe(httpStatus.EXPECTATION_FAILED);
    });

    it('should not update with missing fields', async () => {
      const originalBook = TestBookFactory.createValidBook();
      const createResponse = await request(app)
        .post('/books')
        .send(RequestHelper.formatBookData(originalBook));

      const invalidBook = { title: TestBookFactory.createValidBook().title };
      const response = await request(app)
        .put(`/books/${createResponse.body.id}`)
        .send(invalidBook);

      expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
    });

    it('should not update with unchanged data', async () => {
      const originalBook = TestBookFactory.createValidBook();
      const formattedBook = RequestHelper.formatBookData(originalBook);
      const createResponse = await request(app)
        .post('/books')
        .send(formattedBook);

      const response = await request(app)
        .put(`/books/${createResponse.body.id}`)
        .send(formattedBook);

      expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
      expect(response.text).toBe('To update a book, at least one field must be different from the current value.');
    });
  });

  describe('PATCH /books/:id', () => {
    it('should partially update a book', async () => {
      const originalBook = TestBookFactory.createValidBook();
      const createResponse = await request(app)
        .post('/books')
        .send(RequestHelper.formatBookData(originalBook));

      const partialUpdate = TestBookFactory.createPartialBook();
      const formattedUpdate = RequestHelper.formatBookData(partialUpdate);

      const response = await request(app)
        .patch(`/books/${createResponse.body.id}`)
        .send(formattedUpdate);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toMatchObject({
        ...RequestHelper.formatBookData(originalBook),
        ...formattedUpdate
      });
    });

    it('should not update with future date', async () => {
      const originalBook = TestBookFactory.createValidBook();
      const createResponse = await request(app)
        .post('/books')
        .send(RequestHelper.formatBookData(originalBook));

      const futureBook = TestBookFactory.createFutureBook();
      const response = await request(app)
        .patch(`/books/${createResponse.body.id}`)
        .send({ publishedDate: RequestHelper.formatBookData(futureBook).publishedDate });

      expect(response.status).toBe(httpStatus.EXPECTATION_FAILED);
    });

    it('should not update with unchanged data', async () => {
      const originalBook = TestBookFactory.createValidBook();
      const formattedBook = RequestHelper.formatBookData(originalBook);
      const createResponse = await request(app)
        .post('/books')
        .send(formattedBook);

      const unchangedField = { title: formattedBook.title };
      const response = await request(app)
        .patch(`/books/${createResponse.body.id}`)
        .send(unchangedField);

      expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
      expect(response.text).toBe('To update a book, at least one field must be different from the current value.');
    });
  });

  describe('DELETE /books/:id', () => {
    it('should delete an existing book', async () => {
      const validBook = TestBookFactory.createValidBook();
      const createResponse = await request(app)
        .post('/books')
        .send(RequestHelper.formatBookData(validBook));

      const response = await request(app)
        .delete(`/books/${createResponse.body.id}`);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual({ message: 'Book successfully deleted' });

      const getResponse = await request(app)
        .get(`/books/${createResponse.body.id}`);
      expect(getResponse.status).toBe(httpStatus.NOT_FOUND);
    });

    it('should return 404 when deleting non-existent book', async () => {
      const response = await request(app)
        .delete('/books/nonexistent-id');

      expect(response.status).toBe(httpStatus.NOT_FOUND);
      expect(response.text).toBe('Book not found with the given id.');
    });
  });
}); 