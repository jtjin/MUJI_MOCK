'use strict'
class Footer extends HTMLElement {
	constructor() {
		super()
		this.shadow = this.attachShadow({ mode: 'open' })
	}

	connectedCallback() {
		this.render()
	}

	async render() {
		this.shadow.innerHTML = `
		<link rel="stylesheet" type="text/css" href="./css/components/footer.css" />
		<footer>
			<div class="footerView">
				<div class="link link-0">
					<div class="item">關於muji</div>
					<div class="item">服務條款</div>
					<div class="item">隱私政策</div>
				</div>
				<div class="link link-1">
					<div class="item">聯絡我們</div>
					<div class="item">FAQ</div>
				</div>
				<div class="social">
					<a href=""></a>
					<img
						src="https://s3-ap-northeast-1.amazonaws.com/white-100.online/MUJI/images/misc_youtube.png"
						alt="line"
					/>
					<img
						src="https://s3-ap-northeast-1.amazonaws.com/white-100.online/MUJI/images/misc_instagram.png"
						alt="twitter"
					/>
					<img
						src="https://s3-ap-northeast-1.amazonaws.com/white-100.online/MUJI/images/misc_facebook.png"
						alt="facebook"
					/>
				</div>
				<div class="copyright">© 2021. All rights reserved.</div>
			</div>
		</footer>
		`
	}
}

customElements.define('muji-footer', Footer)
