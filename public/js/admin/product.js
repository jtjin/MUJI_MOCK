import config from '../infra/config.js'
import { privateApi, publicApi } from '../infra/apis.js'

let that
class CreateProductFrom {
	constructor() {
		that = this
		this._initElement()
		this._fillTestProductInfo()
		this._initEvents()
	}

	_initElement() {
		this.formContainer = document.querySelector('.formContainer')
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
		this.addSpecBtn = document.querySelector('.addSpecBtn')
		this.specsField = document.querySelector('.specsField')
		this.specTemplate = document.querySelector('.specTemplate')
		this.variantsContainer = document.querySelector('.variantsContainer')
		this.mainSpecVariantContainerTemplate = document.querySelector(
			'.mainSpecVariantContainerTemplate',
		)
		this.subClassVariantTemplate = document.querySelector(
			'.subClassVariantTemplate',
		)
		this.mainSpecVariantCount = 0
		this.subSpecVariantCount = 0

		this.limitedSpecCount = 1
		this.allSpecCount = 0
		this.addSpec('main')
		this.addMainSpecVariantContainerClone()

		this.addSpecVariantBtn = document.querySelector('.addSpecVariantBtn')
	}

	_initEvents() {
		this.productCreateFrom.addEventListener('submit', async (event) => {
			event.preventDefault()
			await this._postCreateProductForm()
		})
		this.addSpecBtn.addEventListener('click', async (event) => {
			this.addSpec('sub')
		})
	}

	addSpec(specType) {
		let index = 1,
			specName
		if (specType === 'sub') {
			specName = 'subSpecName'
		} else {
			specName = 'mainSpecName'
		}
		if (this.allSpecCount > this.limitedSpecCount) {
			alert('目前只能新增兩種Spec，如有新需求請與系統人員反應')
			return
		}

		const specTemplate = this.specTemplate.content.cloneNode(true)

		specTemplate.querySelector('.specContainer').setAttribute('index', index)
		specTemplate
			.querySelector('.specVariantNameContainer')
			.setAttribute('index', index)
		specTemplate
			.querySelector('.specVariantNameInput')
			.setAttribute('index', index)
		specTemplate
			.querySelector('.addSpecVariantBtn')
			.setAttribute('index', index)

		specTemplate
			.querySelector('.addSpecVariantBtn')
			.addEventListener('click', (e) => {
				that.addSpecVariant(specName)
			})

		if (specType === 'sub') {
			specTemplate
				.querySelector('.specVariantNameContainer')
				.classList.add('subSpecContainer')
			specTemplate
				.querySelector(`input[class*=specVariantNameInput]`)
				.addEventListener('keyup', (e) => {
					let mainSpecLength = this.mainSpecVariantCount
					while (mainSpecLength > 0) {
						this.syncWord(specName, '1', e.target.value)
						mainSpecLength--
					}
				})
		} else {
			specTemplate
				.querySelector(`input[class*=specVariantNameInput]`)
				.addEventListener('keyup', (e) => {
					this.syncWord(specName, '1', e.target.value)
				})
			this.mainSpecVariantCount++
			this.subSpecVariantCount++
		}

		this.specsField.appendChild(specTemplate)

		document.querySelectorAll('div[style*="display: none"]').forEach((item) => {
			item.style.display = 'block'
		})
		document.querySelectorAll('td[style*="display: none"]').forEach((item) => {
			item.style.display = 'block'
		})
		this.allSpecCount++
	}

	syncWord(className, index, text) {
		if (className === 'mainSpecName') {
			document
				.querySelectorAll(`div[class*="${className}"][index="${index}"]`)
				.forEach((e) => {
					e.innerText = text
				})
		} else {
			console.log(className, index)
			console.log(
				document.querySelectorAll(
					`input[class*="${className}"][index="${index}"]`,
				),
			)
			document
				.querySelectorAll(`input[class*="${className}"][index$="${index}"]`)
				.forEach((e) => {
					e.value = text
				})
		}
	}

