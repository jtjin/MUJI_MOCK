import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	JoinColumn,
	ManyToOne,
	OneToMany,
} from 'typeorm'

import { Role } from './Role'
import { Cart } from './Cart'

@Entity({ name: 'user' })
export class User {
	@PrimaryGeneratedColumn({
		type: 'bigint',
	})
	id!: string

	@Column({
		nullable: false,
		type: 'varchar',
	})
	provider!: string

	@Column({
		nullable: false,
		type: 'varchar',
	})
	name!: string

	@Column({
		nullable: false,
		type: 'varchar',
	})
	email!: string

	@Column({
		nullable: false,
		type: 'varchar',
	})
	password!: string

	@Column({
		nullable: false,
		type: 'varchar',
	})
	picture!: string

	@Column({
		nullable: false,
		type: 'varchar',
	})
	access_token!: string

	@ManyToOne((type) => Role)
	@JoinColumn({
		name: 'role_id',
	})
	role: Role

	@OneToMany((type) => Cart, (cart) => cart.variant_id)
	cart: Cart[]
}
