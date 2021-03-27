"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.rootPath = exports.getKeyValue = void 0;
const path_1 = __importDefault(require("path"));
const getKeyValue = (obj) => (key) => obj[key];
exports.getKeyValue = getKeyValue;
exports.rootPath = path_1.default.dirname((_b = (_a = require === null || require === void 0 ? void 0 : require.main) === null || _a === void 0 ? void 0 : _a.filename) !== null && _b !== void 0 ? _b : path_1.default.join(__dirname + '../..'));
