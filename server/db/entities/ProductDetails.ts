import { Tag } from './Tag'
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
		nullable: false,
		type: 'varchar',
	})
	size: string

	@Column({
		nullable: false,
		type: 'varchar',
	})
	name: string

	@Column({
		nullable: false,
		type: 'varchar',
	})
	color_code: string

	@ManyToOne((type) => Product, (product) => product.variants)
	@JoinColumn({
		name: 'product_id',
	})
	product_id: Product
}
