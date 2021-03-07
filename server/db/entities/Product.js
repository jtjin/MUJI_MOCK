"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const Tag_1 = require("./Tag");
const typeorm_1 = require("typeorm");
const Hot_1 = require("./Hot");
const ProductDetails_1 = require("./ProductDetails");
const Images_1 = require("./Images");
const MainImages_1 = require("./MainImages");
let Product = class Product {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({
        type: 'bigint',
    })
], Product.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({
        length: 80,
        nullable: false,
        type: 'varchar',
    })
], Product.prototype, "title", void 0);
__decorate([
    typeorm_1.Column({
        length: 150,
        type: 'varchar',
    })
], Product.prototype, "description", void 0);
__decorate([
    typeorm_1.Column({
        type: 'int',
        nullable: false,
    })
], Product.prototype, "price", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar' })
], Product.prototype, "texture", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar' })
], Product.prototype, "wash", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar' })
], Product.prototype, "place", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar' })
], Product.prototype, "note", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar' })
], Product.prototype, "story", void 0);
__decorate([
    typeorm_1.ManyToOne((type) => Tag_1.Tag),
    typeorm_1.JoinColumn({
        name: 'tag_id',
    })
], Product.prototype, "tag_id", void 0);
__decorate([
    typeorm_1.ManyToOne((type) => Hot_1.Hot),
    typeorm_1.JoinColumn({
        name: 'hot_id',
    })
], Product.prototype, "hot_id", void 0);
__decorate([
    typeorm_1.OneToMany((type) => ProductDetails_1.ProductDetails, (product_details) => product_details.product_id)
], Product.prototype, "variants", void 0);
__decorate([
    typeorm_1.OneToMany((type) => Images_1.Images, (images) => images.product_id)
], Product.prototype, "images", void 0);
__decorate([
    typeorm_1.OneToOne((type) => MainImages_1.MainImages, (main_image) => main_image.product_id)
], Product.prototype, "main_image", void 0);
Product = __decorate([
    typeorm_1.Entity({ name: 'product' })
], Product);
exports.Product = Product;
