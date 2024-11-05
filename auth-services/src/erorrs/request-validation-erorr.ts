import { CustomError } from "./CustomErorr";

export class RequestValidationError extends CustomError {
  public message: string = "Invalid request parameters";
  public statusCode: number = 400;

  constructor() {
    super("Invalid request parameters", 400);
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors() {
    return [{ message: "Invalid request parameters" }];
  }
}
