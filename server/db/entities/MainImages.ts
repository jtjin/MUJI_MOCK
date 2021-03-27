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

@Entity({ name: 'main_image' })
export class MainImages {
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

	@OneToOne((type) => Product, (product) => product.id)
	@JoinColumn({
		name: 'product_id',
	})
	product_id!: Product | string
}
