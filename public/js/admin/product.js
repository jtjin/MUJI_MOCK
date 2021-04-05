import config from '../infra/config.js'
import { privateApi } from '../infra/apis.js'

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
		// this.price = document.querySelector('.price')
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
		this.fillTestDataOfProductVariant = document.querySelector(
			'.fillTestDataOfProductVariant',
		)
		this.mainSpecVariantContainerTemplate = document.querySelector(
			'.mainSpecVariantContainerTemplate',
		)
		this.detailContainer = document.querySelector('.detailContainer')
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
		this.categorySelector = document.querySelector('.category')
	}

	_initEvents() {
		this.productCreateFrom.addEventListener('submit', async (event) => {
			event.preventDefault()
			await this._postCreateProductForm()
		})
		this.addSpecBtn.addEventListener('click', async (event) => {
			this.addSpec('sub')
		})
		this.fillTestDataOfProductVariant.addEventListener(
			'click',
			async (event) => {
				this._fillTestDataOfProductVariant()
			},
		)
		this.categorySelector.addEventListener('change', (e) => {
			if (e.target.value === 'Clothes')
				this.detailContainer.style.display = 'block'
		})
	}

	addSpec(specType) {
		let index = 1,
			specName,
			specVariantName
		if (specType === 'sub') {
			specName = 'subSpecName'
			specVariantName = 'subSpecVariantName'
		} else {
			specVariantName = 'mainSpecVariantName'
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
		specTemplate.querySelector('.specVariantNameInput').name = specVariantName
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
			const nowMainSpecVariantCount = ++this.mainSpecVariantCount
			document
				.querySelector(`div[class*="specVariantNameContainer"][index="1"]`)
				.appendChild(
					this.createNewSpecVariantInputBtn(nowMainSpecVariantCount, specName),
				)

			this.addMainSpecVariantContainerClone()
		} else {
			const nowSubSpecVariantCount = ++this.subSpecVariantCount
			document
				.querySelector(`div[class*="subSpecContainer"][index="1"]`)
				.appendChild(
					this.createNewSpecVariantInputBtn(
						`${nowSubSpecVariantCount}`,
						specName,
					),
				)
			let howManyMainVariant = this.mainSpecVariantCount
			while (howManyMainVariant > 0) {
				document
					.querySelector(`table[index="${howManyMainVariant}"]`)
					.appendChild(
						this.addSubVariantContainerClone(
							howManyMainVariant,
							nowSubSpecVariantCount,
						),
					)
				howManyMainVariant--
			}
		}
	}
	createNewSpecVariantInputBtn(index, className) {
		const input = document.createElement('input')
		input.setAttribute('required', 'required')
		input.setAttribute('index', index)
		input.name =
			className === 'mainSpecName'
				? 'mainSpecVariantName'
				: 'subSpecVariantName'
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
			.querySelector('div[class*=mainSpecName]')
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

		container.querySelector('.subSpecName').name =
			String(mainSpecIndex) + String(subSpecIndex)
		container.querySelectorAll('input').forEach((element) => {
			element.name =
				'SpecVariant_' + String(mainSpecIndex) + '_' + +String(subSpecIndex)
		})
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
		const variants = []
		for (var pair of formData.entries()) {
			if (pair[0].includes('SpecVariant_')) {
				const [mainSpecIndex, subSpecIndex] = pair[0]
					.split('SpecVariant_')[1]
					.split('_')
				variants.push({
					main_spec: formData.getAll('mainSpecVariantName')[mainSpecIndex - 1],
					sub_spec: formData.getAll('subSpecVariantName')[subSpecIndex - 1],
					price: formData.getAll(pair[0])[1],
					stock: formData.getAll(pair[0])[2],
					code: formData.getAll(pair[0])[3],
				})
				formData.delete(pair[0])
			}
		}
		if (this.detailContainer.style.display !== 'block') {
			this.detailContainer
				.querySelectorAll('input')
				.forEach((e) => formData.delete(e.name))
			this.detailContainer
				.querySelectorAll('select')
				.forEach((e) => formData.delete(e.name))
		}
		formData.set('variants', JSON.stringify(variants))
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
		this.story.value = ''
		document.querySelectorAll('input').forEach((e) => {
			e.value = ''
		})
		document.querySelectorAll('.mainSpecName').forEach((e) => {
			e.innerText = ''
		})
	}

	_fillTestProductInfo() {
		this.title.value = '測試產品' + '-' + Math.floor(Math.random() * 100)
		this.description.value = '測試產品描述'
		// this.price.value = 599
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
	_fillTestDataOfProductVariant() {
		document.querySelectorAll('.specNameInput').forEach((element, index) => {
			element.value = '規格名稱' + index
		})
		document.querySelectorAll('.mainSpecName').forEach((element, index) => {
			element.innerText = '主規格名稱' + index
		})
		const allSpecContainer = document.querySelectorAll('.specContainer')

		allSpecContainer[0]
			.querySelectorAll('.specVariantNameInput')
			.forEach((element, index) => {
				element.value = '主規格名稱' + index
			})
		console.log(this.allSpecCount, this.limitedSpecCount)
		if (this.allSpecCount > this.limitedSpecCount) {
			allSpecContainer[1]
				.querySelectorAll('.specVariantNameInput')
				.forEach((element, index) => {
					element.value = '副規格名稱' + index
				})
		}
		document.querySelectorAll('.price').forEach((element, index) => {
			element.value = 599
		})
		document.querySelectorAll('.stock').forEach((element, index) => {
			element.value = 5
		})
		document.querySelectorAll('.code').forEach((element, index) => {
			element.value = 'HiDear99'
		})
		const howManySubSpec = this.subSpecVariantCount
		let now = 0
		document
			.querySelectorAll('input[class*="subSpecName"][name^="SpecVariant_"]')
			.forEach((element, index) => {
				if (now <= howManySubSpec) {
					element.value = '副規格名稱' + now
				} else {
					now = 0
					element.value = '副規格名稱' + now
				}
				now++
			})
	}
}

new CreateProductFrom()
