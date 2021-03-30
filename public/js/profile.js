import { privateApi } from './apis.js'
import config from './infra/config.js'

renderUserInfo()

async function renderUserInfo() {
	try {
		const { data } = (await privateApi.get(config.api.user.profile)).data
		const { id, name, email, picture } = data
		document.querySelector('.id').innerHTML = id
		document.querySelector('.name').innerHTML = name
		document.querySelector('.email').innerHTML = email
		document
			.querySelector('.img')
			.setAttribute('src', config.images.users.profilePictureBase + picture)
	} catch (err) {
		console.log(err)
	}
}
