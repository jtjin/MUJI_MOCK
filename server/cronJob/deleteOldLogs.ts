import fs from 'fs'
import path from 'path'

const logsRootPath = path.join(__dirname, '../logs/')

const logsFile = fs.readdirSync(logsRootPath)

logsFile.forEach((file) => {
	fs.stat(logsRootPath + file, (err: any, stats: any) => {
		if (err) {
			throw err
		}
		console.log(logsRootPath + file)

		if (stats.mtimeMs < Date.now() - 24 * 60 * 60 * 3 * 1000) {
			fs.unlinkSync(logsRootPath + file)
		}
	})
})
