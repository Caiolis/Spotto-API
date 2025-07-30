import { faker } from '@faker-js/faker';
import booksDatabase from '../src/database/database';

faker.seed(123);
jest.setTimeout(10000);

beforeEach(() => {
  while (booksDatabase.length > 0) {
    booksDatabase.pop();
  }
}); 