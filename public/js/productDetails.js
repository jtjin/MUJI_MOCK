import { publicApi } from './infra/apis.js'
import config from './infra/config.js'

let that

class ProductDetailManager {
	focusedProductInfo = {}
	totalUserQuantities
	colorsContainer
	sizesContainer
	remainStock
	productMainInfo
	cartList = []

	constructor() {
		that = this
		const productId = window.location.search.split('=')[1]
		this.fetchAndRenderProductDetails(productId)

		this.totalUserQuantities = document.querySelector('.value')
		this.colorsContainer = document.querySelector('.colors')
		this.sizesContainer = document.querySelector('.sizes')
		this.productMainInfo = document.querySelector('.productMainInfo')
		this.remainStock = document.querySelector('.remainStock')
		document
			.getElementById('product-add-cart-btn')
			.addEventListener('click', this.checkout)
		document.querySelector('.add').addEventListener('click', () => {
			this.calc('+')
		})
		document.querySelector('.minus').addEventListener('click', () => {
			this.calc('-')
		})
	}

	connectedCallback() {}

	async fetchAndRenderProductDetails(productId) {
		const { data } = (
			await publicApi.get(config.api.product.details + `?id=${productId}`)
		).data
		this.renderProduct(data)
	}

	renderProduct(productInfo) {
		console.log('productInfo-->', productInfo)
		const { story, colors, images, variants, sizes } = productInfo

		this.focusedProductInfo = {
			...productInfo,
			size: sizes[0],
			color: colors[0].code,
			quantity: 1,
			stock: variants[0].stock,
		}

		this.fetchVariantStock()
		this.renderBasicProductInfo({ ...productInfo })
		// this.renderColorVariant(colors)
		// this.renderSizesVariant(sizes)
		this.renderAdvertisingProductInfo(story, images)
	}

	renderBasicProductInfo(productInfo) {
		const {
			id,
			title,
			description,
			price,
			texture,
			wash,
			place,
			main_image,
		} = productInfo

		document.querySelector('.id').innerHTML = id
		document.querySelector('.name').innerHTML = title
		document.querySelector('.description').innerHTML = description
		document.querySelector('.price').innerHTML = 'TWD.' + price
		document.querySelector('.texture').innerHTML = texture
		document.querySelector('.wash').innerHTML = '清洗 : ' + wash
		document.querySelector('.place').innerHTML = '產地 : ' + place
		document
			.querySelector('.main_image')
			.setAttribute('src', config.images.product + main_image)
	}

	renderAdvertisingProductInfo(story, images) {
		document.querySelector('.story').innerHTML = story
		images.forEach((image) => {
			const productImg = document.createElement('img')
			productImg.setAttribute('src', config.images.product + image)
			this.productMainInfo.appendChild(productImg)
		})
	}

	renderColorVariant(colorsVariantsInfo) {
		colorsVariantsInfo.forEach((colorInfo) => {
			const colorsTemp = document.getElementsByTagName('template')[0]
			const colorsTempClone = colorsTemp.content.cloneNode(true)
			const colorDiv = colorsTempClone.querySelector('.color')
			colorDiv.setAttribute('style', `background-color:#${colorInfo.code}`)
			colorDiv.addEventListener('click', this._selectColor)
			colorDiv.innerHTML = colorInfo.code
			this.colorsContainer.appendChild(colorsTempClone)
		})
		document.querySelector('.color').setAttribute('id', 'chosenColor')
	}

	_selectColor() {
		document.querySelectorAll('.color').forEach((color) => {
			color.setAttribute('id', '')
		})
		this.setAttribute('id', 'chosenColor')
		that.focusedProductInfo.color = this.innerHTML
		that.fetchVariantStock()
	}

	renderSizesVariant(sizeVariantsInfo) {
		sizeVariantsInfo.forEach((size) => {
			const sizesTemp = document.getElementsByTagName('template')[1]
			const sizesTempClone = sizesTemp.content.cloneNode(true)
			const sizeDiv = sizesTempClone.querySelector('.size')
			sizeDiv.addEventListener('click', this._selectSize)
			sizeDiv.innerHTML = size
			this.sizesContainer.appendChild(sizesTempClone)
		})
		document.querySelector('.size').setAttribute('id', 'chosenSize')
	}

	_selectSize() {
		document.querySelectorAll('.size').forEach((size) => {
			size.setAttribute('id', '')
		})
		this.setAttribute('id', 'chosenSize')
		that.focusedProductInfo.size = this.innerHTML
		that.fetchVariantStock()
	}

	checkout() {
		that.fetchVariantStock()
		const {
			id,
			title,
			price,
			main_image,
			size,
			color,
			quantity,
			stock,
		} = that.focusedProductInfo

		that.cartList.push({
			id,
			title,
			price,
			main_image,
			size,
			color,
			quantity,
			stock,
		})

		document
			.querySelector('stylish-nav')
			.shadowRoot.querySelector('#cart-qty').innerHTML = that.cartList.length
		localStorage.setItem('cart', JSON.stringify(that.cartList))
		alert('加入購物車！結帳請點右上角購物車！')
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

	fetchVariantStock() {
		const { stock } = this.focusedProductInfo.variants.find((variant) => {
			if (
				variant.color_code == this.focusedProductInfo.color &&
				variant.size == this.focusedProductInfo.size
			) {
				return variant
			}
		})
		this.remainStock.innerHTML = stock
		this.totalUserQuantities.innerHTML = 0
	}
}

const productDetailManager = new ProductDetailManager()
