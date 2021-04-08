import config from './infra/config.js'
import { privateApi } from './infra/apis.js'

document.querySelector('.checkoutBtn').addEventListener('click', checkout)
document.querySelector('.selectAllCheckbox').addEventListener('click', () => {
	document.querySelectorAll('input').forEach((item) => {
		item.checked = true
	})
})

function renderCartList(cartItems) {
	const cartItemContainer = document.querySelector('.cartItemContainer')
	cartItems.forEach((item) => {
		const cartItemClone = document
			.querySelector('.cartItemTemplate')
			.content.cloneNode(true)
		cartItemClone
			.querySelector('.checkboxContainer input')
			.setAttribute('value', item.id)
		cartItemClone.querySelector('.title').innerText = item.product_id.title
		cartItemClone.querySelector('.imageContainer img').src =
			config.images.product + '/' + item.product_id.id + '/main_image-0.jpeg'
		cartItemClone.querySelector('.price').innerText = item.variant_id.price

		cartItemClone.querySelector('.mainSpec').innerText =
			item.variant_id.main_spec
		cartItemClone.querySelector('.subSpec').innerText = item.variant_id.sub_spec

		cartItemClone.querySelector('.totalPrice').innerText =
			item.variant_id.price * item.quantity

		if (item.variant_id.stock == 0) {
			// 庫存售罄
			cartItemClone.querySelector('.checkboxContainer').innerHTML = 'sold out'
			cartItemClone.querySelector('.cartItem').classList.add('soldOut')
		} else if (item.quantity < item.variant_id.stock) {
			// 庫存足量
			cartItemClone.querySelector('.quantity-value').value = item.quantity
		} else {
			// 庫存不足量，下修
			cartItemClone.querySelector('.quantity-value').value =
				item.variant_id.stock
		}
		setCartItemEvent(cartItemClone, item)
		cartItemContainer.appendChild(cartItemClone)
	})
}

function setCartItemEvent(cartItemClone, item) {
	cartItemClone
		.querySelector('.delete')
		.addEventListener('click', function (e) {
			deleteCartItem({
				target: e.target,
				variantId: item.variant_id.id,
				productId: item.product_id.id,
			})
		})
	cartItemClone
		.querySelector('.quantity-add')
		.addEventListener('click', function (e) {
			e.target.previousElementSibling.value =
				Number(e.target.previousElementSibling.value) + 1
			// TODO: 要查數量夠不夠，不夠拋 Error
			updateItemQuantity({
				quantity: 1,
				variantId: item.variant_id.id,
				productId: item.product_id.id,
			})
		})
	cartItemClone
		.querySelector('.quantity-minus')
		.addEventListener('click', function (e) {
			e.target.nextElementSibling.value =
				Number(e.target.nextElementSibling.value) - 1
			updateItemQuantity({
				quantity: -1,
				variantId: item.variant_id.id,
				productId: item.product_id.id,
			})
		})
}

async function getCartList() {
	const { data } = (
		await privateApi({
			url: config.api.user.cart,
			method: 'GET',
		})
	).data
	renderCartList(data)
}

async function deleteCartItem({ target, variantId, productId }) {
	target.parentNode.style.display = 'none'
	const { data } = (
		await privateApi({
			url: config.api.user.cart,
			method: 'DELETE',
			data: { variantId, productId },
		})
	).data
}

async function updateItemQuantity({ quantity, variantId, productId }) {
	const { data } = (
		await privateApi({
			url: config.api.user.cart,
			method: 'PUT',
			data: { variantId, productId, quantity },
		})
	).data
}

async function checkout() {
	const checkoutIds = []
	document
		.querySelectorAll('.checkboxContainer input:checked')
		.forEach((item) => checkoutIds.push(item.value))

	if (!checkoutIds.length) {
		alert('請至少選擇一項商品結帳')
		return
	}

	const { data } = (
		await privateApi({
			url: config.api.user.order,
			method: 'POST',
			data: { cartItemsId: checkoutIds },
		})
	).data

	// TODO: 先創建 order ，數量沒問題再導付費

	document.querySelector('.paymentForm').style.display = 'flex'
	document.querySelector('#exampleInputEmail1').value = 'test@gmail.com'

	// TODO: post 到後端
	// TODO: 後端 router
	// TODO: 建立 ORDER Entities
	// TODO: 建立 ORDER DB MANAGER
	// TODO: Cart只選到 order id 為空的
}

getCartList()
