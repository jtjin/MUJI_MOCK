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
const typeorm_1 = require("typeorm");
const ProductModule_1 = require("./modules/ProductModule");
const ProductDetailsModule_1 = require("./modules/ProductDetailsModule");
const MainImagesModule_1 = require("./modules/MainImagesModule");
const ImagesModule_1 = require("./modules/ImagesModule");
const CampaignModule_1 = require("./modules/CampaignModule");
const UserModule_1 = require("./modules/UserModule");
const MessagesModules_1 = require("./modules/MessagesModules");
const PinMessagesModule_1 = require("./modules/PinMessagesModule");
const RoleModule_1 = require("./modules/RoleModule");
const config_1 = __importDefault(require("config"));
const logger_1 = __importDefault(require("../utils/logger"));
const tag = '/db/index';
let dbConnection;
const Entities = Array.from({ length: 26 }, (v, i) => `${__dirname}/entities/${String.fromCharCode(i + 65)}*.js`);
class StylishRDB {
    initDb() {
        return __awaiter(this, void 0, void 0, function* () {
            const connectionConfig = {
                type: 'mysql',
                name: 'stylish',
                host: String(config_1.default.get('aws.rds.host')),
                username: String(config_1.default.get('aws.rds.username')),
                password: String(config_1.default.get('aws.rds.password')),
                database: String(config_1.default.get('aws.rds.database')),
                synchronize: false,
                logging: false,
                entities: Entities,
            };
            this.client = yield typeorm_1.createConnection(connectionConfig);
            if (this.client) {
                console.log(`--- Stylish DB Connected ---`);
            }
            this.productModule = new ProductModule_1.ProductModule({ client: this.client });
            this.userModule = new UserModule_1.UserModule({ client: this.client });
            this.campaignModule = new CampaignModule_1.CampaignModule({ client: this.client });
            this.productDetailsModule = new ProductDetailsModule_1.ProductDetailsModule({
                client: this.client,
            });
            this.imagesModule = new ImagesModule_1.ImagesModule({ client: this.client });
            this.mainImagesModule = new MainImagesModule_1.MainImagesModule({ client: this.client });
            this.messagesModule = new MessagesModules_1.MessagesModule({ client: this.client });
            this.pinMessagesModule = new PinMessagesModule_1.PinMessagesModule({ client: this.client });
            this.roleModule = new RoleModule_1.RoleModule({ client: this.client });
            dbConnection = this.client;
            return this.client;
        });
    }
    disconnectDb() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                logger_1.default.info({ tag, msg: '--- Disconnect Stylish Database --' });
                if (this.client)
                    yield this.client.close();
            }
            catch (error) {
                logger_1.default.error({ tag, error });
                throw error;
            }
        });
    }
}
exports.connection = dbConnection;
module.exports = new StylishRDB();
