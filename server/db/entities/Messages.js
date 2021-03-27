"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Messages = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("./User");
let Messages = class Messages {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({
        type: 'bigint',
    })
], Messages.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({
        type: 'json',
    })
], Messages.prototype, "messages", void 0);
__decorate([
    typeorm_1.Column({
        nullable: false,
        type: 'varchar',
    })
], Messages.prototype, "room", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
    })
], Messages.prototype, "user_name", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
    })
], Messages.prototype, "admin_name", void 0);
__decorate([
    typeorm_1.UpdateDateColumn()
], Messages.prototype, "updatedAt", void 0);
__decorate([
    typeorm_1.Column({
        type: 'boolean',
    })
], Messages.prototype, "adminRead", void 0);
__decorate([
    typeorm_1.ManyToOne((type) => User_1.User),
    typeorm_1.JoinColumn({
        name: 'admin_id',
    })
], Messages.prototype, "admin_id", void 0);
__decorate([
    typeorm_1.ManyToOne((type) => User_1.User),
    typeorm_1.JoinColumn({
        name: 'user_id',
    })
], Messages.prototype, "user_id", void 0);
Messages = __decorate([
    typeorm_1.Entity({ name: 'messages' })
], Messages);
exports.Messages = Messages;
