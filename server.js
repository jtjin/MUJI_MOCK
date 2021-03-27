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
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbConnection = void 0;
const config_1 = __importDefault(require("config"));
const logger_1 = __importDefault(require("./server/utils/logger"));
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const db_1 = __importDefault(require("./server/db"));
const errorHandler_1 = require("./server/utils/middleWares/errorHandler");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const redisDb_1 = require("./server/db/redisDb");
const error_1 = __importDefault(require("./server/controller/error"));
const index_1 = require("./server/webSocket/index");
const utils_1 = require("./server/utils");
const env = process.env.NODE_ENV || 'development';
const app = express_1.default();
const tag = 'server';
const initServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const server = app.listen(config_1.default.get('port'));
        console.log(`--- [ ENV : ${env}]  ---`);
        console.log(`--- Stylish server running on port ${config_1.default.get('port')} ---`);
        yield index_1.socketIoInit(server);
        exports.dbConnection = db_1.default.initDb();
        const _exitHandler = terminate(server, {
            coredump: false,
            timeout: 500,
        });
        // parse application/x-www-form-urlencoded
        app.use(body_parser_1.default.urlencoded({
            extended: true,
        }));
        // parse application/json
        app.use(body_parser_1.default.json());
        app.use(cookie_parser_1.default());
        app.set('json spaces', 2);
        app.use(express_1.default.json());
        app.use(express_1.default.urlencoded());
        /// CORS Control
        app.use('/api/', function (req, res, next) {
            res.set('Access-Control-Allow-Origin', '*');
            res.set('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept, Authorization');
            res.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
            res.set('Access-Control-Allow-Credentials', 'true');
            next();
        });
        // API routes
        app.use('/api/' + config_1.default.get('api.version'), [
            require('./server/routes/user'),
            require('./server/routes/product'),
            require('./server/routes/chatRoom'),
            require('./server/routes/campaign'),
        ]);
        app.set('view engine', 'html');
        app.set('views', utils_1.rootPath + '/public/');
        app.use(express_1.default.static(utils_1.rootPath + '/public'));
        app.use(error_1.default.get404);
        app.use(errorHandler_1.handleError);
        process.on('uncaughtException', _exitHandler(1, 'Unexpected Error'));
        process.on('unhandledRejection', _exitHandler(1, 'Unhandled Promise'));
        process.on('SIGTERM', _exitHandler(0, 'SIGTERM'));
        process.on('SIGINT', _exitHandler(0, 'SIGINT'));
    }
    catch (error) {
        console.log(error);
    }
});
function terminate(server, options = { coredump: false, timeout: 500 }) {
    return (code, reason) => (err, promise) => __awaiter(this, void 0, void 0, function* () {
        const _exit = () => {
            options.coredump ? process.abort() : process.exit(code);
        };
        if (err && err instanceof Error) {
            logger_1.default.error({ tag, error: err });
        }
        server.close(_exit);
        yield db_1.default.disconnectDb();
        redisDb_1.disconnectRedis();
        setTimeout(_exit, options.timeout).unref();
    });
}
initServer();
module.exports = {
    app,
};
