import Book from "@/models/book";

export interface BookRepository {
  post(book: Book): Promise<Book>;
  findAll(): Promise<Book[]>;
  findById(id: string): Promise<Book>;
} 