import { Tag } from './Tag'
import { Category } from './Category'
import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	OneToMany,
	ManyToOne,
	JoinColumn,
	Index,
	OneToOne,
} from 'typeorm'
import { Hot } from './Hot'
import { ProductDetails } from './ProductDetails'
import { Images } from './Images'
import { MainImages } from './MainImages'

@Entity({ name: 'product' })
export class Product {
	@PrimaryGeneratedColumn({
		type: 'bigint',
	})
	id: string

	@Column({
		length: 80,
		nullable: false,
		type: 'varchar',
	})
	title!: string

	@Column({
		length: 150,
		type: 'varchar',
	})
	description?: string

	// @Column({
	// 	type: 'int',
	// 	nullable: false,
	// })
	// price!: number

	@Column({ type: 'varchar' })
	texture?: string

	@Column({ type: 'varchar' })
	wash?: string

	@Column({ type: 'varchar' })
	place?: string

	@Column({ type: 'varchar' })
	note?: string

	@Column({ type: 'varchar' })
	story?: string

	@Column({ type: 'varchar' })
	specs?: string

	@CreateDateColumn()
	createdAt!: Date

	@UpdateDateColumn()
	updatedAt!: Date

	@ManyToOne((type) => Category)
	@JoinColumn({
		name: 'category_id',
	})
	category: Category | string

	@ManyToOne((type) => Tag)
	@JoinColumn({
		name: 'tag_id',
	})
	tag_id: Tag | string

	@ManyToOne((type) => Hot)
	@JoinColumn({
		name: 'hot_id',
	})
	hot_id: Hot | string

	@OneToMany(
		(type) => ProductDetails,
		(product_details) => product_details.product_id,
	)
	variants: ProductDetails[]

	@OneToMany((type) => Images, (images) => images.product_id)
	images: Images[]

	@OneToOne((type) => MainImages, (main_image) => main_image.product_id)
	main_image: MainImages
}
