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
exports.ImagesModule = void 0;
const Images_1 = require("../entities/Images");
class ImagesModule {
    constructor(opt) {
        const { client, transaction } = opt;
        this.client = client;
        if (transaction) {
            this.Repo = transaction.getRepository(Images_1.Images);
        }
        else if (this.client) {
            this.Repo = this.client.getRepository(Images_1.Images);
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
    getImagesById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.Repo.createQueryBuilder()
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
    createImages(values) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.Repo.createQueryBuilder()
                    .insert()
                    .into(Images_1.Images)
                    .values(values)
                    .execute();
            }
            catch (error) {
                throw error;
            }
        });
    }
    updateImageById(opt) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id, url } = opt;
                return yield this.Repo.createQueryBuilder()
                    .update(Images_1.Images)
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
exports.ImagesModule = ImagesModule;
