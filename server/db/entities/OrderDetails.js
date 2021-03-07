"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderDetails = void 0;
const typeorm_1 = require("typeorm");
const Orders_1 = require("./Orders");
let OrderDetails = class OrderDetails {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({
        type: 'bigint',
    })
], OrderDetails.prototype, "id", void 0);
__decorate([
    typeorm_1.OneToOne((type) => Orders_1.Orders, (order) => order.id)
], OrderDetails.prototype, "order_id", void 0);
__decorate([
    typeorm_1.Column({
        nullable: false,
        type: 'int',
    })
], OrderDetails.prototype, "price", void 0);
__decorate([
    typeorm_1.Column({
        nullable: false,
        type: 'varchar',
    })
], OrderDetails.prototype, "code", void 0);
__decorate([
    typeorm_1.Column({
        nullable: false,
        type: 'varchar',
    })
], OrderDetails.prototype, "name", void 0);
__decorate([
    typeorm_1.Column({
        nullable: false,
        type: 'varchar',
    })
], OrderDetails.prototype, "size", void 0);
__decorate([
    typeorm_1.Column({
        nullable: false,
        type: 'int',
    })
], OrderDetails.prototype, "qty", void 0);
OrderDetails = __decorate([
    typeorm_1.Entity({ name: 'order_details' })
], OrderDetails);
exports.OrderDetails = OrderDetails;
