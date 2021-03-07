"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const winston_1 = require("winston");
const config_1 = __importDefault(require("config"));
const util_1 = require("util");
const winston_2 = __importDefault(require("winston"));
const DailyRotateFile = require("winston-daily-rotate-file");
require('winston-mongodb');
require('winston-daily-rotate-file');
const logsDb = config_1.default.get('logger.db.host');
const logsCollection = config_1.default.get('logger.collection');
exports.logger = winston_1.createLogger({
    level: 'debug',
    transports: createLoggerTransports(),
    exitOnError: false,
    format: winston_1.format.combine(winston_1.format.timestamp()),
});
/**
 *  @return {void}
 */
function createLoggerTransports() {
    const transports = [];
    // Save logs file to folders
    transports.push(new DailyRotateFile({
        filename: './logs/TechBase-Tracker-%DATE%.log',
        datePattern: 'YYYY-MM-DD-HH',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '14d',
        format: winston_1.format.combine(winston_1.format((info) => {
            const formatInfo = info;
            formatInfo.message = formatMsgByType(info.message);
            return formatInfo;
        })(), winston_1.format.json()),
    }));
    // Create console logs
    transports.push(new winston_2.default.transports.Console({
        level: 'debug',
        format: winston_1.format.combine(winston_1.format.printf((info) => {
            const formatInfo = info;
            formatInfo.message = formatMsgByType(info.message);
            const formattedDate = info.timestamp
                .replace('T', ' ')
                .replace('Z', '');
            return `${formattedDate}|${info.level}|${consoleOutLogsMsg(formatInfo.message)};`;
        })),
    }));
    // Save logs to mongo DB
    transports.push(
    // @ts-ignore
    new winston_2.default.transports.MongoDB({
        level: 'debug',
        db: logsDb,
        collection: logsCollection,
        format: winston_1.format.combine(winston_1.format.timestamp(), winston_1.format.json()),
    }));
    return transports;
}
/**
 * @param {String | Object} message
 * @return { Object }
 */
function formatMsgByType(message) {
    if (typeof message === 'string') {
        return { msg: message };
    }
    else if (typeof message === 'object') {
        return _formatObject(message);
    }
}
/**
 * @param {String | Object } msg
 * @return { Object }
 */
function consoleOutLogsMsg(msg) {
    if (!(msg instanceof Object))
        return msg;
    const output = _formatObject(msg);
    return util_1.inspect(output);
}
/**
 * @param {String | Object } msg
 * @return { Object }
 */
function _formatObject(msg) {
    const output = {};
    Object.keys(msg).forEach((key) => {
        if (msg[key] instanceof Error || key === 'error') {
            const _a = msg[key], { stack, message } = _a, meta = __rest(_a, ["stack", "message"]);
            output[key] = { message, meta, stack };
            return;
        }
        output[key] = msg[key];
    });
    return output;
}
exports.default = exports.logger;
