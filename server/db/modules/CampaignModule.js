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
exports.CampaignModule = void 0;
const Campaign_1 = require("../entities/Campaign");
class CampaignModule {
    constructor(opt) {
        const { client, transaction } = opt;
        this.client = client;
        if (transaction) {
            this.Repo = transaction.getRepository(Campaign_1.Campaign);
        }
        else if (this.client) {
            this.Repo = this.client.getRepository(Campaign_1.Campaign);
        }
        this.tag = 'campaignModule/';
    }
    getCampaigns() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.Repo.createQueryBuilder('c')
                    .select('c.id , c.story, c.url AS picture')
                    .getRawMany();
            }
            catch (error) {
                throw error;
            }
        });
    }
    createCampaign(id, story, url) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.Repo.createQueryBuilder()
                    .insert()
                    .into(Campaign_1.Campaign)
                    .values([{ id, story, url }])
                    .execute();
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.CampaignModule = CampaignModule;
