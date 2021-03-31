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
const campaign_1 = __importDefault(require("../service/campaign"));
const logger_1 = __importDefault(require("../utils/logger"));
const tag = 'server/controller/campaign';
class Campaign {
    constructor() {
        this.getCampaigns = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = { data: yield campaign_1.default.getCampaigns() };
                res.send(result);
            }
            catch (error) {
                logger_1.default.error({ tag: tag + '/getCampaigns', error });
                next(error);
            }
        });
        this.createCampaign = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { id, story } = req.body;
            try {
                yield campaign_1.default.createCampaign({
                    id,
                    story,
                    url: `/${req.files.image[0].key}`,
                });
            }
            catch (error) {
                logger_1.default.error({ tag: tag + '/createCampaign', error });
                next(error);
            }
        });
    }
}
module.exports = new Campaign();
