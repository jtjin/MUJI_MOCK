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
const index_1 = __importDefault(require("../db/index"));
const tag = 'server/service/cart';
class CartService {
    constructor() {
        this.tag = 'CartService';
    }
    getItemsByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield index_1.default.cartModule.getCartItemsByUserId(userId);
            }
            catch (error) {
                throw error;
            }
        });
    }
    createItems(opt) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { productId: product_id, variantId: variant_id, quantity, userId: user_id, } = opt;
                yield index_1.default.cartModule.insertOrUpdateCartItem({
                    user_id,
                    quantity,
                    variant_id,
                    product_id,
                });
            }
            catch (error) {
                throw error;
            }
        });
    }
    deleteItemById(opt) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, variantId, productId } = opt;
                const data = yield index_1.default.cartModule.deleteItemById({
                    variantId,
                    userId,
                    productId,
                });
                console.log(data);
            }
            catch (error) {
                throw error;
            }
        });
    }
    updateItemQuantityById(opt) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, variantId, productId, quantity } = opt;
                const data = yield index_1.default.cartModule.updateItemQuantityById({
                    variantId,
                    userId,
                    productId,
                    quantity,
                });
            }
            catch (error) {
                throw error;
            }
        });
    }
}
module.exports = new CartService();
