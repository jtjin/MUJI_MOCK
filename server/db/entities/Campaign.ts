import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm'
import { Product } from './Product'

@Entity({ name: 'campaign' })
export class Campaign {
	@PrimaryGeneratedColumn({
		type: 'bigint',
	})
	id!: string

	@Column({
		nullable: false,
		type: 'varchar',
	})
	story!: string

	@Column({
		nullable: false,
		type: 'varchar',
	})
	url!: string

	@OneToOne((type) => Product, (product) => product.id)
	product_id!: Product
}
