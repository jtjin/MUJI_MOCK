const globalVersion = '/api/' + '1.0' + '/'
const imagesBaseUrl =
	'https://s3-ap-northeast-1.amazonaws.com/white-100.online/MUJI/'

const config = {
	api: {
		admin: {
			product: globalVersion + 'admin/product',
			chatRoomList: globalVersion + 'admin/chatRoomList',
			canMessage: globalVersion + 'admin/chatRoom/pin',
		},
		user: {
			signUp: globalVersion + 'user/signUp',
			signIn: globalVersion + 'user/signIn',
			chatRoomHistory: globalVersion + 'chatRoom/history',
			profile: globalVersion + 'user/profile',
			cart: globalVersion + 'user/cart',
			order: globalVersion + 'user/order',
		},
		globalVersion: globalVersion,
		product: {
			list: globalVersion + 'products/category',
			details: globalVersion + 'products/details',
			variant: globalVersion + 'products/variant',
		},

		marketing: {
			campaigns: globalVersion + 'marketing/campaigns',
		},
	},
	images: {
		users: {
			profilePictureBase:
				'https://s3-ap-northeast-1.amazonaws.com/white-100.online/MUJI/user/',
		},
		product: imagesBaseUrl + 'products',
		campaigns: imagesBaseUrl + 'campaigns',
	},
}

export default config
