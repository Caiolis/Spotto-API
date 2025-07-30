import { faker } from '@faker-js/faker';
import booksDatabase from '../src/database/database';

// Set a fixed seed for faker to make tests deterministic
faker.seed(123);

// Clear timeout for long-running tests
jest.setTimeout(10000);

// Clear the database before each test
beforeEach(() => {
  while (booksDatabase.length > 0) {
    booksDatabase.pop();
  }
}); 