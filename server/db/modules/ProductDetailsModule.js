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
exports.ProductDetailsModule = void 0;
const ProductDetails_1 = require("../entities/ProductDetails");
class ProductDetailsModule {
    constructor(opt) {
        const { client, transaction } = opt;
        this.client = client;
        if (transaction) {
            this.Repo = transaction.getRepository(ProductDetails_1.ProductDetails);
        }
        else if (this.client) {
            this.Repo = this.client.getRepository(ProductDetails_1.ProductDetails);
        }
        this.tag = 'productModule/';
    }
    getAllProductDetails() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.Repo.createQueryBuilder().getMany();
            }
            catch (error) {
                throw error;
            }
        });
    }
    getProductVariantById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.Repo.createQueryBuilder()
                    .where('id = :id', {
                    id,
                })
                    .getOne();
            }
            catch (error) {
                throw error;
            }
        });
    }
    createProductDetails(values) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.Repo.createQueryBuilder()
                    .insert()
                    .into(ProductDetails_1.ProductDetails)
                    .values(values)
                    .execute();
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.ProductDetailsModule = ProductDetailsModule;
