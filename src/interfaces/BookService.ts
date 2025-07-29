import Book from "@/models/book";

export interface BookService {
  createBook(bookData: Omit<Book, 'id'>): Promise<Book>;
} 