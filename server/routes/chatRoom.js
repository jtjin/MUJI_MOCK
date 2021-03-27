"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chatRoom_1 = __importDefault(require("../controller/chatRoom"));
const express_1 = require("express");
const router = express_1.Router();
router.get('/admin/chatRoomList/:userId', chatRoom_1.default.getChatRoomsListById);
router.get('/chatRoom/history/:room', chatRoom_1.default.getChatRoomHistory);
router.get('/admin/chatRoom/pin/:adminId', chatRoom_1.default.getPinMessages);
router.post('/admin/chatRoom/pin/:adminId', chatRoom_1.default.createPinMessage);
router.delete('/admin/chatRoom/pin/:adminId', chatRoom_1.default.deletePinMessage);
module.exports = router;
