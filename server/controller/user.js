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
const config_1 = __importDefault(require("config"));
const user_1 = __importDefault(require("../service/user"));
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const multer_1 = __importDefault(require("multer"));
const multer_s3_1 = __importDefault(require("multer-s3"));
const path_1 = __importDefault(require("path"));
const customErrors_1 = require("../infra/customErrors");
class User {
    constructor() {
        this.register = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield user_1.default.register(req.body, `${req.body.email}/${req.body.name}${path_1.default.extname(req.files.userImage[0].originalname)}`);
                res.send({ access_token: result.data.access_token });
            }
            catch (err) {
                next(err);
            }
        });
        this.logIn = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (req.body.provider === 'facebook') {
                    const result = yield user_1.default.loginByFB(req.cookies.access_token);
                    res.send(result);
                }
                else if (req.body.provider === 'native') {
                    const result = yield user_1.default.loginByEmail(req.body);
                    res.send(result);
                }
            }
            catch (err) {
                next(err);
            }
        });
        this.profile = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const access_token = req.get('Authorization');
                if (!access_token)
                    throw new Error(customErrors_1.customErrors.FORBIDDEN.type);
                const result = yield user_1.default.profile(access_token.split(' ')[1]);
                res.send(result);
            }
            catch (err) {
                next(err);
            }
        });
        this.s3config = new aws_sdk_1.default.S3({
            accessKeyId: config_1.default.get('aws.s3.accessKeyId'),
            secretAccessKey: config_1.default.get('aws.s3.secretAccessKey'),
            Bucket: config_1.default.get('aws.s3.bucket'),
        });
        this.upload = multer_1.default({
            storage: multer_s3_1.default({
                s3: this.s3config,
                bucket: config_1.default.get('aws.s3.userImagesFolder'),
                acl: 'public-read',
                key: function (req, file, cb) {
                    const { name, email } = req.body;
                    cb(null, `${email}/${name}${path_1.default.extname(file.originalname)}`);
                },
            }),
        });
        this.uploadImg = this.upload.fields([
            {
                name: 'userImage',
                maxCount: 3,
            },
        ]);
    }
}
module.exports = new User();
