"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (err, req, res, next) => {
    console.error("errorr");
    res.status(500).send("Something went wrong!");
};
exports.errorHandler = errorHandler;
