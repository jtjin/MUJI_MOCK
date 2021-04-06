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
exports.isAuth = void 0;
const customErrors_1 = require("../infra/customErrors");
const token_1 = __importDefault(require("../helpers/token"));
const isAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const access_token = req.get('Authorization');
        if (!access_token)
            throw new Error(customErrors_1.customErrors.AUTH_NO_TOKEN.type);
        const userPO = yield token_1.default.verifyToken(access_token);
        if (!userPO)
            throw new Error(customErrors_1.customErrors.USER_NOT_FOUND.type);
        req.me = userPO;
        next();
    }
    catch (err) {
        next(err);
    }
});
exports.isAuth = isAuth;
