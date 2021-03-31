"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketIoInit = exports.io = void 0;
const socket_io_1 = __importDefault(require("socket.io"));
// import registerOrderHandlers from './handlers/orderHandler'
const userHandler_1 = __importDefault(require("./handlers/userHandler"));
const socketIoInit = (server) => {
    try {
        exports.io = socket_io_1.default(server);
        const onConnection = (socket) => {
            socket.on('heartbeat', (where) => {
                console.log(`--- ${where} WebSocket heartbeat ---`);
            });
            socket.on('sendMainPagePopAd', (msg) => {
                exports.io.emit('getMainPagePopAd', msg);
            });
            // registerOrderHandlers(io, socket)
            new userHandler_1.default(exports.io, socket);
        };
        exports.io.on('connection', onConnection);
    }
    catch (error) {
        throw error;
    }
};
exports.socketIoInit = socketIoInit;
