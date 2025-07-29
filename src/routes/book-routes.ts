import { Router } from 'express';
import { schemaValidation } from '@/middlewares/schemaValidation';
import bookSchema from '@/schemas/book-schema';
import { bookController } from '@/controllers/book-controller';

const bookRouter = Router();

bookRouter
  .post('/', schemaValidation(bookSchema), bookController.createBook)
  .get('/', bookController.getBooks)
  .get('/:id', bookController.getBookById);

export default bookRouter;