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
                .where('user_id = :userId', {
                userId,
            })
                .getMany();
        });
    }
    insertCartItem(values) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.Repo.createQueryBuilder()
                .insert()
                .into(Cart_1.Cart)
                .values(values)
                .execute();
        });
    }
    deleteItemById(opt) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, userId } = opt;
            return yield this.Repo.createQueryBuilder()
                .delete()
                .from(Cart_1.Cart)
                .where('user_id = :userId', {
                userId,
            })
                .andWhere('id = :id', {
                id,
            })
                .execute();
        });
    }
}
exports.CartModule = CartModule;
