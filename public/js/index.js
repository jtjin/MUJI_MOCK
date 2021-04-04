import { publicApi } from './infra/apis.js'
import config from './infra/config.js'
function getQueryStringValue(key) {
	return decodeURIComponent(
		window.location.search.replace(
			new RegExp(
				'^(?:.*[&\\?]' +
					encodeURIComponent(key).replace(/[\.\+\*]/g, '\\$&') +
					'(?:\\=([^&]*))?)?.*$',
				'i',
			),
			'$1',
		),
	)
}
class ProductListManager {
	productCategory
	paging = 1
	next_paging

	constructor() {
		const requestLocation = window.location.search.split('?')
		const key = requestLocation[1]
		if (requestLocation[2]) {
			this.paging = requestLocation[2].split('=')[1]
		}
		let searchParams = new URLSearchParams(window.location.search)

		this.tag = getQueryStringValue('tag')
		this.category = getQueryStringValue('category')
		this.keyword = getQueryStringValue('keyword')

		this.renderProducts(this.paging)
	}

	async renderProducts(paging) {
		this.paging = paging
		let requestUrl = config.api.product.list + '?paging=' + (this.paging || 1)
		if (this.tag) requestUrl = requestUrl + '&tag=' + this.tag
		if (this.keyword) requestUrl = requestUrl + '&keyword=' + this.keyword
		if (this.category) requestUrl = requestUrl + '&category=' + this.category

		const { data, next_paging } = (await publicApi.get(requestUrl)).data

		if (next_paging) {
			this.next_paging = next_paging
			this.createPaging(this.next_paging)
		} else {
			this.next_paging = undefined
			this.createPaging(this.paging)
		}
		this.createProductElements(data)
	}

	createPaging(paging) {
		const paginationList = document.querySelector('.paginationList')
		paginationList.innerHTML = ''
		let pageCount = 0
		while (pageCount < paging + 2) {
			const li = document.createElement('li')
			const a = document.createElement('a')
			if (pageCount !== 0 && paging !== pageCount - 1) {
				let pageNumber = pageCount
				a.innerText = pageCount
				a.addEventListener('click', () => this.renderProducts(pageNumber))
			}
			if (pageCount === 0) {
				a.addEventListener('click', () => this.renderProducts(this.paging - 1))
			} else if (pageCount - 1 === paging) {
				console.log('this.next_paging==>', this.next_paging)
				if (this.next_paging) {
					a.addEventListener('click', () =>
						this.renderProducts(this.paging + 1),
					)
				} else {
					a.addEventListener('click', () => alert('There is no other page...'))
				}
			}
			if (pageCount === this.paging) a.classList.add('currentPaging')
			li.appendChild(a)
			paginationList.appendChild(li)
			console.log(paging, pageCount)
			pageCount++
		}
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

			// const productDivColors = productTempClone.querySelector('.colors')
			// productInfo.colors.forEach((color) => {
			// 	const productDicColor = document.createElement('div')
			// 	productDicColor.setAttribute('class', 'color')
			// 	productDicColor.setAttribute('style', `background-color:#${color.code}`)
			// 	productDivColors.appendChild(productDicColor)
			// })

			productTempClone.querySelector('.name').innerHTML = productInfo.title
			productTempClone.querySelector(
				'.price',
			).innerHTML = `TWD.${productInfo.lowestPrice} - ${productInfo.highestPrice}`
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
