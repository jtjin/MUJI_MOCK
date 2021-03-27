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
exports.PinMessagesModule = void 0;
const PinMessages_1 = require("../entities/PinMessages");
class PinMessagesModule {
    constructor(opt) {
        const { client, transaction } = opt;
        this.client = client;
        if (transaction) {
            this.Repo = transaction.getRepository(PinMessages_1.PinMessages);
        }
        else if (this.client) {
            this.Repo = this.client.getRepository(PinMessages_1.PinMessages);
        }
        this.tag = 'pinMessages/';
    }
    getPinMessagesByAdminId(opt) {
        return __awaiter(this, void 0, void 0, function* () {
            const { adminId } = opt;
            return yield this.Repo.createQueryBuilder('')
                .where('user_id = :adminId', {
                adminId,
            })
                .getMany();
        });
    }
    deletePinMessage(opt) {
        return __awaiter(this, void 0, void 0, function* () {
            const { adminId, message } = opt;
            return yield this.Repo.createQueryBuilder()
                .delete()
                .from(PinMessages_1.PinMessages)
                .where('user_id = :adminId', {
                adminId,
            })
                .andWhere('message = :message', {
                message,
            })
                .execute();
        });
    }
    createPinMessages(values) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.Repo.createQueryBuilder()
                .insert()
                .into(PinMessages_1.PinMessages)
                .values(values)
                .execute();
        });
    }
    updateRoomMessages(room, message) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.Repo.createQueryBuilder()
                .update(PinMessages_1.PinMessages)
                .set({ message })
                .where('room = :room', { room })
                .execute();
        });
    }
}
exports.PinMessagesModule = PinMessagesModule;
