import { Request, Response } from 'express';
import Book from '@/models/book';
import httpStatus from 'http-status';
import { BookService } from '@/interfaces/BookService';
import { bookService } from '@/services/book-service';

export class BookController {
  constructor(private service: BookService = bookService) {}

  createBook = async (req: Request, res: Response) => {
    const { title, author, publishedDate, genre } = req.body as Book;
    const input = await this.service.createBook({ title, author, publishedDate, genre } as Book);

    return res.status(httpStatus.CREATED).send(input);
  }
};

export const bookController = new BookController();