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
const errorHandler_1 = require("../utils/middleWares/errorHandler");
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const multer_1 = __importDefault(require("multer"));
const multer_s3_1 = __importDefault(require("multer-s3"));
const path_1 = __importDefault(require("path"));
const config_1 = __importDefault(require("config"));
const logger_1 = __importDefault(require("../utils/logger"));
let that;
let hasInserted = false;
let photoCount = 0;
let productId;
const tag = 'controller/product';
class Product {
    constructor() {
        this.createProduct = (req) => __awaiter(this, void 0, void 0, function* () {
            if (!req.body)
                return;
            return yield product_1.default.createProduct(req.body);
        });
        this.createdPhotos = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (typeof productId === 'number') {
                    yield product_1.default.createdPhotos(req.files, { productId });
                }
                hasInserted = false;
                photoCount = 0;
            }
            catch (err) {
                next(err);
            }
        });
        this.getProductsListByTag = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { bodyTag } = req.params;
            const { keyword, id } = req.query;
            let page;
            if (req.query.paging && typeof req.query.paging === 'string') {
                page = req.query.paging;
            }
            else {
                page = '1';
            }
            try {
                switch (bodyTag) {
                    case 'women':
                    case 'men':
                    case 'accessories':
                    case 'all':
                        res.send(yield product_1.default.getProductsListByTag({
                            tag: bodyTag,
                            page,
                        }));
                        break;
                    case 'search':
                        res.send(yield product_1.default.getProductsListByTag({
                            titleLike: String(keyword),
                            page,
                        }));
                        break;
                    case 'details':
                        res.send(yield product_1.default.getProductDetailById(String(id)));
                        break;
                    default:
                        throw new errorHandler_1.ErrorHandler(403, errorType_1.ErrorType.ValidationError, 'Request Error: Invalid product category');
                }
            }
            catch (error) {
                next(error);
            }
        });
        this.getProductCache = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { bodyTag } = req.params;
            const { keyword, id } = req.query;
            const CatchName = {
                id: id,
                keyword: keyword,
            };
            // const data = await redisClient.get(`${bodyTag}${keyword}${CatchName.id}`)
            // console.log('data==>', data)
            // if (data) res.send(data)
            next();
        });
        that = this;
        this.s3config = new aws_sdk_1.default.S3({
            accessKeyId: config_1.default.get('aws.s3.accessKeyId'),
            secretAccessKey: config_1.default.get('aws.s3.secretAccessKey'),
            Bucket: config_1.default.get('aws.s3.bucket'),
        });
        this.upload = multer_1.default({
            storage: multer_s3_1.default({
                s3: this.s3config,
                bucket: config_1.default.get('aws.s3.productImagesFolder'),
                acl: 'public-read',
                key: function (req, file, cb) {
                    return __awaiter(this, void 0, void 0, function* () {
                        try {
                            if (!hasInserted) {
                                productId = yield that.createProduct(req);
                                hasInserted = true;
                                req.body.productId = productId;
                            }
                        }
                        catch (err) {
                            logger_1.default.error({ tag: tag + '/createProduct', error: err });
                            hasInserted = false;
                        }
                        cb(null, `${productId}/${file.fieldname}-${photoCount}${path_1.default.extname(file.originalname)}`);
                        photoCount++;
                    });
                },
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
