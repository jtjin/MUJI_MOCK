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
const index_1 = __importDefault(require("../../db/index"));
const redisDb_1 = require("../../db/redisDb");
const R = __importStar(require("ramda"));
let that;
class UserHandler {
    constructor(io, socket) {
        this.currentUsersList = [];
        this.rooms = {};
        this.messagesBucket = {};
        this.sendMainPagePopAd = (data) => __awaiter(this, void 0, void 0, function* () {
            that.io.emit('popMainPageAD', Object.assign({}, data));
        });
        this._createOrUpdateUserMessagesDataInRedisAndDB = (userInfo) => __awaiter(this, void 0, void 0, function* () {
            const data = yield redisDb_1.redisClient.get(userInfo.room);
            if (!data && !userInfo.isFirstTime)
                return;
            this.createOrUpdateChatRoom(Object.assign({ redisData: data }, userInfo));
            yield redisDb_1.redisClient.del(userInfo.room);
        });
        this.refreshRoomListAndGreetUser = function (userInfo) {
            return __awaiter(this, void 0, void 0, function* () {
                const socket = this;
                const history = yield index_1.default.messagesModule.getMessagesByRoom(userInfo.room);
                if (history) {
                    that.io.to(userInfo.room || userInfo.userId).emit('getHistory', history);
                }
                else {
                    that.io.to(userInfo.room || userInfo.userId).emit('greetNewUser', {
                        message: '👋 Hi there, welcome to stylish!',
                        time: new Date(),
                    });
                    if (userInfo.userName === 'randomUser') {
                        that.io.to(userInfo.room || userInfo.userId).emit('newMessageFromCMS', {
                            message: `Please sign in first, before sending message, or it won't be saved. Thank you.`,
                            time: new Date(),
                        });
                    }
                }
                that.io.emit('updateAdminRoomsList');
            });
        };
        this.joinUserToChatRoom = function (userInfo) {
            return __awaiter(this, void 0, void 0, function* () {
                yield that._createOrUpdateUserMessagesDataInRedisAndDB(Object.assign({ isFirstTime: true }, userInfo));
                this.join(userInfo.room || userInfo.userId);
            });
        };
        that = this;
        this.io = io;
        socket.on('userJoinRoom', this.joinUserToChatRoom);
        socket.on('newUserGetOnline', this.refreshRoomListAndGreetUser);
        socket.on('newAdminGetOnline', this.refreshRoomListAndGreetAdmin);
        socket.on('newChatMessage', this.sendChatMessage);
        socket.on('disconnect', this.userLeaveTheRoom);
        socket.on('sendMainPagePopAd', this.sendMainPagePopAd);
    }
    sendChatMessage(userInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('=userInfo==>', userInfo);
            userInfo.time = new Date(userInfo.time);
            const lockKey = `lock:${userInfo.room}`;
            const lock = yield redisDb_1.redisClient.get(lockKey);
            if (lock)
                yield that._waitUntilRedisRoomUnlock(lockKey);
            yield redisDb_1.redisClient.set(lockKey, 'true');
            if (userInfo.role === 'admin') {
                that.io.to(userInfo.room).emit('newMessageFromCMS', userInfo);
            }
            else {
                that.io.to(userInfo.room).emit('renderNewMessage', userInfo);
            }
            const tempHistoryMsg = yield redisDb_1.redisClient.get(userInfo.room);
            const payload = R.pick(['userId', 'message', 'time'], userInfo);
            if (tempHistoryMsg) {
                const data = Array.from(JSON.parse(String(tempHistoryMsg)));
                data.push(payload);
                yield redisDb_1.redisClient.set(userInfo.room, JSON.stringify(data));
            }
            else {
                yield redisDb_1.redisClient.set(userInfo.room, JSON.stringify([payload]));
            }
            yield redisDb_1.redisClient.del(lockKey);
        });
    }
    _waitUntilRedisRoomUnlock(lockKey) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('_waitUntilRedisRoomUnlock=>', lockKey);
            new Promise((resolve, reject) => {
                setInterval(() => __awaiter(this, void 0, void 0, function* () {
                    const lock = yield redisDb_1.redisClient.get(lockKey);
                    if (!lock)
                        return resolve;
                }), 1000);
            });
        });
    }
    userLeaveTheRoom(userInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            yield that._createOrUpdateUserMessagesDataInRedisAndDB(userInfo);
        });
    }
    createOrUpdateChatRoom(userInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            const messagesInfo = yield index_1.default.messagesModule.getMessagesByRoom(userInfo.room);
            if (messagesInfo && userInfo.redisData) {
                const updatedMessages = Array.from(JSON.parse(String(messagesInfo.messages))).concat(Array.from(JSON.parse(userInfo.redisData)));
                yield index_1.default.messagesModule.updateRoomMessages(userInfo.room, JSON.stringify(updatedMessages));
            }
            else if (userInfo.redisData) {
                yield index_1.default.messagesModule.createMessages([
                    {
                        user_id: userInfo.userId,
                        room: userInfo.room,
                        messages: userInfo.redisData,
                    },
                ]);
            }
            else if (!messagesInfo && !userInfo.redisData) {
                yield index_1.default.messagesModule.createMessages([
                    {
                        user_id: userInfo.userId,
                        room: userInfo.room,
                    },
                ]);
            }
        });
    }
    refreshRoomListAndGreetAdmin(userInfo) {
        that.io.to(this.id).emit('greetNewAdmin', {
            userName: 'System',
            message: 'Hi there, welcome to stylish. ' +
                `\n` +
                ' 👈 To begin chat, please click on the room from right side.',
            time: new Date(),
        });
    }
    getCurrentUsersList() {
        return this.currentUsersList;
    }
    getCurrentUserBySocketId(socketId) {
        return this.currentUsersList.find((user) => user.socketId == socketId);
    }
    deleteUserFromChatRoom(socketId) {
        const index = this.currentUsersList.findIndex((user) => user.socketId === socketId);
        if (index !== -1) {
            return this.currentUsersList.splice(index, 1)[0];
        }
    }
    getRoomUsers(room) {
        return this.currentUsersList.filter((user) => user.room === room);
    }
}
module.exports = UserHandler;
