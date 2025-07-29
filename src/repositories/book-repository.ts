import booksDatabase from "@/database/database";
import Book from "@/models/book";

export class BookRepository {
  post(book: Book): Book {
    booksDatabase.push(book);
    return book;
  }
};

export const bookRepository = new BookRepository();