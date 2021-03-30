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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("config"));
const customErrors_1 = require("../infra/customErrors");
const index_1 = __importDefault(require("../db/index"));
class TokenHelper {
    verifyToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [identity, access_token] = (token || '').split(' ', 2);
                if (!identity)
                    throw new Error(customErrors_1.customErrors.AUTH_NO_IDENTITY.type);
                // @ts-ignore
                const { email } = jsonwebtoken_1.default.verify(access_token, config_1.default.get('jwt.secret'));
                const userPO = yield index_1.default.userModule.getUserByEmail(email);
                return userPO;
            }
            catch (err) {
                throw err;
            }
        });
    }
    generateToken(email, role) {
        const jwtExpireTime = Number(config_1.default.get('jwt.expireTime'));
        return (role +
            ' ' +
            jsonwebtoken_1.default.sign({ email }, config_1.default.get('jwt.secret'), {
                expiresIn: jwtExpireTime,
            }));
    }
}
module.exports = new TokenHelper();
