import {
	Connection,
	DeleteResult,
	EntityManager,
	InsertResult,
	Repository,
} from 'typeorm'
import { Cart } from '../entities/Cart'

export class CartModule {
	client?: Connection
	tag: string
	Repo: Repository<Cart>

	constructor(opt: { client?: Connection; transaction?: EntityManager }) {
		const { client, transaction } = opt
		this.client = client

		if (transaction) {
			this.Repo = transaction.getRepository(Cart)
		} else if (this.client) {
			this.Repo = this.client.getRepository(Cart)
		}
		this.tag = 'productModule/'
	}

	async getCartItemsByUserId(userId: string) {
		return await this.Repo.createQueryBuilder('cart')
			.leftJoinAndSelect('cart.variant_id', 'variant_id')
			.where('user_id = :userId', {
				userId,
			})
			.getMany()
	}

	async insertCartItem(values: Partial<Cart>[]): Promise<InsertResult> {
		return await this.Repo.createQueryBuilder()
			.insert()
			.into(Cart)
			.values(values)
			.execute()
	}

	async deleteItemById(opt: {
		id: string
		userId: string
	}): Promise<DeleteResult> {
		const { id, userId } = opt
		return await this.Repo.createQueryBuilder()
			.delete()
			.from(Cart)
			.where('user_id = :userId', {
				userId,
			})
			.andWhere('id = :id', {
				id,
			})
			.execute()
	}
}
