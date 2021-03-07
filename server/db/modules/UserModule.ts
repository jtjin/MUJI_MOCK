import { Connection, InsertResult, UpdateResult } from 'typeorm'
import { User } from '../entities/User'

export class UserModule {
	client: Connection
	tag: string

	constructor(client: Connection) {
		this.client = client
		this.tag = 'userModule/'
	}

	async getUserByEmail(userEmail: string): Promise<User | undefined> {
		return await this.client
			.getRepository(User)
			.createQueryBuilder('user')
			.where('user.email = :userEmail', { userEmail })
			.getOne()
	}

	async getUserByAccessToken(accessToken: string): Promise<User | undefined> {
		return await this.client
			.getRepository(User)
			.createQueryBuilder('user')
			.where('user.access_token= :accessToken', { accessToken })
			.getOne()
	}

	async updateAccessToken(
		email: string,
		accessToken: string,
	): Promise<UpdateResult> {
		return await this.client
			.createQueryBuilder()
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
		picture: string
		provider: string
	}): Promise<InsertResult> {
		return await this.client
			.createQueryBuilder()
			.insert()
			.into(User)
			.values([values])
			.execute()
	}
}
