const baseUrl = 'http://localhost:5000/'
// const baseUrl = 'https://white-100.online/'
const publicApi = axios.create({
	baseURL: baseUrl,
	headers: { 'Content-Type': 'application/json' },
})

const privateApi = axios.create({
	baseURL: baseUrl,
	headers: { 'Content-Type': 'application/json' },
})

privateApi.interceptors.request.use(
	(config) => {
		const access_token = JSON.parse(localStorage.getItem('stylish'))
			.access_token
		if (!access_token) {
			window.location('/profile.html')
		}
		config.headers.Authorization = `${access_token}`
		return config
	},
	(error) => {
		return Promise.reject(error)
	},
)

publicApi.interceptors.response.use(
	(resp) => {
		return resp
	},
	(error) => {
		console.log(error)
		const errResponse = error.response || {}
		const { status, data } = errResponse
		const { type } = data.error

		if (status === 403) localStorage.removeItem('stylish')

		switch (type) {
			case 'FORBIDDEN':
			case 'USER_NOT_FOUND':
				alert('Invalid Password or Email...')
				console.log(errResponse)
				break
			case 'AUTH_NO_TOKEN':
			case 'AUTH_NO_IDENTITY':
			case 'USER_INVALID_TOKEN':
				console.log(errResponse)
				localStorage.removeItem('stylish')
				alert('Please Log In...')
				break
			default:
				console.log(error)
				break
		}

		return Promise.reject(error)
	},
)

privateApi.interceptors.response.use(
	(resp) => {
		return resp
	},
	(error) => {
		const errResponse = error.response || {}
		const { status, data } = errResponse
		const { type } = data.error

		if (status === 403) {
			localStorage.removeItem('token')
		}

		switch (type) {
			case 'FORBIDDEN':
			case 'USER_NOT_FOUND':
				alert('Invalid Password or Email...')
				localStorage.removeItem('stylish')
				window.location.reload()
				break
			case 'USER_INVALID_TOKEN':
				console.log(errResponse)
				localStorage.removeItem('stylish')
				alert('Please Log In...')
				break
			default:
				console.log(error)
				break
		}

		return Promise.reject(error)
	},
)

export { publicApi, privateApi }
