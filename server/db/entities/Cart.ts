import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	ManyToOne,
	JoinColumn,
	CreateDateColumn,
	UpdateDateColumn,
} from 'typeorm'
import { ProductDetails } from './ProductDetails'
import { Product } from './Product'
import { User } from './User'

@Entity({ name: 'cart' })
export class Cart {
	@PrimaryGeneratedColumn({
		type: 'bigint',
	})
	id: string

	@ManyToOne((type) => ProductDetails)
	@JoinColumn({
		name: 'product_detail_id',
	})
	variant_id: ProductDetails | string

	@ManyToOne((type) => Product)
	@JoinColumn({
		name: 'product_id',
	})
	product_id: Product | string

	@ManyToOne((type) => User, (user) => user.cart)
	@JoinColumn({
		name: 'user_id',
	})
	user_id: User | string

	@Column({
		nullable: false,
		type: 'int',
	})
	quantity: number
}
