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
                        <img src="https://s3-ap-northeast-1.amazonaws.com/white-100.online/Stylish/images/logo.png" alt="logo">
                    </a>
                </div>

                <nav>
                    <div class="tag tagBorder">
                        <a href="./?tag=women">女裝</a>
                    </div>
                    <div class="tag tagBorder">
                        <a href="./?tag=men">男裝</a>
                    </div>
                    <div class="tag ">
                        <a href="./?tag=accessories">配件</a>
                    </div>
                </nav>

                <div class="feature">
                    <form action="./" class="item">
                        <input type="text" class="search" name="keyword">
                        <button type="submit" class="keyword" id="keywordSearchBtn"></button>
                    </form>

                    <a class="item cart">
                        <div id="cart-qty" class="qty">0</div>
                    </a>

                    <div class="item member">
                        <a href="./profile.html">
                            <img src="https://s3-ap-northeast-1.amazonaws.com/white-100.online/Stylish/images/member.png">
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

	renderCartListQuantities() {
		const nav = document.querySelector('stylish-nav').shadowRoot
		const cartNumber = nav.querySelector('#cart-qty')
		let cartList = JSON.parse(localStorage.getItem('cart'))
		if (cartList) {
			cartNumber.innerHTML = JSON.parse(localStorage.getItem('cart')).length
		}
		nav.querySelector('.cart').addEventListener('click', () => {
			document.querySelector('.paymentForm').style.display = 'flex'
		})
	}
}
customElements.define('stylish-nav', Header)
