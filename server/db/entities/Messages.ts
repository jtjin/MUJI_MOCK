import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	ManyToOne,
	JoinColumn,
	UpdateDateColumn,
} from 'typeorm'
import { User } from './User'

@Entity({ name: 'messages' })
export class Messages {
	@PrimaryGeneratedColumn({
		type: 'bigint',
	})
	id: string

	@Column({
		type: 'json',
	})
	messages: string

	@Column({
		nullable: false,
		type: 'varchar',
	})
	room!: string

	@Column({
		type: 'varchar',
	})
	user_name: string

	@Column({
		type: 'varchar',
	})
	admin_name: string

	@UpdateDateColumn()
	updatedAt!: Date

	@Column({
		type: 'boolean',
	})
	adminRead: boolean

	@ManyToOne((type) => User)
	@JoinColumn({
		name: 'admin_id',
	})
	admin_id: User | string

	@ManyToOne((type) => User)
	@JoinColumn({
		name: 'user_id',
	})
	user_id: User | string
}
