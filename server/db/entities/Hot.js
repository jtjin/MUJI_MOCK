"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hot = void 0;
const typeorm_1 = require("typeorm");
const Product_1 = require("./Product");
let Hot = class Hot {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({
        type: 'bigint',
    })
], Hot.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({
        length: 80,
        nullable: false,
        type: 'varchar',
    })
], Hot.prototype, "title", void 0);
__decorate([
    typeorm_1.OneToMany((type) => Product_1.Product, (product) => product.hot_id)
], Hot.prototype, "product", void 0);
Hot = __decorate([
    typeorm_1.Entity({ name: 'hot' })
], Hot);
exports.Hot = Hot;
