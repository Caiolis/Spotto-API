import Book from '@/models/book';
import Joi from 'joi';

const bookPatchSchema = Joi.object<Partial<Book>>({
  title: Joi.string(),
  author: Joi.string(),
  publishedDate: Joi.date(),
  genre: Joi.string()
}).min(1);

export default bookPatchSchema; 