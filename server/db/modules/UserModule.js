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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModule = void 0;
const User_1 = require("../entities/User");
class UserModule {
    constructor(client) {
        this.client = client;
        this.tag = 'userModule/';
    }
    getUserByEmail(userEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.client
                .getRepository(User_1.User)
                .createQueryBuilder('user')
                .where('user.email = :userEmail', { userEmail })
                .getOne();
        });
    }
    getUserByAccessToken(accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.client
                .getRepository(User_1.User)
                .createQueryBuilder('user')
                .where('user.access_token= :accessToken', { accessToken })
                .getOne();
        });
    }
    updateAccessToken(email, accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.client
                .createQueryBuilder()
                .update(User_1.User)
                .set({ access_token: accessToken })
                .where('email = :email', { email })
                .execute();
        });
    }
    createNewUser(values) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.client
                .createQueryBuilder()
                .insert()
                .into(User_1.User)
                .values([values])
                .execute();
        });
    }
}
exports.UserModule = UserModule;
