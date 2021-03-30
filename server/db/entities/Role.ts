import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity({ name: 'role' })
export class Role {
	@PrimaryGeneratedColumn({
		type: 'bigint',
	})
	id: string

	@Column({
		nullable: false,
		type: 'varchar',
	})
	name: string
}
