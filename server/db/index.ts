import { Connection, ConnectionOptions, createConnection } from 'typeorm'
import { ProductModule } from './modules/ProductModule'
import { ProductDetailsModule } from './modules/ProductDetailsModule'
import { MainImagesModule } from './modules/MainImagesModule'
import { ImagesModule } from './modules/ImagesModule'
import { CampaignModule } from './modules/CampaignModule'
import { UserModule } from './modules/UserModule'
import { MessagesModule } from './modules/MessagesModules'
import { PinMessagesModule } from './modules/PinMessagesModule'
import { RoleModule } from './modules/RoleModule'
import config from 'config'
import logger from '../utils/logger'

const tag = '/db/index'
let dbConnection

const Entities = Array.from(
	{ length: 26 },
	(v, i) => `${__dirname}/entities/${String.fromCharCode(i + 65)}*.js`,
)
class StylishRDB {
	client: Connection
	productModule: ProductModule
	campaignModule: CampaignModule
	productDetailsModule: ProductDetailsModule
	userModule: UserModule
	imagesModule: ImagesModule
	mainImagesModule: MainImagesModule
	messagesModule: MessagesModule
	pinMessagesModule: PinMessagesModule
	roleModule: RoleModule

	async initDb() {
		const connectionConfig: ConnectionOptions = {
			type: 'mysql',
			name: 'stylish',
			host: String(config.get('aws.rds.host')),
			username: String(config.get('aws.rds.username')),
			password: String(config.get('aws.rds.password')),
			database: String(config.get('aws.rds.database')),
			synchronize: false,
			logging: false,
			entities: Entities,
		}

		this.client = await createConnection(connectionConfig)

		if (this.client) {
			console.log(`--- Stylish DB Connected ---`)
		}

		this.productModule = new ProductModule({ client: this.client })
		this.userModule = new UserModule({ client: this.client })
		this.campaignModule = new CampaignModule({ client: this.client })
		this.productDetailsModule = new ProductDetailsModule({
			client: this.client,
		})
		this.imagesModule = new ImagesModule({ client: this.client })
		this.mainImagesModule = new MainImagesModule({ client: this.client })
		this.messagesModule = new MessagesModule({ client: this.client })
		this.pinMessagesModule = new PinMessagesModule({ client: this.client })
		this.roleModule = new RoleModule({ client: this.client })
		dbConnection = this.client
		return this.client
	}

	async disconnectDb() {
		try {
			logger.info({ tag, msg: '--- Disconnect Stylish Database --' })
			if (this.client) await this.client.close()
		} catch (error) {
			logger.error({ tag, error })
			throw error
		}
	}
}

export = new StylishRDB()
exports.connection = dbConnection
