import { CustomError } from "./CustomErorr";

export class DataBaseConnectionError extends CustomError {
  statusCode = 500;
  message = "Error connecting DB";
  constructor() {
    super("Error connecting to database", 500);
    Object.setPrototypeOf(this, DataBaseConnectionError.prototype);
  }
  serializeErrors() {
    return [{ message: this.message }];
  }
}
