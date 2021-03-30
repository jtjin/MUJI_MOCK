import {
	Connection,
	EntityManager,
	InsertResult,
	Repository,
	UpdateResult,
} from 'typeorm'

import { User } from '../entities/User'

export class UserModule {
	client?: Connection
	tag: string
	Repo: Repository<User>

	constructor(opt: { client?: Connection; transaction?: EntityManager }) {
		const { client, transaction } = opt
		this.client = client

		if (transaction) {
			this.Repo = transaction.getRepository(User)
		} else if (this.client) {
			this.Repo = this.client.getRepository(User)
		}
		this.tag = 'userModule/'
	}

	async getUserByEmail(userEmail: string): Promise<User | undefined> {
		return await this.Repo.createQueryBuilder('user')
			.where('user.email = :userEmail', { userEmail })
			.leftJoinAndSelect('user.role', 'role')
			.getOne()
	}

	async getUserByAccessToken(accessToken: string): Promise<User | undefined> {
		return await this.Repo.createQueryBuilder('user')
			.where('user.access_token= :accessToken', { accessToken })
			.getOne()
	}

	async updateAccessToken(
		email: string,
		accessToken: string,
	): Promise<UpdateResult> {
		return await this.Repo.createQueryBuilder()
			.update(User)
			.set({ access_token: accessToken })
			.where('email = :email', { email })
			.execute()
	}

	async createNewUser(values: {
		name: string
		email: string
		password?: string
		access_token: string
		picture?: string
		provider: string
		role?: string
	}): Promise<InsertResult> {
		return await this.Repo.createQueryBuilder()
			.insert()
			.into(User)
			// @ts-ignore
			.values([values])
			.execute()
	}
}
