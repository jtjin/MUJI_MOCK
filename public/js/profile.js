'use strict'
import { privateApi } from './infra/apis.js'
import config from './infra/config.js'

renderUserInfo()

async function renderUserInfo() {
	const { data } = (await privateApi.get(config.api.user.profile)).data
	const { id, name, email, picture } = data
	document.querySelector('.id').innerHTML = id
	document.querySelector('.name').innerHTML = name
	document.querySelector('.email').innerHTML = email
	document
		.querySelector('.img')
		.setAttribute('src', config.images.users.profilePictureBase + picture)
}
