import { publicApi } from './apis.js'
import config from './infra/config.js'

class ProductListManager {
	productCategory
	constructor() {
		const key = window.location.search.split('?')[1]

		let productCategory
		if (!key) {
			productCategory = 'all'
		} else if (key.split('=')[0] == 'tag') {
			productCategory = key.split('=')[1]
		} else {
			productCategory = 'search?' + key
		}

		this.renderProducts(productCategory)
	}

	async renderProducts(productCategory) {
		const { data } = (
			await publicApi.get(config.api.product.list + productCategory)
		).data
		this.createProductElements(data)
	}

	createProductElements(productsInfo) {
		const productsContainer = document.querySelector('.products')
		productsContainer.innerHTML = ''
		productsInfo.forEach((productInfo) => {
			const productTempClone = document
				.getElementsByTagName('template')[1]
				.content.cloneNode(true)
			productTempClone.querySelector(
				'a',
			).href = `/product.html?id=${productInfo.id}`
			productTempClone.querySelector('img').src =
				config.images.product + productInfo.main_image
			const productDivColors = productTempClone.querySelector('.colors')

			productInfo.colors.forEach((color) => {
				const productDicColor = document.createElement('div')
				productDicColor.setAttribute('class', 'color')
				productDicColor.setAttribute('style', `background-color:#${color.code}`)
				productDivColors.appendChild(productDicColor)
			})

			productTempClone.querySelector('.name').innerHTML = productInfo.title

			productTempClone.querySelector(
				'.price',
			).innerHTML = `TWD.${productInfo.price}`

			productsContainer.appendChild(productTempClone)
		})
	}
}

class SliderManager {
	constructor() {
		this.renderCampaignSliders()
	}

	async renderCampaignSliders() {
		const { data } = (await publicApi.get(config.api.marketing.campaigns)).data
		this._createSliders(data)
	}

	async _createSliders(sliders) {
		sliders.forEach((slider) => {
			const sliderClone = document
				.getElementsByTagName('template')[0]
				.content.cloneNode(true)
			sliderClone
				.querySelector('.mainSliders')
				.setAttribute(
					'style',
					'background-image:url' +
						'(' +
						config.images.campaigns +
						slider.picture +
						')',
				)

			sliderClone
				.querySelector('.visual')
				.setAttribute('href', `/product.html?id=${slider.id}`)

			sliderClone.querySelector('.story').innerHTML = slider.story

			document.querySelector('.sliderContent').appendChild(sliderClone)

			this._createSliderOptions()
		})
		this._setFirstSlider()
		this._setSliderMotion()
	}

	_setFirstSlider() {
		document.querySelector('.mainSliders').id = 'top'
		document.querySelector('.sliderOption').id = 'topDot'
	}

	_createSliderOptions() {
		const sliderOption = document.createElement('li')
		sliderOption.setAttribute('class', `sliderOption`)
		document.querySelector('.slideControllerUL').appendChild(sliderOption)
	}

	_setSliderMotion() {
		setInterval(() => {
			const nextSlider = document.querySelector('#top').nextElementSibling
			const nextDot = document.querySelector('#topDot').nextElementSibling

			document.querySelectorAll('.mainSliders').forEach((slider) => {
				slider.removeAttribute('id')
			})

			document.querySelectorAll('.sliderOption').forEach((dot) => {
				dot.removeAttribute('id')
			})

			if (nextSlider != null) {
				nextSlider.setAttribute('id', 'top')
				nextDot.setAttribute('id', 'topDot')
			} else {
				this._setFirstSlider()
			}
		}, 5000)
	}
}

const productListManager = new ProductListManager()
const sliderManager = new SliderManager()
