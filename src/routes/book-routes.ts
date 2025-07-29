import { Router } from 'express';
import { schemaValidation } from '@/middlewares/schemaValidation';
import bookSchema from '@/schemas/book-schema';
import bookPatchSchema from '@/schemas/book-patch-schema';
import { bookController } from '@/controllers/book-controller';

const bookRouter = Router();

bookRouter
  .post('/', schemaValidation(bookSchema), bookController.createBook)
  .get('/', bookController.getBooks)
  .get('/:id', bookController.getBookById)
  .put('/:id', schemaValidation(bookSchema), bookController.updateBook)
  .patch('/:id', schemaValidation(bookPatchSchema), bookController.patchBook);

export default bookRouter;