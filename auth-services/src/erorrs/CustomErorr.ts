export abstract class CustomError extends Error {
  constructor(public message: string, public statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
  }
  abstract serializeErrors(): { message: string; field?: string }[];
}
