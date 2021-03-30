"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const typeorm_1 = require("typeorm");
const Role_1 = require("./Role");
let User = class User {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({
        type: 'bigint',
    })
], User.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({
        nullable: false,
        type: 'varchar',
    })
], User.prototype, "provider", void 0);
__decorate([
    typeorm_1.Column({
        nullable: false,
        type: 'varchar',
    })
], User.prototype, "name", void 0);
__decorate([
    typeorm_1.Column({
        nullable: false,
        type: 'varchar',
    })
], User.prototype, "email", void 0);
__decorate([
    typeorm_1.Column({
        nullable: false,
        type: 'varchar',
    })
], User.prototype, "password", void 0);
__decorate([
    typeorm_1.Column({
        nullable: false,
        type: 'varchar',
    })
], User.prototype, "picture", void 0);
__decorate([
    typeorm_1.Column({
        nullable: false,
        type: 'varchar',
    })
], User.prototype, "access_token", void 0);
__decorate([
    typeorm_1.ManyToOne((type) => Role_1.Role),
    typeorm_1.JoinColumn({
        name: 'role_id',
    })
], User.prototype, "role", void 0);
User = __decorate([
    typeorm_1.Entity({ name: 'user' })
], User);
exports.User = User;
