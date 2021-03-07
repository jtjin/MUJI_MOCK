"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tag = void 0;
const typeorm_1 = require("typeorm");
const Product_1 = require("./Product");
let Tag = class Tag {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({
        type: 'bigint',
    })
], Tag.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({
        length: 80,
        nullable: false,
        type: 'varchar',
    })
], Tag.prototype, "name", void 0);
__decorate([
    typeorm_1.OneToMany((type) => Product_1.Product, (product) => product.tag_id)
], Tag.prototype, "product", void 0);
Tag = __decorate([
    typeorm_1.Entity({ name: 'tag' })
], Tag);
exports.Tag = Tag;
