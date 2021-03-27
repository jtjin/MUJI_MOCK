import config from '../infra/config.js'
import { privateApi, publicApi } from '../apis.js'

class CreateProductFrom {
	constructor() {
		this._initElement()
		this._fillTestProductInfo()
		this._initEvents()
	}

	_initElement() {
		this.productCreateFrom = document.querySelector('.productCreateFrom')
		this.title = document.querySelector('.title')
		this.description = document.querySelector('.description')
		this.price = document.querySelector('.price')
		this.texture = document.querySelector('.texture')
		this.wash = document.querySelector('.wash')
		this.place = document.querySelector('.place')
		this.note = document.querySelector('.note')
		this.story = document.querySelector('.story')
		this.colors = document.querySelector('.colors')
		this.colorsName = document.querySelector('.colorsName')
		this.sizes = document.querySelector('.sizes')
		this.submitButton = document.querySelector('.submitButton')
		this.main_image = document.querySelector('.main_image')
		this.images = document.querySelector('.images')
	}

	_initEvents() {
		this.productCreateFrom.addEventListener('submit', async (event) => {
			event.preventDefault()
			await this._postCreateProductForm()
		})
	}

	async _postCreateProductForm() {
		const formData = new FormData(this.productCreateFrom)
		console.log('formData=>', formData)
		try {
			const { result } = (
				await privateApi({
					url: config.api.admin.product,
					method: 'POST',
					data: formData,
				})
			).data
			if (result === 'success') {
				this._cleanProductInfo()
				Swal.fire({
					// Reference Links: https://sweetalert2.github.io/
					position: 'top-end',
					icon: 'success',
					title: 'Your work has been saved',
					showConfirmButton: false,
					timer: 1500,
				})
			}
		} catch (error) {
			console.log(error)
		}
	}
	_cleanProductInfo() {
		this.title.value = ''
		this.description.value = ''
		this.price.value = ''
		this.texture.value = ''
		this.wash.value = ''
		this.place.value = ''
		this.note.value = ''
		this.story.value = ''
		this.colors.value = ''
		this.colorsName.value = ''
		this.sizes.value = ''
		this.main_image.value = ''
		this.images.value = ''
	}

	_fillTestProductInfo() {
		this.title.value = '測試產品' + '-' + Math.floor(Math.random() * 100)
		this.description.value = '測試產品描述'
		this.price.value = 599
		this.texture.value = '棉 100% 厚薄：薄 彈性：無'
		this.wash.value = '手洗，溫水'
		this.place.value = '火星'
		this.note.value = '不同顏色的衣服'
		this.story.value =
			'耶誕節讓我一個人過，情人節讓我一個人過，有種面試你也讓我一個人過啊！'
		this.colors.value = '58166846, FFFdfe, SERHTH'
		this.colorsName.value = 'Red, Blue, Green'
		this.sizes.value = 'S,M,L,XL,XXL'
	}
}

new CreateProductFrom()
