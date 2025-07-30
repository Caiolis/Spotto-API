# Spotto Book API

A RESTful API for managing books built with Node.js, Express, and TypeScript. This project demonstrates the implementation of clean architecture, design patterns, and testing best practices.

## Features

- RESTful API endpoints for CRUD operations
- TypeScript for type safety
- Express.js framework
- In-memory data storage
- Comprehensive test suite
- Input validation using Joi
- Error handling middleware
- Factory and Repository patterns
- Dependency injection

## Project Structure

```
src/
  ├── controllers/     # Request handling
  ├── services/       # Business logic
  ├── repositories/   # Data access
  ├── models/        # Data models
  ├── interfaces/    # Type definitions
  ├── errors/        # Custom errors
  ├── middlewares/   # Express middlewares
  ├── schemas/       # Validation schemas
  ├── utils/         # Shared utilities
  ├── factories/     # Object creation
  ├── database/      # In-memory storage
  └── routes/        # API endpoints
```

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Caiolis/Spotto-API
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The server will start on `http://localhost:5000`

## API Endpoints

### Books

| Method | Endpoint     | Description           | Request Body | Success Response |
|--------|-------------|-----------------------|--------------|------------------|
| GET    | /books      | Get all books        | -            | 200 - Book[]     |
| GET    | /books/:id  | Get book by ID       | -            | 200 - Book       |
| POST   | /books      | Create a new book    | BookDTO      | 201 - Book       |
| PUT    | /books/:id  | Update entire book   | BookDTO      | 200 - Book       |
| PATCH  | /books/:id  | Update partial book  | Partial<BookDTO> | 200 - Book   |
| DELETE | /books/:id  | Delete a book        | -            | 200 - Message    |

### Request/Response Examples

#### Book DTO
```typescript
{
  title: string;
  author: string;
  publishedDate: string; // ISO date format
  genre: string;
}
```

#### Success Responses
```typescript
// GET /books
[
  {
    "id": "uuid",
    "title": "Book Title",
    "author": "Author Name",
    "publishedDate": "2024-01-01",
    "genre": "Fiction"
  }
]

// POST /books
{
  "id": "uuid",
  "title": "New Book",
  "author": "New Author",
  "publishedDate": "2024-01-01",
  "genre": "Non-fiction"
}
```

### Error Responses

| Status Code | Description           | Example Response |
|-------------|-----------------------|------------------|
| 400         | Bad Request          | { "error": "Book id is required." } |
| 404         | Not Found            | { "error": "Book not found with the given id." } |
| 417         | Expectation Failed   | { "error": "A book cannot be added if it is not currently published." } |
| 422         | Unprocessable Entity | { "error": "All fields are required to run a PUT request." } |
| 500         | Internal Server Error| { "error": "Internal server error" } |

## Testing

The project includes both unit and integration tests using Jest.

### Running Tests

```bash
# Run all tests
npm test

# Run unit tests only
npm run test:unit

# Run integration tests only
npm run test:integration

# Run tests with coverage
npm run test:coverage
```

### Test Coverage

Current test coverage:
```
File                    | % Stmts | % Branch | % Funcs | % Lines
------------------------|---------|----------|---------|--------
All files              |   92.3  |    100   |   100   |  91.35
```

## Design Patterns

### Factory Pattern
- `BookFactory` for creating book instances
- Centralized validation and ID generation

### Repository Pattern
- `BookRepository` interface for data access abstraction
- In-memory implementation with `MemoryBookRepository`

### Dependency Injection
- Services injected into controllers
- Repositories injected into services
- Facilitates testing and modularity

## Error Handling

Custom error types for different scenarios:
- `bookNotFoundError`
- `futureDateError`
- `missingIdError`
- `missingFieldsError`
- `unchangedFieldsError`

## Input Validation

- Schema validation using Joi
- Request validation middleware
- Custom validation in services

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Build TypeScript
npm run start        # Start production server
npm test            # Run all tests
npm run test:unit   # Run unit tests
npm run test:integration # Run integration tests
npm run test:coverage # Run tests with coverage
npm run lint        # Run ESLint
npm run lint:fix    # Fix ESLint issues
```