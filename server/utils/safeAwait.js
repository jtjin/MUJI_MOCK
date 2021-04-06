"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.safeAwait = void 0;
const logger_1 = __importDefault(require("./logger"));
const nativeExceptions = [
    EvalError,
    RangeError,
    ReferenceError,
    SyntaxError,
    TypeError,
    URIError,
].filter((except) => typeof except === 'function');
function throwNative(error, tag) {
    for (const Exception of nativeExceptions) {
        if (error instanceof Exception) {
            throw error;
        }
    }
}
function safeAwait(promise, tag, finallyFunc) {
    return promise
        .then((data) => {
        if (data instanceof Error) {
            throwNative(data, tag);
            logger_1.default.error({ tag, data });
            return [data];
        }
        return [undefined, data];
    })
        .catch((error) => {
        throwNative(error, tag);
        logger_1.default.error({ tag, error });
        return [error];
    })
        .finally(() => {
        if (finallyFunc && typeof finallyFunc === 'function') {
            finallyFunc();
        }
    });
}
exports.safeAwait = safeAwait;
