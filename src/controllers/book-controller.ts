import { Request, Response } from 'express';
import Book from '@/models/book';
import httpStatus from 'http-status';
import { BookService } from '@/interfaces/BookService';
import { bookService } from '@/services/book-service';
import { missingIdError } from '@/errors/missing-id-error';

export class BookController {
  constructor(private service: BookService = bookService) {}

  createBook = async (req: Request, res: Response) => {
    const { title, author, publishedDate, genre } = req.body as Book;
    const input = await this.service.createBook({ title, author, publishedDate, genre } as Book);
    return res.status(httpStatus.CREATED).send(input);
  }

  getBooks = async (_req: Request, res: Response) => {
    const books = await this.service.getBooks();
    return res.status(httpStatus.OK).send(books);
  }

  getBookById = async (req: Request, res: Response) => {
    const id = req.params['id'];
    if (!id) throw missingIdError();
    
    const book = await this.service.getBookById(id);
    return res.status(httpStatus.OK).send(book);
  }

  updateBook = async (req: Request, res: Response) => {
    const id = req.params['id'];
    if (!id) throw missingIdError();

    const { title, author, publishedDate, genre } = req.body as Book;
    const book = await this.service.updateBook(id, { title, author, publishedDate, genre });
    return res.status(httpStatus.OK).send(book);
  }

  patchBook = async (req: Request, res: Response) => {
    const id = req.params['id'];
    if (!id) throw missingIdError();

    const book = await this.service.patchBook(id, req.body);
    return res.status(httpStatus.OK).send(book);
  }
}

export const bookController = new BookController();