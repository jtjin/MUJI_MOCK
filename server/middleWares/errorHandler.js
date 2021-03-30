"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError = exports.ErrorHandler = void 0;
const customErrors_1 = require("../infra/customErrors");
const util_1 = require("util");
const logger_1 = __importDefault(require("../utils/logger"));
class ErrorHandler extends Error {
    constructor(statusCode, errorType, message) {
        super();
        this.statusCode = statusCode;
        this.errorType = errorType;
        this.message = util_1.inspect(message);
    }
}
exports.ErrorHandler = ErrorHandler;
const handleError = (err, _req, res, _next) => {
    const { statusCode, errorType, message } = err;
    const returnCustomError = customErrors_1.customErrors[err.message] ||
        customErrors_1.customErrors.INTERNAL_SERVER_ERROR;
    const data = err.data ? err.data : message;
    try {
        res.status(statusCode ||
            returnCustomError.status ||
            customErrors_1.customErrors.INTERNAL_SERVER_ERROR.status);
        res.send({
            result: 'fail',
            error: { type: errorType || returnCustomError.type, data },
        });
    }
    catch (err) {
        console.log(err);
        logger_1.default.error({ tag: 'server/utils/handleError', error: err });
    }
};
exports.handleError = handleError;
