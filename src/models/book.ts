class Book {
  constructor(
    public id: string,
    public title: string,
    public author: string,
    public publishedDate: Date,
    public genre: string,
  ) {}
}

export default Book;