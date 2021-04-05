"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cart_1 = __importDefault(require("../controller/cart"));
const express_1 = require("express");
const authorization_1 = require("../middleWares/authorization");
const router = express_1.Router();
router.get('/user/cart/', authorization_1.isAuth, cart_1.default.getItemsByUserId);
router.post('/user/cart', authorization_1.isAuth, cart_1.default.createItemByUserId);
router.delete('/user/cart', authorization_1.isAuth, cart_1.default.deleteItemById);
router.put('/user/cart', authorization_1.isAuth, cart_1.default.updateItemQuantity);
module.exports = router;
