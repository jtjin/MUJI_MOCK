import { Tag } from './Tag'
import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	ManyToOne,
	JoinColumn,
	CreateDateColumn,
	UpdateDateColumn,
} from 'typeorm'
import { Product } from './Product'

@Entity({ name: 'product_details' })
export class ProductDetails {
	@PrimaryGeneratedColumn({
		type: 'bigint',
	})
	id: string

	@Column({
		type: 'int',
	})
	stock: number

	@Column({
		type: 'int',
		nullable: false,
	})
	price!: number

	@Column({
		nullable: false,
		type: 'varchar',
	})
	main_spec: string

	@Column({
		nullable: false,
		type: 'varchar',
	})
	sub_spec: string

	@Column({
		type: 'int',
		nullable: false,
	})
	code!: string

	// @Column({
	// 	nullable: false,
	// 	type: 'varchar',
	// })
	// size: string

	// @Column({
	// 	nullable: false,
	// 	type: 'varchar',
	// })
	// name: string

	// @Column({
	// 	nullable: false,
	// 	type: 'varchar',
	// })
	// color_code: string

	@ManyToOne((type) => Product, (product) => product.variants)
	@JoinColumn({
		name: 'product_id',
	})
	product_id: Product | string

	@CreateDateColumn()
	createdAt!: Date

	@UpdateDateColumn()
	updatedAt!: Date
}
