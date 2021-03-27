import { Connection, EntityManager, InsertResult, Repository } from 'typeorm'
import { Messages } from '../entities/Messages'

export class MessagesModule {
	client?: Connection
	tag: string
	Repo: Repository<Messages>

	constructor(opt: { client?: Connection; transaction?: EntityManager }) {
		const { client, transaction } = opt
		this.client = client

		if (transaction) {
			this.Repo = transaction.getRepository(Messages)
		} else if (this.client) {
			this.Repo = this.client.getRepository(Messages)
		}
		this.tag = 'messageModule/'
	}

	async getMessagesByRoom(room: string) {
		return this.Repo.createQueryBuilder()
			.where('room = :room', {
				room,
			})
			.getOne()
	}

	async getChatRoomsListById(opt: { userId?: string; adminId?: string }) {
		const { userId, adminId } = opt
		let query = this.Repo.createQueryBuilder('m').select(
			'm.room, m.updatedAt, m.admin_id,  m.user_id, m.adminRead',
		)
		if (userId) query = query.where('user_id = :userId', { userId })
		if (adminId) query = query.where('admin_id = :adminId', { adminId })
		return await query.orderBy('m.updatedAt', 'ASC').getRawMany()
	}

	async createMessages(values: Partial<Messages>[]): Promise<InsertResult> {
		console.log('createMessages=>', values)

		return await this.Repo.createQueryBuilder()
			.insert()
			.into(Messages)
			.values(values)
			.execute()
	}

	async updateRoomMessages(room: string, messages: string) {
		return await this.Repo.createQueryBuilder()
			.update(Messages)
			.set({ messages })
			.where('room = :room', { room })
			.execute()
	}
}
