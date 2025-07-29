import Book from "@/models/book";

export interface BookRepository {
  post(book: Book): Promise<Book>;
  findAll(): Promise<Book[]>;
  findById(id: string): Promise<Book>;
  update(id: string, book: Omit<Book, 'id'>): Promise<Book>;
  patch(id: string, bookData: Partial<Omit<Book, 'id'>>): Promise<Book>;
  delete(id: string): Promise<void>;
} 