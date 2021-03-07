const globalVersion = '/api/' + '1.0' + '/'
const imagesBaseUrl =
	'https://s3-ap-northeast-1.amazonaws.com/white-100.online/Stylish/'

const config = {
	api: {
		admin: {
			product: globalVersion + 'admin/product',
		},
		user: {
			signUp: globalVersion + 'user/register',
			signIn: globalVersion + 'user/logIn',
		},
		globalVersion: globalVersion,
		product: {
			list: globalVersion + 'products/',
			details: globalVersion + 'products/details',
		},

		marketing: {
			campaigns: globalVersion + 'marketing/campaigns',
		},
	},
	images: {
		users: {
			profilePictureBase:
				'https://s3-ap-northeast-1.amazonaws.com/white-100.online/Stylish/user/',
		},
		product: imagesBaseUrl + 'products',
		campaigns: imagesBaseUrl + 'campaigns',
	},
}

export default config
