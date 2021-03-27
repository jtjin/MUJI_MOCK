"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = __importDefault(require("../controller/user"));
const router = require('express').Router();
router.post('/user/register', user_1.default.uploadImg, user_1.default.register);
router.post('/user/logIn', user_1.default.logIn);
// router.use(authorization)
router.get('/user/profile', user_1.default.profile);
module.exports = router;