	addSpecVariant(specName) {
		if (specName === 'mainSpecName') {
			const nowIndex = ++this.mainSpecVariantCount
			document
				.querySelector(`div[class*="specVariantNameContainer"][index="1"]`)
				.appendChild(this.createNewSpecVariantInputBtn(nowIndex, specName))

			this.addMainSpecVariantContainerClone()
		} else {
			const now2Index = ++this.subSpecVariantCount
			document
				.querySelector(`div[class*="subSpecContainer"][index="1"]`)
				.appendChild(
					this.createNewSpecVariantInputBtn(`${now2Index}`, specName),
				)
			let howManyMainVariant = this.mainSpecVariantCount
			while (howManyMainVariant > 0) {
				console.log(
					'mainSpecVariantCount howManyMainVariant==>',
					howManyMainVariant,
				)
				document
					.querySelector(`table[index="${howManyMainVariant}"]`)
					.appendChild(
						this.addSubVariantContainerClone(howManyMainVariant, now2Index),
					)
				howManyMainVariant--
			}
		}
	}
	createNewSpecVariantInputBtn(index, className) {
		console.log('createNewSpecVariantInputBtn==>', className, index)
		const input = document.createElement('input')
		input.setAttribute('index', index)
		input.name = 'specVariantName'
		input.type = 'text'
		input.classList.add('specVariantNameInput')
		input.addEventListener('keyup', (e) => {
			that.syncWord(className, index, e.target.value)
		})
		return input
	}

	addMainSpecVariantContainerClone() {
		const mainSpecVariantContainerClone = that.mainSpecVariantContainerTemplate.content.cloneNode(
			true,
		)
		mainSpecVariantContainerClone
			.querySelector('.mainSpecName')
			.setAttribute('index', that.mainSpecVariantCount)
		mainSpecVariantContainerClone
			.querySelector('table')
			.setAttribute('index', that.mainSpecVariantCount)

		let howManySubClass = 1

		if (that.allSpecCount === 2) {
			mainSpecVariantContainerClone.querySelector('td').style.display = 'block'
		}

		let subSpec, result

		while (
			howManySubClass <= that.subSpecVariantCount ||
			howManySubClass === 1
		) {
			console.log('howManySubClass->', howManySubClass)
			subSpec = that.addSubVariantContainerClone(
				that.mainSpecVariantCount,
				howManySubClass,
			)
			mainSpecVariantContainerClone.querySelector('table').appendChild(subSpec)
			howManySubClass++
		}
		that.variantsContainer.appendChild(mainSpecVariantContainerClone)
	}

	addSubVariantContainerClone(mainSpecIndex, subSpecIndex) {
		const subClassVariantClone = that.subClassVariantTemplate.content.cloneNode(
			true,
		)
		const container = subClassVariantClone.querySelector(
			'.subClassVariantContainer',
		)
		container
			.querySelector('.subSpecName')
			.setAttribute('index', String(mainSpecIndex) + String(subSpecIndex))
		if (that.allSpecCount === 2) {
			container.querySelector('td').style.display = 'block'
		}
		const existVariantNameInput = document.querySelector(
			`.subSpecContainer input[class*=specVariantNameInput][index="${subSpecIndex}"]`,
		)

		if (existVariantNameInput)
			container.querySelector('.subSpecName').value =
				existVariantNameInput.value
		return subClassVariantClone
	}

	async _postCreateProductForm() {
		const formData = new FormData(this.productCreateFrom)

		for (var pair of formData.entries()) {
			console.log(pair[0] + ', ' + pair[1])
		}
		try {
			// 	const { result } = (
			// 		await privateApi({
			// 			url: config.api.admin.product,
			// 			method: 'POST',
			// 			data: formData,
			// 		})
			// 	).data
			// 	if (result === 'success') {
			// 		this._cleanProductInfo()
			// 		Swal.fire({
			// 			// Reference Links: https://sweetalert2.github.io/
			// 			position: 'top-end',
			// 			icon: 'success',
			// 			title: 'Your work has been saved',
			// 			showConfirmButton: false,
			// 			timer: 1500,
			// 		})
			// 	}
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
		// this.colors.value = '58166846, FFFdfe, SERHTH'
		// this.colorsName.value = 'Red, Blue, Green'
		// this.sizes.value = 'S,M,L,XL,XXL'
	}
}

new CreateProductFrom()
