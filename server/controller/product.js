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
const product_1 = __importDefault(require("../service/product"));
const errorType_1 = require("../infra/enums/errorType");
const errorHandler_1 = require("../middleWares/errorHandler");
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const multer_1 = __importDefault(require("multer"));
const multer_s3_1 = __importDefault(require("multer-s3"));
const config_1 = __importDefault(require("config"));
const logger_1 = __importDefault(require("../utils/logger"));
const crypto_1 = __importDefault(require("crypto"));
const Tags_1 = require("../infra/enums/Tags");
const Category_1 = require("../infra/enums/Category");
const tag = 'controller/product';
class Product {
    constructor() {
        this.mujiUpload = (req, file, cb) => __awaiter(this, void 0, void 0, function* () {
            const nowMillionSeconds = new Date().getTime().toString();
            const fileExtension = file.mimetype.split('/')[1]; // get file extension from original file name
            const customFilesName = nowMillionSeconds.substr(-5, 5) +
                crypto_1.default.randomBytes(18).toString('hex').substr(0, 8);
            cb(null, customFilesName + '.' + fileExtension);
        });
        this.createProduct = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.files)
                    throw new errorHandler_1.ErrorHandler(500, errorType_1.ErrorType.ClientError, 'No Images provided...');
                const result = yield product_1.default.createProduct(req.body, req.files);
                if (!result)
                    throw new errorHandler_1.ErrorHandler(500, errorType_1.ErrorType.DatabaseError, 'Fail to create new product');
                const { productId } = result;
                if (productId)
                    yield this.renameProductImages({ productId });
                res.send({
                    result: 'success',
                    data: productId,
                });
            }
            catch (error) {
                logger_1.default.error({ tag: tag + '/createProduct', error });
                next(error);
            }
        });
        this.getProductDetail = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.query;
                const data = yield product_1.default.getProductDetailById(id);
                res.send({ result: 'success', data });
            }
            catch (error) {
                logger_1.default.error({ tag: tag + '/getProductDetail', error });
                next(error);
            }
        });
        this.getProductVariant = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.query;
                const data = yield product_1.default.getProductVariantById(id);
                res.send({ result: 'success', data });
            }
            catch (error) {
                logger_1.default.error({ tag: tag + '/getProductVariant', error });
                next(error);
            }
        });
        this.getProductsListByTag = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const query = req.query;
            const { paging = '1', tag = 'all', category = 'all', keyword } = query;
            const data = yield product_1.default.getProductsListByTag({
                titleLike: keyword,
                tagId: Tags_1.TagsEnum[tag],
                page: paging,
                categoryId: Category_1.CategoryEnum[category],
            });
            try {
                res.send(Object.assign({ result: 'success' }, data));
            }
            catch (error) {
                logger_1.default.error({ tag: tag + '/getProductsListByTag', error });
                next(error);
            }
        });
        this.renameProductImages = (opt) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { productId } = opt;
                if (!productId)
                    return;
                const { main_image, images } = yield product_1.default.getPhotosByProductId(productId);
                main_image.forEach((img) => __awaiter(this, void 0, void 0, function* () {
                    yield this._updateAWSS3Images(img.url.slice(1), `${productId}/${img.name}`);
                    yield product_1.default.updateMainImageById({
                        id: img.id,
                        url: `/${productId}/${img.name}`,
                    });
                }));
                images.forEach((img) => __awaiter(this, void 0, void 0, function* () {
                    yield this._updateAWSS3Images(img.url.slice(1), `${productId}/${img.name}`);
                    yield product_1.default.updateImageById({
                        id: img.id,
                        url: `/${productId}/${img.name}`,
                    });
                }));
            }
            catch (error) {
                logger_1.default.error({ tag: tag + '/renameProductImages', error });
                throw error;
            }
        });
        this._updateAWSS3Images = (oldKey, newKey) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.s3SDK
                    .copyObject({
                    Bucket: config_1.default.get('aws.s3.bucket'),
                    CopySource: config_1.default.get('aws.s3.productImagesFolder') + '/' + oldKey,
                    Key: 'MUJI/products/' + newKey,
                    ACL: 'public-read',
                })
                    .promise();
                yield this.s3SDK
                    .deleteObject({
                    Bucket: config_1.default.get('aws.s3.productImagesFolder'),
                    Key: oldKey,
                })
                    .promise();
            }
            catch (error) {
                logger_1.default.error({ tag: tag + '/_updateAWSS3Images', error });
                throw error;
            }
        });
        this.s3SDK = new aws_sdk_1.default.S3({
            accessKeyId: config_1.default.get('aws.s3.accessKeyId'),
            secretAccessKey: config_1.default.get('aws.s3.secretAccessKey'),
            //@ts-ignore
            Bucket: config_1.default.get('aws.s3.bucket'),
        });
        this.upload = multer_1.default({
            storage: multer_s3_1.default({
                s3: this.s3SDK,
                bucket: config_1.default.get('aws.s3.productImagesFolder'),
                acl: 'public-read',
                key: this.mujiUpload,
            }),
        });
        this.uploadImg = this.upload.fields([
            {
                name: 'main_image',
                maxCount: 5,
            },
            {
                name: 'images',
                maxCount: 5,
            },
        ]);
    }
}
module.exports = new Product();
