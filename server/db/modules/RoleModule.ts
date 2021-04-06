import {
	Connection,
	EntityManager,
	InsertResult,
	Repository,
	UpdateResult,
} from 'typeorm'
import { Role } from '../entities/Role'

export class RoleModule {
	client?: Connection
	tag: string
	Repo: Repository<Role>

	constructor(opt: { client?: Connection; transaction?: EntityManager }) {
		const { client, transaction } = opt
		this.client = client

		if (transaction) {
			this.Repo = transaction.getRepository(Role)
		} else if (this.client) {
			this.Repo = this.client.getRepository(Role)
		}
		this.tag = 'roleModule/'
	}

	async getRoleById(id: Role | string): Promise<Role | undefined> {
		try {
			return await this.Repo.createQueryBuilder('role')
				.where('role.id = :id', { id })
				.getOne()
		} catch (error) {
			throw error
		}
	}
}
