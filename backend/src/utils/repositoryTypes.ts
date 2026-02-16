export class QueryError extends Error {
  code: string;
  detail: string;

  constructor(data: { message: string; code: string; detail: string }) {
    super(data.message);
    this.code = data.code;
    this.detail = data.detail;
  }
}

export class DuplicateDataError extends QueryError {}
