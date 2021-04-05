import { publicApi, privateApi } from './infra/apis.js'
import config from './infra/config.js'

let that

class ProductDetailManager {
	constructor() {
		that = this
		this.focusedProductInfo = {}
		const productId = window.location.search.split('=')[1]
		this.fetchAndRenderProductDetails(productId)
		this.mainSpecName = document.querySelector('.mainSpecName')
		this.subSpecName = document.querySelector('.subSpecName')
		this.mainSpecVariantContainer = document.querySelector(
			'.mainSpecVariantContainer',
		)
		this.subSpecVariantContainer = document.querySelector(
			'.subSpecVariantContainer',
		)
		this.totalUserQuantities = document.querySelector('.quantity-value')

		this.productMainInfo = document.querySelector('.productMainInfo')
		this.remainStock = document.querySelector('.remainStock > span')
		this.priceSpan = document.querySelector('.price > span')
		this.codeSpan = document.querySelector('.code > span')

		document
			.getElementById('product-add-cart-btn')
			.addEventListener('click', this.addToCart)
		document.querySelector('.quantity-add').addEventListener('click', () => {
			this.calc('+')
		})
		document.querySelector('.quantity-minus').addEventListener('click', () => {
			this.calc('-')
		})
	}

	async fetchAndRenderProductDetails(productId) {
		const { data } = (
			await publicApi.get(config.api.product.details + `?id=${productId}`)
		).data
		this.renderProduct(data)
	}

	renderProduct(productInfo) {
		const {
			story,
			images,
			variants,
			specs,
			main_specs,
			sub_specs,
		} = productInfo
		this.focusedProductInfo = {
			...productInfo,
			quantity: 1,
			stock: variants[0].stock,
		}

		const specsArr = specs.split(',')

		if (specsArr.length === 2) {
			this.mainSpecName.innerHTML = specsArr[0].trim()
			this.subSpecName.innerHTML = specsArr[1].trim()
		} else if (specsArr.length === 1) {
			this.mainSpecName.innerHTML = specsArr[0].trim()
		}

		main_specs.split(',').forEach((variants, index) => {
			const variantSpan = document.createElement('span')
			variantSpan.classList.add('itemBlock')
			variantSpan.addEventListener('click', (e) => {
				document
					.querySelector('.mainSpecVariantContainer .itemBlockSelected')
					.classList.remove('itemBlockSelected')
				e.target.classList.add('itemBlockSelected')
				this.focusedProductInfo.main_spec = e.target.innerText
				this.fetchVariantStock()
			})
			if (index === 0) {
				variantSpan.classList.add('itemBlockSelected')
				this.focusedProductInfo.main_spec = variants.trim()
			}
			variantSpan.innerHTML = variants.trim()
			this.mainSpecVariantContainer.appendChild(variantSpan)
		})
		if (sub_specs) {
			sub_specs.split(',').forEach((variants, index) => {
				const variantSpan = document.createElement('span')
				variantSpan.innerHTML = variants.trim()
				variantSpan.classList.add('itemBlock')
				variantSpan.addEventListener('click', (e) => {
					document
						.querySelector('.subSpecVariantContainer .itemBlockSelected')
						.classList.remove('itemBlockSelected')
					e.target.classList.add('itemBlockSelected')
					this.focusedProductInfo.sub_spec = e.target.innerText
					this.fetchVariantStock()
				})

				if (index === 0) {
					variantSpan.classList.add('itemBlockSelected')
					this.focusedProductInfo.sub_spec = variants.trim()
				}
				this.subSpecVariantContainer.appendChild(variantSpan)
			})
		}

		this.fetchVariantStock()
		this.renderBasicProductInfo({ ...productInfo })
		this.renderAdvertisingProductInfo(story, images)
	}

	renderBasicProductInfo(productInfo) {
		const {
			id,
			title,
			description,
			texture,
			wash,
			place,
			main_image,
		} = productInfo

		document.querySelector('.name').innerHTML = title
		document.querySelector('.description').innerHTML = description
		document.querySelector('.texture').innerHTML = texture
		if (wash) document.querySelector('.wash').innerHTML = '清洗 : ' + wash
		document.querySelector('.place').innerHTML = '產地 : ' + place
		document
			.querySelector('.main_image')
			.setAttribute('src', config.images.product + main_image.url)
	}

	renderAdvertisingProductInfo(story, images) {
		document.querySelector('.story').innerHTML = story
		images.forEach((image) => {
			const productImg = document.createElement('img')
			productImg.setAttribute('src', config.images.product + image.url)
			this.productMainInfo.appendChild(productImg)
		})
	}

	async addToCart() {
		const variantId = await that.fetchVariantStock()
		const { id: productId, quantity } = that.focusedProductInfo

		if (!that.checkLoginStatus()) return

		await privateApi({
			url: config.api.user.cart,
			method: 'POST',
			data: { productId, variantId, quantity },
		})

		that.renderCartListQuantities()
	}

	async checkLoginStatus() {
		const localUserInfo = JSON.parse(localStorage.getItem('muji'))

		if (!localUserInfo || !localUserInfo.access_token) {
			document
				.querySelector('sign-form')
				.shadowRoot.querySelector('.registerContainer').style.display = 'block'
			document
				.querySelector('sign-form')
				.shadowRoot.querySelector('.logInFormBackground').style.display =
				'block'
			return
		}
		return true
	}

	async renderCartListQuantities() {
		const nav = document.querySelector('muji-nav').shadowRoot
		const cartNumber = nav.querySelector('#cart-qty')

		const { data: cartList } = (
			await privateApi({
				url: config.api.user.cart,
				method: 'GET',
			})
		).data

		if (cartList) {
			cartNumber.innerHTML = cartList.length
		}
		nav.querySelector('.cart').addEventListener('click', () => {
			document.querySelector('.paymentForm').style.display = 'flex'
		})
	}

	calc(x) {
		let ori = this.totalUserQuantities.innerHTML - 0
		let price = document.querySelector('.price').innerHTML.split('.')[1] - 0

		x == '+' ? (ori = ori + 1) : (ori = ori - 1)

		x == '-'
			? ori > 0
				? (this.totalUserQuantities.innerHTML = ori)
				: (this.totalUserQuantities.innerHTML = 0)
			: ori < this.remainStock.innerHTML
			? (this.totalUserQuantities.innerHTML = ori)
			: (this.totalUserQuantities.innerHTML = this.remainStock.innerHTML)

		this.focusedProductInfo.quantity = this.totalUserQuantities.innerHTML
		this.focusedProductInfo.price =
			(this.totalUserQuantities.innerHTML - 0) * price
	}

	async fetchVariantStock() {
		this.priceSpan.innerHTML = ''
		this.codeSpan.innerHTML = ''
		this.remainStock.innerHTML = ''
		const { id } = this.focusedProductInfo.variants.find((variant) => {
			if (
				variant.main_spec == this.focusedProductInfo.main_spec &&
				variant.sub_spec == this.focusedProductInfo.sub_spec
			) {
				return variant
			}
		})
		const { data } = (
			await publicApi.get(config.api.product.variant + `?id=${id}`)
		).data
		this.priceSpan.innerHTML = data.price
		this.codeSpan.innerHTML = data.code
		this.remainStock.innerHTML = data.stock
		this.totalUserQuantities.innerHTML = 0
		return id
	}
}

const productDetailManager = new ProductDetailManager()
