import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	JoinColumn,
	ManyToOne,
} from 'typeorm'

import { Role } from './Role'

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
}
