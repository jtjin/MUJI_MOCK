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
const { dbConnection } = require('../db/index');
const ProductModule_1 = require("../db/modules/ProductModule");
const ProductDetailsModule_1 = require("../db/modules/ProductDetailsModule");
const R = __importStar(require("ramda"));
const typeorm_1 = require("typeorm");
const Tags_1 = require("../infra/enums/Tags");
class ProductService {
    createProduct(reqVO) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('TagsEnum[reqVO.tag]==>', Tags_1.TagsEnum[reqVO.tag]);
            const productVO = Object.assign({ tag_id: Tags_1.TagsEnum[reqVO.tag] }, R.pick([
                'title',
                'description',
                'price',
                'texture',
                'wash',
                'place',
                'note',
                'story',
            ], reqVO));
            let productId;
            yield typeorm_1.getConnection('stylish').transaction((trans) => __awaiter(this, void 0, void 0, function* () {
                const productModule = new ProductModule_1.ProductModule(undefined, trans);
                const insertedResult = yield productModule.createProduct(productVO);
                productId = insertedResult.raw.insertId;
                if (typeof productId === 'number') {
                    const result = yield this.createProductDetails(Object.assign({ transaction: trans, productId }, R.pick(['colors', 'colorsName', 'sizes'], reqVO)));
                }
            }));
            return productId;
        });
    }
    createdPhotos(files, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { main_image, images } = files;
            const { productId } = body;
            const mainImagesValueArr = [];
            const imagesValueArr = [];
            main_image.forEach((image, index) => {
                mainImagesValueArr[index] = {
                    product_id: productId,
                    name: image.key.split('/')[1],
                    url: '/' + image.key,
                };
            });
            images.forEach((image, index) => {
                imagesValueArr[index] = {
                    product_id: productId,
                    name: image.key.split('/')[1],
                    url: '/' + image.key,
                };
            });
            yield index_1.default.imagesModule.createImages(imagesValueArr);
            yield index_1.default.mainImagesModule.createMainImages(mainImagesValueArr);
        });
    }
    createProductDetails(opt) {
        return __awaiter(this, void 0, void 0, function* () {
            const { transaction, productId, colors, colorsName, sizes } = opt;
            const productDetailModule = new ProductDetailsModule_1.ProductDetailsModule(undefined, transaction);
            const colorsArr = colors.split(',');
            const colorsNameArr = colorsName.split(',');
            const sizesArr = sizes.split(',');
            let productDetailVariants = [];
            colorsArr.forEach((color, colorsArrIndex) => {
                let temp = {
                    color_code: color,
                    name: colorsNameArr[colorsArrIndex],
                };
                sizesArr.forEach((size) => {
                    const detailVariant = Object.assign({}, temp);
                    detailVariant.size = size;
                    detailVariant.product_id = productId;
                    productDetailVariants.push(detailVariant);
                });
            });
            return yield productDetailModule.createProductDetails(productDetailVariants);
        });
    }
    getProductsListByTag(opt) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tag, titleLike, page = 1 } = opt;
            const productPO = yield index_1.default.productModule.getProductsByTag({
                tag,
                titleLike,
                pagination: {
                    offset: (Number(page) - 1) * 6,
                    limit: 6 + 1,
                },
            });
            // TODO: 存一份到 Redis
            const result = {};
            if (productPO.length === 6 + 1) {
                productPO.pop();
                result.next_paging = Number(page) + 1;
            }
            result.data = this._formatProductList(productPO);
            return result;
        });
    }
    _formatProductList(productPO) {
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
    getProductDetailById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const productPO = yield index_1.default.productModule.getProductDetailById(id);
            const result = { data: this._formatProductList(productPO)[0] };
            return result;
        });
    }
}
module.exports = new ProductService();
