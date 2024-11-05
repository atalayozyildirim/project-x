"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataBaseConnectionError = void 0;
const CustomErorr_1 = require("./CustomErorr");
class DataBaseConnectionError extends CustomErorr_1.CustomError {
    constructor() {
        super("Error connecting to database", 500);
        this.statusCode = 500;
        this.message = "Error connecting DB";
        Object.setPrototypeOf(this, DataBaseConnectionError.prototype);
    }
    serializeErrors() {
        return [{ message: this.message }];
    }
}
exports.DataBaseConnectionError = DataBaseConnectionError;
