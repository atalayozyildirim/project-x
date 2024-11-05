"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestValidationError = void 0;
const CustomErorr_1 = require("./CustomErorr");
class RequestValidationError extends CustomErorr_1.CustomError {
    constructor() {
        super("Invalid request parameters", 400);
        this.message = "Invalid request parameters";
        this.statusCode = 400;
        Object.setPrototypeOf(this, RequestValidationError.prototype);
    }
    serializeErrors() {
        return [{ message: "Invalid request parameters" }];
    }
}
exports.RequestValidationError = RequestValidationError;
