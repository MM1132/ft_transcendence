export class QueryError extends Error {
  code: string;

  constructor(message: string, code: string) {
    super(message);
    this.code = code;
  }
}

export class DuplicateDataError extends QueryError {
  constructor(message: string) {
    super(message, '23505');
  }
}
