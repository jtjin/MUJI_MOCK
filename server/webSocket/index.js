"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = exports.io = void 0;
const socket_io_1 = __importDefault(require("socket.io"));
const init = (server) => {
    // @ts-ignore
    exports.io = socket_io_1.default(server);
    exports.io.on('connection', (socket) => {
        socket.on('heartbeat', () => {
            console.log('TackBase webSocket is connected ... ');
        });
        socket.on('NewOrder', (data) => {
            exports.io.emit('freshDashBoard');
        });
        console.log(`--- WebSocket Connected ---`);
    });
};
exports.init = init;
