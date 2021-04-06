import {
	Connection,
	DeleteResult,
	EntityManager,
	InsertResult,
	Repository,
	UpdateResult,
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
			.leftJoinAndSelect('cart.product_id', 'product_id')
			.where('user_id = :userId', {
				userId,
			})
			.getMany()
	}

	async getCartItemsById(userId: string) {
		return await this.Repo.createQueryBuilder('cart')
			.leftJoinAndSelect('cart.variant_id', 'variant_id')
			.leftJoinAndSelect('cart.product_id', 'product_id')
			.where('user_id = :userId', {
				userId,
			})
			.getMany()
	}

	async insertOrUpdateCartItem(value: {
		user_id: string
		quantity: number
		variant_id: string
		product_id: string
	}) {
		try {
			const { user_id, quantity, variant_id, product_id } = value

			const result = await this.Repo.createQueryBuilder('cart')
				.update(Cart)
				.where('user_id = :user_id', { user_id })
				.andWhere('product_detail_id = :variant_id', { variant_id })
				.andWhere('product_id = :product_id', { product_id })
				.set({ quantity: () => `quantity + ${quantity}` })
				.execute()

			if (!result.raw.affectedRows) {
				return await this.Repo.createQueryBuilder()
					.insert()
					.into(Cart)
					.values([value])
					.execute()
			}
			return result
		} catch (error) {
			throw error
		}
	}

	async deleteItemById(opt: {
		variantId: string
		productId: string
		userId: string
	}): Promise<DeleteResult> {
		try {
			const { variantId, userId, productId } = opt
			return await this.Repo.createQueryBuilder()
				.delete()
				.from(Cart)
				.where('user_id = :userId', {
					userId,
				})
				.andWhere('variant_id = :variantId', {
					variantId,
				})
				.andWhere('product_id = :productId', {
					productId,
				})
				.execute()
		} catch (error) {
			throw error
		}
	}

	async updateItemQuantityById(opt: {
		variantId: string
		productId: string
		userId: string
		quantity: number
	}): Promise<UpdateResult> {
		try {
			const { userId, quantity, variantId, productId } = opt

			return await this.Repo.createQueryBuilder('cart')
				.update(Cart)
				.where('user_id = :userId', { userId })
				.andWhere('product_detail_id = :variantId', { variantId })
				.andWhere('product_id = :productId', { productId })
				.set({ quantity: () => `quantity + ${quantity}` })
				.execute()
		} catch (error) {
			throw error
		}
	}
}
