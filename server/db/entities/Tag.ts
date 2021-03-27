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
} from 'typeorm'
import { Product } from './Product'

@Entity({ name: 'tag' })
export class Tag {
	@PrimaryGeneratedColumn({
		type: 'bigint',
	})
	id!: string

	@Column({
		length: 80,
		nullable: false,
		type: 'varchar',
	})
	name!: string

	@OneToMany((type) => Product, (product) => product.tag_id)
	product?: Product[] | string
}
