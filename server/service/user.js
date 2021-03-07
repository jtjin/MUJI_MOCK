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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const index_1 = __importDefault(require("../db/index"));
const config_1 = __importDefault(require("config"));
const R = __importStar(require("ramda"));
const customErrors_1 = require("../infra/customErrors");
const errorHandler_1 = require("../utils/middleWares/errorHandler");
const errorType_1 = require("../infra/enums/errorType");
class User {
    loginByEmail(reqVo) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = reqVo;
            const userPO = yield index_1.default.userModule.getUserByEmail(email);
            if (!userPO)
                throw new Error(customErrors_1.customErrors.USER_NOT_FOUND.type);
            if (this._validatePassword(password, userPO.password)) {
                throw new Error(customErrors_1.customErrors.FORBIDDEN.type);
            }
            const access_token = this._refreshAccessToken(email);
            yield index_1.default.userModule.updateAccessToken(email, access_token);
            return {
                result: 'success',
                data: Object.assign(Object.assign({}, R.pick(['id', 'provider', 'name', 'email', 'picture'], userPO)), { access_token, access_expired: config_1.default.get('jwt.expireTime') }),
            };
        });
    }
    _validatePassword(enteredPwd, existedPwd) {
        return !bcryptjs_1.default.compareSync(enteredPwd, existedPwd);
    }
    register(reqVO, fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, email, picture, password, provider } = reqVO;
            const ifUserExist = yield index_1.default.userModule.getUserByEmail(email);
            if (ifUserExist) {
                throw new errorHandler_1.ErrorHandler(403, errorType_1.ErrorType.ClientError, 'User Already Exists...');
            }
            if (provider === 'facebook') {
                return this._registerByFacebook({ email, name, picture });
            }
            else if (provider === 'native') {
                return this._registerByEmail({ email, name, password }, fileName);
            }
            else {
                throw new Error(customErrors_1.customErrors.FORBIDDEN.type);
            }
        });
    }
    _registerByFacebook(values) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, name, picture } = values;
            const jwtExpireTime = Number(config_1.default.get('jwt.expireTime'));
            const access_token = jsonwebtoken_1.default.sign({ email }, config_1.default.get('jwt.secret'), {
                expiresIn: jwtExpireTime,
            });
            const insertedResult = yield index_1.default.userModule.createNewUser({
                name,
                email,
                access_token,
                picture: picture.data.url,
                provider: 'facebook',
            });
            return {
                data: {
                    access_token,
                    access_expired: jwtExpireTime,
                    id: insertedResult.raw.insertId,
                    provider: 'facebook',
                    name,
                    email,
                    picture: picture.data.url,
                },
            };
        });
    }
    _registerByEmail(values, fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, email, password } = values;
            if (!password)
                throw new Error(customErrors_1.customErrors.FORBIDDEN.type);
            const hashPwd = bcryptjs_1.default.hashSync(password, 8);
            console.log('hashPwd=>', hashPwd);
            const access_token = jsonwebtoken_1.default.sign({
                email,
            }, config_1.default.get('jwt.secret'), {
                expiresIn: Number(config_1.default.get('jwt.expireTime')),
            });
            const result = yield index_1.default.userModule.createNewUser({
                name,
                email,
                password: hashPwd,
                access_token,
                picture: fileName,
                provider: 'native',
            });
            return {
                data: {
                    id: result.raw.insertId,
                    provider: 'native',
                    name,
                    email,
                    picture: fileName,
                    access_token,
                    access_expired: Number(config_1.default.get('jwt.expireTime')),
                },
            };
        });
    }
    loginByFB(token) {
        return __awaiter(this, void 0, void 0, function* () {
            jsonwebtoken_1.default.verify(token, config_1.default.get('jwt.secret'));
            const userPO = yield index_1.default.userModule.getUserByAccessToken(token);
            if (!userPO)
                throw new Error(customErrors_1.customErrors.USER_NOT_FOUND.type);
            const tokenExpireTime = Number(config_1.default.get('jwt.expireTime'));
            const access_token = jsonwebtoken_1.default.sign({ email: userPO.email }, config_1.default.get('jwt.secret'), { expiresIn: Number(config_1.default.get('jwt.expireTime')) });
            yield index_1.default.userModule.updateAccessToken(userPO.email, access_token);
            return {
                data: {
                    access_token,
                    access_expired: tokenExpireTime,
                    id: userPO.id,
                    provider: 'facebook',
                    name: userPO.name,
                    email: `${userPO.email}`,
                    picture: userPO.picture,
                },
            };
        });
    }
    profile(access_token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                jsonwebtoken_1.default.verify(access_token, config_1.default.get('jwt.secret'));
                const userPO = yield index_1.default.userModule.getUserByAccessToken(access_token);
                return {
                    data: R.pick(['id', 'provider', 'name', 'email', 'picture'], userPO),
                };
            }
            catch (err) {
                throw new Error(customErrors_1.customErrors.FORBIDDEN.type);
            }
        });
    }
    _refreshAccessToken(email) {
        return jsonwebtoken_1.default.sign({ email }, config_1.default.get('jwt.secret'), {
            expiresIn: Number(config_1.default.get('jwt.expireTime')),
        });
    }
}
module.exports = new User();
