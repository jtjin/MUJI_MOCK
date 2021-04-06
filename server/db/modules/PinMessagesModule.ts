import { Connection, EntityManager, InsertResult, Repository } from 'typeorm'
import { PinMessages } from '../entities/PinMessages'

export class PinMessagesModule {
	client?: Connection
	tag: string
	Repo: Repository<PinMessages>

	constructor(opt: { client?: Connection; transaction?: EntityManager }) {
		const { client, transaction } = opt
		this.client = client

		if (transaction) {
			this.Repo = transaction.getRepository(PinMessages)
		} else if (this.client) {
			this.Repo = this.client.getRepository(PinMessages)
		}
		this.tag = 'pinMessages/'
	}

	async getPinMessagesByAdminId(opt: {
		adminId: string
	}): Promise<PinMessages[]> {
		try {
			const { adminId } = opt
			return await this.Repo.createQueryBuilder('')
				.where('user_id = :adminId', {
					adminId,
				})
				.getMany()
		} catch (error) {
			throw error
		}
	}

	async deletePinMessage(opt: { adminId: string; message: string }) {
		try {
			const { adminId, message } = opt
			return await this.Repo.createQueryBuilder()
				.delete()
				.from(PinMessages)
				.where('user_id = :adminId', {
					adminId,
				})
				.andWhere('message = :message', {
					message,
				})
				.execute()
		} catch (error) {
			throw error
		}
	}

	async createPinMessages(
		values: Partial<PinMessages>[],
	): Promise<InsertResult> {
		try {
			return await this.Repo.createQueryBuilder()
				.insert()
				.into(PinMessages)
				.values(values)
				.execute()
		} catch (error) {
			throw error
		}
	}

	async updateRoomMessages(room: string, message: string) {
		try {
			return await this.Repo.createQueryBuilder()
				.update(PinMessages)
				.set({ message })
				.where('room = :room', { room })
				.execute()
		} catch (error) {
			throw error
		}
	}
}
