import Book from "@/models/book";

export interface BookService {
  createBook(bookData: Omit<Book, 'id'>): Promise<Book>;
  getBooks(): Promise<Book[]>;
  getBookById(id: string): Promise<Book>;
  updateBook(id: string, bookData: Omit<Book, 'id'>): Promise<Book>;
  patchBook(id: string, bookData: Partial<Omit<Book, 'id'>>): Promise<Book>;
  deleteBook(id: string): Promise<void>;
} 