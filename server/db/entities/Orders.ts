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
import { User } from './User'

@Entity({ name: 'orders' })
export class Orders {
	@PrimaryGeneratedColumn({
		type: 'bigint',
	})
	id!: string

	@Column({
		type: 'bigint',
	})
	total!: number

	@Column({ type: 'varchar' })
	payment_state!: string

	@Column({ type: 'varchar' })
	pay_way!: string

	@Column({ type: 'varchar' })
	shipping!: string

	@Column({ type: 'varchar' })
	freight!: string

	@ManyToOne((type) => User, (user) => user.id)
	@JoinColumn({
		name: 'user_id',
	})
	user_id!: User

	@Column({ type: 'varchar' })
	rec_name!: string

	@Column({ type: 'varchar' })
	rec_phone!: string

	@Column({ type: 'varchar' })
	rec_email!: string

	@Column({ type: 'varchar' })
	rec_address!: string

	@Column({ type: 'varchar' })
	rec_time!: string
}
