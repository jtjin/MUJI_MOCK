import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	ManyToOne,
	JoinColumn,
} from 'typeorm'
import { Product } from './Product'

@Entity({ name: 'images' })
export class Images {
	@PrimaryGeneratedColumn({
		type: 'bigint',
	})
	id!: string

	@Column({
		nullable: false,
		type: 'varchar',
	})
	name!: string

	@Column({
		nullable: false,
		type: 'varchar',
	})
	url!: string

	@ManyToOne((type) => Product, (product) => product.id)
	@JoinColumn({
		name: 'product_id',
	})
	product_id!: Product | string
}
