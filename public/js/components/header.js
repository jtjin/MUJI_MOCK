'use strict'
import config from '../infra/config.js'
import { privateApi } from '../infra/apis.js'
class Header extends HTMLElement {
	constructor() {
		super()
		this.shadow = this.attachShadow({ mode: 'open' })
	}

	connectedCallback() {
		this.render()
		this.renderCartListQuantities()
	}

	async render() {
		this.shadow.innerHTML = `
            <link rel="stylesheet" type="text/css" href="./css/components/header.css" />
            <header>
                <div class='logo'>
                    <a href="./">
                        <img src="https://s3-ap-northeast-1.amazonaws.com/white-100.online/MUJI/images/logo.png" alt="logo">
                    </a>
                </div>

                <nav>
                    <div class="tag tagBorder">
                        <a href="./?category=clothes">服飾</a>
                    </div>
                    <div class="tag tagBorder">
                        <a href="./?category=groceries">文具</a>
                    </div>
                    <div class="tag ">
                        <a href="./?category=food">食品</a>
                    </div>
                </nav>

                <div class="feature">
                    <form action="./" class="item">
                        <input type="text" class="search" name="keyword">
                        <button type="submit" class="keyword" id="keywordSearchBtn"></button>
                    </form>

                    <a class="item cart" href="/cart.html">
                        <div id="cart-qty" class="qty">0</div>
                    </a>

                    <div class="item member">
                        <a href="./profile.html">
                            <img src="https://s3-ap-northeast-1.amazonaws.com/white-100.online/MUJI/images/member.png">
                        </a>
                    </div>
                </div>
            </header>
             

            <nav class="mobileNav">
                <div class="tag tagBorder">
                    <a href="/api/1.0/products/women">女裝</a>
                </div>
                <div class="tag tagBorder">
                    <a href="/api/1.0/products/men">男裝</a>
                </div>
                <div class="tag">
                    <a href="/api/1.0/products/accessories">配件</a>
                </div>
            </nav>
		`
	}

	async renderCartListQuantities() {
		const nav = document.querySelector('muji-nav').shadowRoot
		const cartNumber = nav.querySelector('#cart-qty')

		if (!JSON.parse(localStorage.getItem('muji'))) return

		const { data: cartList } = (
			await privateApi({
				url: config.api.user.cart,
				method: 'GET',
			})
		).data

		if (cartList) cartNumber.innerHTML = cartList.length

		nav.querySelector('.cart').addEventListener('click', () => {
			document.querySelector('.paymentForm').style.display = 'flex'
		})
	}
}

customElements.define('muji-nav', Header)
