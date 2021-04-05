import config from './infra/config.js'
import { privateApi } from './infra/apis.js'

function renderCartList(cartItems) {
	const cartItemContainer = document.querySelector('.cartItemContainer')
	cartItems.forEach((item) => {
		const cartItemClone = document
			.querySelector('.cartItemTemplate')
			.content.cloneNode(true)
		cartItemClone.querySelector('.title').innerText = item.product_id.title
		cartItemClone.querySelector('.imageContainer img').src =
			config.images.product + '/' + item.product_id.id + '/main_image-0.jpeg'
		cartItemClone.querySelector('.price').innerText = item.variant_id.price
		cartItemClone.querySelector('.quantity-value').value = item.quantity
		cartItemClone.querySelector('.mainSpec').innerText =
			item.variant_id.main_spec
		cartItemClone.querySelector('.subSpec').innerText = item.variant_id.sub_spec
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
		cartItemClone.querySelector('.totalPrice').innerText =
			item.variant_id.price * item.quantity
		cartItemContainer.appendChild(cartItemClone)
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

getCartList()
