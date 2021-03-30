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
exports.RoleModule = void 0;
const Role_1 = require("../entities/Role");
class RoleModule {
    constructor(opt) {
        const { client, transaction } = opt;
        this.client = client;
        if (transaction) {
            this.Repo = transaction.getRepository(Role_1.Role);
        }
        else if (this.client) {
            this.Repo = this.client.getRepository(Role_1.Role);
        }
        this.tag = 'roleModule/';
    }
    getRoleById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('id=>', id);
            return yield this.Repo.createQueryBuilder('role')
                .where('role.id = :id', { id })
                .getOne();
        });
    }
}
exports.RoleModule = RoleModule;
