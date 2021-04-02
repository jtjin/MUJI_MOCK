"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const logsRootPath = path_1.default.join(__dirname, '../logs/');
const logsFile = fs_1.default.readdirSync(logsRootPath);
logsFile.forEach((file) => {
    fs_1.default.stat(logsRootPath + file, (err, stats) => {
        if (err) {
            throw err;
        }
        console.log(logsRootPath + file);
        if (stats.mtimeMs < Date.now() - 24 * 60 * 60 * 3 * 1000) {
            fs_1.default.unlinkSync(logsRootPath + file);
        }
    });
});
