import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	ManyToOne,
	JoinColumn,
	UpdateDateColumn,
} from 'typeorm'
import { User } from './User'

@Entity({ name: 'pinMessages' })
export class PinMessages {
	@PrimaryGeneratedColumn({
		type: 'bigint',
	})
	id: string

	@Column({
		type: 'varchar',
	})
	message: string

	@ManyToOne((type) => User)
	@JoinColumn({
		name: 'user_id',
	})
	user_id: User | string
}
