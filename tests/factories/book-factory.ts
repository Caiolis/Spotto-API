import { faker } from '@faker-js/faker';
import Book from '../../src/models/book';

export type CreateBookDTO = Omit<Book, 'id'>;
export type PartialBookDTO = Partial<Omit<Book, 'id'>>;

export class TestBookFactory {
  static createValidBook(overrides: Partial<CreateBookDTO> = {}): CreateBookDTO {
    const pastDate = faker.date.past();
    pastDate.setHours(0, 0, 0, 0);

    return {
      title: faker.lorem.words(3),
      author: faker.person.fullName(),
      publishedDate: pastDate,
      genre: faker.word.sample(),
      ...overrides
    };
  }

  static createFutureBook(overrides: Partial<CreateBookDTO> = {}): CreateBookDTO {
    const futureDate = faker.date.future();
    futureDate.setHours(0, 0, 0, 0);

    return this.createValidBook({
      publishedDate: futureDate,
      ...overrides
    });
  }

  static createPartialBook(): PartialBookDTO {
    const fields: (keyof CreateBookDTO)[] = ['title', 'author', 'publishedDate', 'genre'];
    const randomField = faker.helpers.arrayElement(fields);
    
    switch (randomField) {
      case 'title':
        return { title: faker.lorem.words(3) };
      case 'author':
        return { author: faker.person.fullName() };
      case 'publishedDate': {
        const pastDate = faker.date.past();
        pastDate.setHours(0, 0, 0, 0);
        return { publishedDate: pastDate };
      }
      case 'genre':
        return { genre: faker.word.sample() };
      default:
        return { title: faker.lorem.words(3) };
    }
  }
} 