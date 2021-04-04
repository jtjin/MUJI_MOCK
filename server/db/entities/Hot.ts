import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { Product } from './Product'

@Entity({ name: 'hot' })
export class Hot {
	@PrimaryGeneratedColumn({
		type: 'bigint',
	})
	id!: string

	@Column({
		length: 80,
		nullable: false,
		type: 'varchar',
	})
	title!: string

	@OneToMany((type) => Product, (product) => product.hot_id)
	product?: Product[]
}
