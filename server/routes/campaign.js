"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const campaign_1 = __importDefault(require("../controller/campaign"));
const router = express_1.Router();
const fs = require('fs');
const path = require('path');
// let i = -1
// function count(j) {
// 	i = j + 1
// 	let result = i == 0 ? '' : `-${i}`
// 	return result
// }
// var AWS = require('aws-sdk')
// var multer = require('multer')
// var multerS3 = require('multer-s3')
// var s3 = new AWS.S3({
// 	accessKeyId: config.get('aws.s3.accessKeyId'),
// 	secretAccessKey: config.get('aws.s3.secretAccessKey'),
// 	Bucket: config.get('aws.s3.bucket'),
// })
// var upload = multer({
// 	storage: multerS3({
// 		s3: s3,
// 		bucket: config.get('aws.s3.bucket') + '/campaigns',
// 		acl: 'public-read',
// 		key: function (req: Request, file: any, cb: any) {
// 			let id = req.body.id
// 			cb(
// 				null,
// 				`${id}/${file.fieldname}${count(i)}${path.extname(file.originalname)}`,
// 			)
// 		},
// 	}),
// })
router.get('/marketing/campaigns', campaign_1.default.getCampaigns);
// router.post(
// 	'/admin/campaign.html',
// 	upload.fields([
// 		{
// 			name: 'image',
// 			maxCount: 5,
// 		},
// 	]),
// 	Campaign.createCampaign,
// )
module.exports = router;
