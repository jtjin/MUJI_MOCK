"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Orders = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("./User");
let Orders = class Orders {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({
        type: 'bigint',
    })
], Orders.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({
        type: 'bigint',
    })
], Orders.prototype, "total", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar' })
], Orders.prototype, "payment_state", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar' })
], Orders.prototype, "pay_way", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar' })
], Orders.prototype, "shipping", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar' })
], Orders.prototype, "freight", void 0);
__decorate([
    typeorm_1.ManyToOne((type) => User_1.User, (user) => user.id),
    typeorm_1.JoinColumn({
        name: 'user_id',
    })
], Orders.prototype, "user_id", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar' })
], Orders.prototype, "rec_name", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar' })
], Orders.prototype, "rec_phone", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar' })
], Orders.prototype, "rec_email", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar' })
], Orders.prototype, "rec_address", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar' })
], Orders.prototype, "rec_time", void 0);
Orders = __decorate([
    typeorm_1.Entity({ name: 'orders' })
], Orders);
exports.Orders = Orders;
