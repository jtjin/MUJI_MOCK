import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity({ name: 'category' })
export class Category {
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
