import { Connection, ConnectionOptions, createConnection } from 'typeorm'
import { ProductModule } from './modules/ProductModule'
import { ProductDetailsModule } from './modules/ProductDetailsModule'
import { MainImagesModule } from './modules/MainImagesModule'
import { ImagesModule } from './modules/ImagesModule'
import { CampaignModule } from './modules/CampaignModule'
import { UserModule } from './modules/UserModule'
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

		this.productModule = new ProductModule(this.client)
		this.userModule = new UserModule(this.client)
		this.campaignModule = new CampaignModule(this.client)
		this.productDetailsModule = new ProductDetailsModule(this.client)
		this.imagesModule = new ImagesModule(this.client)
		this.mainImagesModule = new MainImagesModule(this.client)
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
