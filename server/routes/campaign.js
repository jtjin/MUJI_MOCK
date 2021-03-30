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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const campaign_1 = __importDefault(require("../controller/campaign"));
const config_1 = __importDefault(require("config"));
const router = express_1.Router();
const fs = require('fs');
const path = require('path');
let i = -1;
function count(j) {
    i = j + 1;
    let result = i == 0 ? '' : `-${i}`;
    return result;
}
var AWS = require('aws-sdk');
var multer = require('multer');
var multerS3 = require('multer-s3');
var s3 = new AWS.S3({
    accessKeyId: config_1.default.get('aws.s3.accessKeyId'),
    secretAccessKey: config_1.default.get('aws.s3.secretAccessKey'),
    Bucket: config_1.default.get('aws.s3.bucket'),
});
var upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: config_1.default.get('aws.s3.bucket') + '/campaigns',
        acl: 'public-read',
        key: function (req, file, cb) {
            let id = req.body.id;
            cb(null, `${id}/${file.fieldname}${count(i)}${path.extname(file.originalname)}`);
        },
    }),
});
router.get('/marketing/campaigns', cache, campaign_1.default.getCampaigns);
function cache(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        // const data = await redisClient.get('campaigns')
        next();
        // if (data != null) {
        // 	res.send(data)
        // } else {
        // 	next()
        // }
    });
}
router.post('/admin/campaign.html', upload.fields([
    {
        name: 'image',
        maxCount: 5,
    },
]), campaign_1.default.createCampaign);
module.exports = router;
