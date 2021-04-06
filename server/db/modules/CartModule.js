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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartModule = void 0;
const Cart_1 = require("../entities/Cart");
class CartModule {
    constructor(opt) {
        const { client, transaction } = opt;
        this.client = client;
        if (transaction) {
            this.Repo = transaction.getRepository(Cart_1.Cart);
        }
        else if (this.client) {
            this.Repo = this.client.getRepository(Cart_1.Cart);
        }
        this.tag = 'productModule/';
    }
    getCartItemsByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.Repo.createQueryBuilder('cart')
                .leftJoinAndSelect('cart.variant_id', 'variant_id')
                .leftJoinAndSelect('cart.product_id', 'product_id')
                .where('user_id = :userId', {
                userId,
            })
                .getMany();
        });
    }
    getCartItemsById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.Repo.createQueryBuilder('cart')
                .leftJoinAndSelect('cart.variant_id', 'variant_id')
                .leftJoinAndSelect('cart.product_id', 'product_id')
                .where('user_id = :userId', {
                userId,
            })
                .getMany();
        });
    }
    insertOrUpdateCartItem(value) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { user_id, quantity, variant_id, product_id } = value;
                const result = yield this.Repo.createQueryBuilder('cart')
                    .update(Cart_1.Cart)
                    .where('user_id = :user_id', { user_id })
                    .andWhere('product_detail_id = :variant_id', { variant_id })
                    .andWhere('product_id = :product_id', { product_id })
                    .set({ quantity: () => `quantity + ${quantity}` })
                    .execute();
                if (!result.raw.affectedRows) {
                    return yield this.Repo.createQueryBuilder()
                        .insert()
                        .into(Cart_1.Cart)
                        .values([value])
                        .execute();
                }
                return result;
            }
            catch (error) {
                throw error;
            }
        });
    }
    deleteItemById(opt) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { variantId, userId, productId } = opt;
                return yield this.Repo.createQueryBuilder()
                    .delete()
                    .from(Cart_1.Cart)
                    .where('user_id = :userId', {
                    userId,
                })
                    .andWhere('variant_id = :variantId', {
                    variantId,
                })
                    .andWhere('product_id = :productId', {
                    productId,
                })
                    .execute();
            }
            catch (error) {
                throw error;
            }
        });
    }
    updateItemQuantityById(opt) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, quantity, variantId, productId } = opt;
                return yield this.Repo.createQueryBuilder('cart')
                    .update(Cart_1.Cart)
                    .where('user_id = :userId', { userId })
                    .andWhere('product_detail_id = :variantId', { variantId })
                    .andWhere('product_id = :productId', { productId })
                    .set({ quantity: () => `quantity + ${quantity}` })
                    .execute();
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.CartModule = CartModule;
