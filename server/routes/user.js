"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = __importDefault(require("../controller/user"));
const authorization_1 = require("../middleWares/authorization");
const router = require('express').Router();
router.post('/user/signUp', user_1.default.uploadImg, user_1.default.register);
router.post('/user/signIn', user_1.default.logIn);
router.get('/user/profile', authorization_1.isAuth, user_1.default.profile);
module.exports = router;
