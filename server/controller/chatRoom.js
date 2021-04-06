"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const chatRoom_1 = __importDefault(require("../service/admin/chatRoom"));
const logger_1 = __importDefault(require("../utils/logger"));
const tag = 'controller/admin/chatRoom';
class CharRoomController {
    constructor() {
        this.getChatRoomsListById = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.query.userId;
                const roomList = yield chatRoom_1.default.getChatRoomsListById(userId);
                console.log(roomList);
                res.send({ result: 'success', data: roomList });
            }
            catch (error) {
                logger_1.default.error({ tag: tag + '/getChatRoomsListById', error });
                next(error);
            }
        });
        this.getChatRoomHistory = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const room = req.params.room;
                const history = yield chatRoom_1.default.getChatRoomHistory(room);
                res.send({ result: 'success', data: history });
            }
            catch (error) {
                logger_1.default.error({ tag: tag + '/getChatRoomHistory', error });
                next(error);
            }
        });
        this.getPinMessages = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const adminId = req.me.id;
                const messages = yield chatRoom_1.default.getPinMessages({
                    adminId,
                });
                res.send({ result: 'success', data: messages });
            }
            catch (error) {
                logger_1.default.error({ tag: tag + '/getPinMessages', error });
                next(error);
            }
        });
        this.createPinMessage = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const adminId = req.me.id;
                const { message } = req.body;
                const data = yield chatRoom_1.default.createPinMessage({
                    adminId,
                    message,
                });
            }
            catch (error) {
                logger_1.default.error({ tag: tag + '/createPinMessage', error });
                next(error);
            }
        });
        this.deletePinMessage = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const adminId = req.me.id;
                const { message } = req.body;
                const data = yield chatRoom_1.default.deletePinMessage({
                    adminId,
                    message,
                });
            }
            catch (error) {
                logger_1.default.error({ tag: tag + '/deletePinMessage', error });
                next(error);
            }
        });
    }
}
module.exports = new CharRoomController();
