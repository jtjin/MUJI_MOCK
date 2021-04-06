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
exports.MessagesModule = void 0;
const Messages_1 = require("../entities/Messages");
class MessagesModule {
    constructor(opt) {
        const { client, transaction } = opt;
        this.client = client;
        if (transaction) {
            this.Repo = transaction.getRepository(Messages_1.Messages);
        }
        else if (this.client) {
            this.Repo = this.client.getRepository(Messages_1.Messages);
        }
        this.tag = 'messageModule/';
    }
    getMessagesByRoom(room) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return this.Repo.createQueryBuilder()
                    .where('room = :room', {
                    room,
                })
                    .getOne();
            }
            catch (error) {
                throw error;
            }
        });
    }
    getChatRoomsListById(opt) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, adminId } = opt;
                let query = this.Repo.createQueryBuilder('m').select('m.room, m.updatedAt, m.admin_id,  m.user_id, m.adminRead');
                if (userId)
                    query = query.where('user_id = :userId', { userId });
                if (adminId)
                    query = query.where('admin_id = :adminId', { adminId });
                return yield query.orderBy('m.updatedAt', 'ASC').getRawMany();
            }
            catch (error) {
                throw error;
            }
        });
    }
    createMessages(values) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.Repo.createQueryBuilder()
                    .insert()
                    .into(Messages_1.Messages)
                    .values(values)
                    .execute();
            }
            catch (error) {
                throw error;
            }
        });
    }
    updateRoomMessages(room, messages) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.Repo.createQueryBuilder()
                    .update(Messages_1.Messages)
                    .set({ messages })
                    .where('room = :room', { room })
                    .execute();
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.MessagesModule = MessagesModule;
