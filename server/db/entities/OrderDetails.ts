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
import { Orders } from './Orders'

@Entity({ name: 'order_details' })
export class OrderDetails {
	@PrimaryGeneratedColumn({
		type: 'bigint',
	})
	id!: string

	@OneToOne((type) => Orders, (order) => order.id)
	order_id!: Orders

	@Column({
		nullable: false,
		type: 'int',
	})
	price!: number

	@Column({
		nullable: false,
		type: 'varchar',
	})
	code!: string

	@Column({
		nullable: false,
		type: 'varchar',
	})
	name!: string

	@Column({
		nullable: false,
		type: 'varchar',
	})
	size!: string

	@Column({
		nullable: false,
		type: 'int',
	})
	qty!: number
}
