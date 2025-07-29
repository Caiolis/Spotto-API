import Book from '@/models/book';
import Joi from 'joi';

const bookSchema = Joi.object<Book>({
  title: Joi.string().required(),
  author: Joi.string().required(),
  publishedDate: Joi.date().required(),
  genre: Joi.string().required(),
});

export default bookSchema;