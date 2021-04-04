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
exports.ProductModule = void 0;
const Product_1 = require("../entities/Product");
class ProductModule {
    constructor(opt) {
        const { client, transaction } = opt;
        this.client = client;
        if (transaction) {
            this.Repo = transaction.getRepository(Product_1.Product);
        }
        else if (this.client) {
            this.Repo = this.client.getRepository(Product_1.Product);
        }
        this.tag = 'productModule/';
    }
    getAllProducts() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.Repo.createQueryBuilder().getMany();
        });
    }
    getProductDetailById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.Repo.createQueryBuilder('product')
                .leftJoinAndSelect('product.variants', 'variants')
                .leftJoinAndSelect('product.images', 'images')
                .leftJoinAndSelect('product.main_image', 'main_image')
                .where('product.id = :id', {
                id,
            })
                .getOne();
        });
    }
    getProductsByTag(opt) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tagId, titleLike, pagination, orderBy, categoryId } = opt;
            let query = this.Repo.createQueryBuilder('product')
                .leftJoinAndSelect('product.variants', 'variants')
                .leftJoinAndSelect('product.images', 'images')
                .leftJoinAndSelect('product.main_image', 'main_image');
            if (categoryId) {
                query = query.where('product.category = :category', {
                    categoryId,
                });
            }
            if (tagId) {
                query = query.where('product.tag_id = :tagId', {
                    tagId,
                });
            }
            if (titleLike) {
                query = query.andWhere('product.title like :title', {
                    title: `%${titleLike}%`,
                });
            }
            if (orderBy) {
                const { sort = 'id', order = 'DESC' } = orderBy;
                query = query.orderBy(sort, order);
            }
            if (pagination) {
                const { limit, offset } = pagination;
                if (limit)
                    query = query.take(limit);
                if (offset)
                    query = query.take(limit).skip(offset);
            }
            const result = yield query.getMany();
            return result;
        });
    }
    createProduct(values) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('DB--> createProduct ->', values);
            return yield this.Repo.createQueryBuilder()
                .insert()
                .into(Product_1.Product)
                .values(values)
                .execute();
        });
    }
    updateProductById(opt) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, value } = opt;
            return yield this.Repo.createQueryBuilder()
                .update(Product_1.Product)
                .set(value)
                .where('id = :id', { id })
                .execute();
        });
    }
}
exports.ProductModule = ProductModule;
