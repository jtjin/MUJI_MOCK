"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const ProductModule_1 = require("../db/modules/ProductModule");
const ProductDetailsModule_1 = require("../db/modules/ProductDetailsModule");
const ImagesModule_1 = require("../db/modules/ImagesModule");
const MainImagesModule_1 = require("../db/modules/MainImagesModule");
const R = __importStar(require("ramda"));
const typeorm_1 = require("typeorm");
const Tags_1 = require("../infra/enums/Tags");
const CategoryEnum_1 = require("../infra/enums/CategoryEnum");
const redisDb_1 = require("../db/redisDb");
const safeAsync_1 = require("../utils/safeAsync");
const customErrors_1 = require("../infra/customErrors");
const errorType_1 = require("../infra/enums/errorType");
const errorHandler_1 = require("../middleWares/errorHandler");
const tag = 'server/product';
class ProductService {
    constructor() {
        this.tag = 'ProductService';
    }
    getProductsListByTag(opt) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tagId, titleLike, page = 1 } = opt;
            try {
                const [_error, resultCache] = yield safeAsync_1.safeAwait(redisDb_1.redisClient.get(`product:${tagId}:${titleLike}:${page}`), tag + this.tag + '/getProductsListByTag/redis');
                if (resultCache)
                    return JSON.parse(String(resultCache));
                const productPO = yield index_1.default.productModule.getProductsByTag({
                    tagId,
                    titleLike,
                    pagination: {
                        offset: (Number(page) - 1) * 6,
                        limit: 6 + 1,
                    },
                });
                const result = {};
                if (productPO.length === 6 + 1) {
                    productPO.pop();
                    result.next_paging = Number(page) + 1;
                }
                result.data = this._formatProductList(productPO);
                if (!result.data)
                    return;
                yield safeAsync_1.safeAwait(redisDb_1.redisClient.set(`product:${tagId}:${titleLike}:${page}`, JSON.stringify(result)), tag + this.tag + '/getProductsListByTag/redis');
                return result;
            }
            catch (error) { }
        });
    }
    getProductDetailById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resultCache = yield redisDb_1.redisClient.get(`product:detail:${id}`);
                if (resultCache)
                    return JSON.parse(String(resultCache));
                const productPO = yield index_1.default.productModule.getProductDetailById(id);
                if (!productPO)
                    throw new Error(customErrors_1.customErrors.PRODUCT_NOT_FOUND.type);
                const result = JSON.stringify(this._formatProductList([productPO])[0]);
                yield redisDb_1.redisClient.set(`product:detail:${id}`, result);
                return result;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getPhotosByProductId(productId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return {
                    images: yield index_1.default.imagesModule.getImagesById(productId),
                    main_image: yield index_1.default.mainImagesModule.getMainImagesById(productId),
                };
            }
            catch (error) {
                throw error;
            }
        });
    }
    createProduct(reqVO, files) {
        return __awaiter(this, void 0, void 0, function* () {
            const productVO = Object.assign({ tag_id: Tags_1.TagsEnum[reqVO.tag], spec: reqVO.spec.join(','), category: CategoryEnum_1.CategoryEnum[reqVO.category], variants: JSON.parse(reqVO.variants) }, R.pick(['title', 'description', 'texture', 'wash', 'place', 'note', 'story'], reqVO));
            let productId, productDetailId;
            try {
                yield typeorm_1.getConnection('stylish').transaction((trans) => __awaiter(this, void 0, void 0, function* () {
                    const productModule = new ProductModule_1.ProductModule({ transaction: trans });
                    const insertedResult = yield productModule.createProduct(productVO);
                    productId = insertedResult.raw.insertId;
                    if (!productId)
                        throw new errorHandler_1.ErrorHandler(500, errorType_1.ErrorType.DatabaseError, 'Fail to create product...');
                    productVO.variants.forEach((variant) => {
                        variant.product_id = productId;
                    });
                    productDetailId = yield this._createProductDetails({
                        transaction: trans,
                        variants: productVO.variants,
                    });
                    if (!productDetailId)
                        throw new errorHandler_1.ErrorHandler(500, errorType_1.ErrorType.DatabaseError, 'Fail to create product details...');
                    yield this._createdPhotos({ transaction: trans, productId, files });
                }));
                this._delProductCacheByTag({
                    category: CategoryEnum_1.CategoryEnum[reqVO.category],
                    tag: Tags_1.TagsEnum[reqVO.tag],
                });
                if (!productId || !productDetailId)
                    return;
                return { productId };
            }
            catch (error) {
                throw error;
            }
        });
    }
    _createProductDetails(opt) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { transaction, variants } = opt;
                const productDetailModule = new ProductDetailsModule_1.ProductDetailsModule({ transaction });
                const insertedResult = yield productDetailModule.createProductDetails(variants);
                return insertedResult.raw.insertId;
            }
            catch (error) {
                throw error;
            }
        });
    }
    _createdPhotos(opt) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { transaction, productId, files } = opt;
                const { main_image, images } = files;
                const mainImagesValueArr = [];
                const imagesValueArr = [];
                main_image.forEach((image, index) => {
                    mainImagesValueArr[index] = {
                        product_id: productId,
                        name: 'main_image-' + index + '.' + image.key.split('.')[1],
                        url: '/' + image.key,
                    };
                });
                images.forEach((image, index) => {
                    imagesValueArr[index] = {
                        product_id: productId,
                        name: 'images-' + index + '.' + image.key.split('.')[1],
                        url: '/' + image.key,
                    };
                });
                const imagesModule = new ImagesModule_1.ImagesModule({ transaction });
                const mainImagesModule = new MainImagesModule_1.MainImagesModule({ transaction });
                yield imagesModule.createImages(imagesValueArr);
                yield mainImagesModule.createMainImages(mainImagesValueArr);
            }
            catch (error) {
                throw error;
            }
        });
    }
    _delProductCacheByTag(opt) {
        return __awaiter(this, void 0, void 0, function* () {
            const { category, tag } = opt;
            try {
                const productCacheKeys = yield redisDb_1.redisClient.keys(`product:${category}:${tag}:*`);
                // @ts-ignore
                productCacheKeys.forEach((key) => {
                    redisDb_1.redisClient.del(key);
                });
            }
            catch (error) {
                throw error;
            }
        });
    }
    updateMainImageById(opt) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield index_1.default.mainImagesModule.updateMainImageById(opt);
            }
            catch (error) {
                throw error;
            }
        });
    }
    updateImageById(opt) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield index_1.default.imagesModule.updateImageById(opt);
            }
            catch (error) {
                throw error;
            }
        });
    }
    _formatProductList(productPO) {
        try {
            return productPO.map((productPO) => {
                const formatPO = Object.assign(Object.assign({}, productPO), { colors: [], sizes: [] });
                const colorsMapped = {};
                const sizeMapped = {};
                formatPO.images = productPO.images.map((image) => image.url);
                formatPO.main_image = productPO.main_image.url;
                formatPO.variants = productPO.variants.map((variant) => {
                    if (!colorsMapped[variant.color_code]) {
                        formatPO.colors.push({
                            code: variant.color_code,
                            name: variant.name,
                        });
                        colorsMapped[variant.color_code] = variant.color_code;
                    }
                    if (!sizeMapped[variant.size]) {
                        formatPO.sizes.push(variant.size);
                        sizeMapped[variant.size] = variant.size;
                    }
                    return R.pick(['color_code', 'size', 'stock'], variant);
                });
                return formatPO;
            });
        }
        catch (error) {
            throw error;
        }
    }
}
module.exports = new ProductService();
