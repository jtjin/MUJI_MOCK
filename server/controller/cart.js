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
const cart_1 = __importDefault(require("../service/cart"));
const errorType_1 = require("../infra/enums/errorType");
const errorHandler_1 = require("../middleWares/errorHandler");
const logger_1 = __importDefault(require("../utils/logger"));
const tag = 'controller/admin/chatRoom';
class CartController {
    constructor() {
        this.getItemsByUserId = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.me.id;
                const cartList = yield cart_1.default.getItemsByUserId(userId);
                res.send({ result: 'success', data: cartList });
            }
            catch (error) {
                logger_1.default.error({ tag: tag + '/getItemsByUserId', error });
                next(error);
            }
        });
        this.createItemByUserId = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { productId, variantId, quantity } = req.body;
                if (!productId || !variantId || !quantity || !req.me)
                    throw new errorHandler_1.ErrorHandler(500, errorType_1.ErrorType.ClientError, 'Invalid Data');
                yield cart_1.default.createItems({
                    productId,
                    variantId,
                    quantity: Number(quantity),
                    userId: req.me.id,
                });
                res.send({ result: 'success' });
            }
            catch (error) {
                logger_1.default.error({ tag: tag + '/createItemByUserId', error });
                next(error);
            }
        });
        this.deleteItemById = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                // console.log('deleteItemById-->')
                // res.send({ result: 'success', data })
            }
            catch (error) {
                logger_1.default.error({ tag: tag + '/deleteItemById', error });
                next(error);
            }
        });
    }
}
module.exports = new CartController();
