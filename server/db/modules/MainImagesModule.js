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
exports.MainImagesModule = void 0;
const MainImages_1 = require("../entities/MainImages");
class MainImagesModule {
    constructor(opt) {
        const { client, transaction } = opt;
        this.client = client;
        if (transaction) {
            this.Repo = transaction.getRepository(MainImages_1.MainImages);
        }
        else if (this.client) {
            this.Repo = this.client.getRepository(MainImages_1.MainImages);
        }
        this.tag = 'productModule/';
    }
    getAllMainImages() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.Repo.createQueryBuilder().getMany();
            }
            catch (error) {
                throw error;
            }
        });
    }
    getMainImagesById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return this.Repo.createQueryBuilder()
                    .where('product_id = :id', {
                    id,
                })
                    .getMany();
            }
            catch (error) {
                throw error;
            }
        });
    }
    createMainImages(values) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.Repo.createQueryBuilder()
                    .insert()
                    .into(MainImages_1.MainImages)
                    .values(values)
                    .execute();
            }
            catch (error) {
                throw error;
            }
        });
    }
    updateMainImageById(opt) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id, url } = opt;
                return yield this.Repo.createQueryBuilder()
                    .update(MainImages_1.MainImages)
                    .set({ url: url })
                    .where('id = :id', { id })
                    .execute();
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.MainImagesModule = MainImagesModule;
