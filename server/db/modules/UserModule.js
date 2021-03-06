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
    constructor(opt) {
        const { client, transaction } = opt;
        this.client = client;
        if (transaction) {
            this.Repo = transaction.getRepository(User_1.User);
        }
        else if (this.client) {
            this.Repo = this.client.getRepository(User_1.User);
        }
        this.tag = 'userModule/';
    }
    getUserByEmail(userEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.Repo.createQueryBuilder('user')
                    .where('user.email = :userEmail', { userEmail })
                    .leftJoinAndSelect('user.role', 'role')
                    .getOne();
            }
            catch (error) {
                throw error;
            }
        });
    }
    getUserByAccessToken(accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.Repo.createQueryBuilder('user')
                    .where('user.access_token= :accessToken', { accessToken })
                    .getOne();
            }
            catch (error) {
                throw error;
            }
        });
    }
    updateAccessToken(email, accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.Repo.createQueryBuilder()
                    .update(User_1.User)
                    .set({ access_token: accessToken })
                    .where('email = :email', { email })
                    .execute();
            }
            catch (error) {
                throw error;
            }
        });
    }
    createNewUser(values) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.Repo.createQueryBuilder()
                    .insert()
                    .into(User_1.User)
                    // @ts-ignore
                    .values([values])
                    .execute();
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.UserModule = UserModule;
