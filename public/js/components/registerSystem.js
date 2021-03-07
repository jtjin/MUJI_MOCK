import config from '../infra/config.js'
import { unFade, sleep } from '../utils/index.js'
import { publicApi } from '../apis.js'

let that
class RegisterFrom extends HTMLElement {
	FB
	constructor() {
		super()
		this.shadow = this.attachShadow({ mode: 'open' })
		this.FB = new FbRegisterSystem()
		that = this
	}

	async connectedCallback() {
		this.render()
		this._initElements()
		this._initElementEventsListeners()
		this._fillTestAccount()
		await this.checkLoginStatus()
	}

	_initElements() {
		this.checkPassword = this.shadow.querySelector('#checkPwd')
		this.passwordInput = this.shadow.querySelector('#password')
		this.messageSignIn = this.shadow.querySelector('#messageSignIn')
		this.messageSignUp = this.shadow.querySelector('#messageSignUp')
		this.signUpForm = this.shadow.querySelector('.email-signUp')
		this.signInForm = this.shadow.querySelector('.email-login')
		this.logInForm = this.shadow.querySelector('.email-login')
		this.userImage = this.shadow.querySelector('#userImg')
		this.userImgUploadInput = this.shadow.querySelector('#uploadImg')
		this.uploadSuccessfullyImg = this.shadow.querySelector(
			'.uploadSuccessfullyImg',
		)
		this.signUpBoxLink = this.shadow.querySelector('#signup-box-link')
		this.signInBoxLink = this.shadow.querySelector('#registerContainer-link')
		this.logInFormBackground = this.shadow.querySelector('.logInFormBackground')
		this.registerContainer = this.shadow.querySelector('.registerContainer')
		this.uploadSuccessBtn = this.shadow.querySelector('.uploadSuccessfullyDiv')
		this.facebookLogInBtn = this.shadow.querySelector('.facebookLogInBtn')
		this.googleLogInBtn = this.shadow.querySelector('.googleLogInBtn')

		this.uploadSuccessfullyImg.setAttribute(
			'src',
			'https://s3-ap-northeast-1.amazonaws.com/white-100.online/TechBase/assets/checkmark-circle-outline.svg',
		)
	}

	_initElementEventsListeners() {
		this.googleLogInBtn.addEventListener('click', this.googleSignIn)
		this.signInBoxLink.addEventListener('click', () => {
			this.signUpForm.style.display = 'none'
			unFade(this.signInForm)
			this.signInBoxLink.classList.toggle('active')
			this.signUpBoxLink.classList.toggle('active')
		})
		this.signUpBoxLink.addEventListener('click', () => {
			this.signInForm.style.display = 'none'
			unFade(this.signUpForm)
			this.signUpBoxLink.classList.toggle('active')
			this.signInBoxLink.classList.toggle('active')
		})
		this.checkPassword.addEventListener('keyup', this._checkPasswordWhenKeyUp)
		this.logInForm.addEventListener('submit', async (event) => {
			event.preventDefault()
			await this._postSignInForm()
		})

		this.signUpForm.addEventListener('submit', async (event) => {
			event.preventDefault()
			const isSignUp = await this._postSignUpForm()
			if (!isSignUp) this.checkLoginStatus()
		})
		this.facebookLogInBtn.addEventListener('click', async (event) => {
			event.preventDefault()
			await this.FB.logIn()
		})
	}

	async _postSignUpForm() {
		const formData = new FormData(this.signUpForm)
		formData.set('provider', 'native')
		// if (this.userImgUploadInput.files[0]) {
		// 	formData.append('userImage', this.userImgUploadInput.files[0])
		// }

		try {
			await publicApi({
				url: config.api.user.signUp,
				method: 'POST',
				data: formData,
			})
		} catch (err) {
			console.log(err.response)
			console.log(err)
		}
	}

	async _postSignInForm() {
		try {
			const formData = new FormData(this.logInForm)
			formData.set('provider', 'native')
			const res = {}
			for (const pair of formData.entries()) {
				res[pair[0]] = pair[1]
			}

			const { data } = (
				await publicApi({
					url: config.api.user.signIn,
					method: 'POST',
					data: JSON.stringify(res),
					headers: {
						'Content-Type': 'application/json',
					},
				})
			).data

			localStorage.setItem('stylish', JSON.stringify(data))

			await this._hideLoginBox()
		} catch (error) {
			this._showLoginBox()
		}
	}

	async _hideLoginBox() {
		try {
			this.signInForm.style.display = 'none'
			this.uploadSuccessBtn.style.display = 'flex'
			await sleep(1000)
			this.registerContainer.style.display = 'none'
			this.logInFormBackground.style.display = 'none'
		} catch (e) {
			console.log(e)
		}
	}

	_showLoginBox() {
		this.registerContainer.style.display = 'block'
		this.logInFormBackground.style.display = 'block'
	}

	_loadScript(src) {
		return new Promise((resolve, reject) => {
			const script = document.createElement('script')
			script.src = src
			script.onload = resolve
			script.type = 'module'
			script.onerror = reject
			document.head.appendChild(script)
		})
	}

	_fillTestAccount() {
		const email = this.shadow.querySelector('.emailInput')
		const pwd = this.shadow.querySelector('.pwdInput')
		email.value = 'test@gmail.com'
		pwd.value = '123'
	}

	async checkLoginStatus() {
		const localUserInfo = JSON.parse(localStorage.getItem('stylish'))

		if (!localUserInfo || !localUserInfo.access_token) {
			this._showLoginBox()
			return
		}
	}

	_checkPasswordWhenKeyUp() {
		const isPwdSame = that.passwordInput.value == that.checkPassword.value
		if (isPwdSame) {
			that.messageSignUp.style.color = 'green'
			that.messageSignUp.innerHTML = 'Password matching'
		} else {
			that.messageSignUp.style.color = 'red'
			that.messageSignUp.innerHTML = 'Password not matching'
		}
	}

	googleSignIn(googleUser) {
		console.log('googleUser->', googleUser)
		var profile = googleUser.getBasicProfile()
		console.log('ID: ' + profile.getId())
		// Do not send to your backend! Use an ID token instead.
		console.log('Name: ' + profile.getName())
		console.log('Image URL: ' + profile.getImageUrl())
		console.log('Email: ' + profile.getEmail())
		// This is null if the 'email' scope is not present.
	}

	async render() {
		this.shadow.innerHTML = `
	    <link rel="stylesheet" type="text/css" href="./css/components/registerSystem.css" />

        <meta name="google-signin-client_id" content="9667045798-hqlk9m2i4dtuqpimohdtmlnibm35p1i9.apps.googleusercontent.com.apps.googleusercontent.com">

        <script src="https://apis.google.com/js/platform.js" async defer></script>

			<div class="registerContainer bounce">

				<div class="postFormHeader">
					<a href="#" class="active" id="registerContainer-link">Log In</a>
					<a href="#" id="signup-box-link">Sign Up</a>
				</div>

				<form class="email-login" name='provider' value="native">
					<div class="u-form-group">
						<input type="email" class="emailInput" name="email" placeholder="Email" required="required" />
					</div>

					<div class="u-form-group">
						<input class="pwdInput" type="password" name="password" placeholder="Password"
							required="required" autocomplete />
					</div>

					<div class="u-form-group">
						<button name='provider' value="native" type="submit" class="submit">Log in</button>
                    </div>
                <button name='provider' value="facebook" type="submit" class="facebookLogInBtn">Facebook</button>
                <button name='provider' value="google"   class="googleLogInBtn" >Google</button>

				<div id="messageSignIn"></div>

                </form>

				<form class="email-signUp"  enctype="multipart/form-data">
					<div class="u-form-group">
						<input type="text" name="name" placeholder="User Name" required="required" />
					</div>
					<div class="u-form-group">
						<input type="email" name="email" placeholder="Email" required="required" />
					</div>
					<div class="u-form-group">
						<input id="password" type="password" name="password" placeholder="Password" required="required"
							autocomplete />
					</div>
					<div class="u-form-group">
						<input id="checkPwd" type="password" name="pwdConfirm" placeholder="Confirm Password"
							required="required" autocomplete />
					</div>
					<div id="messageSignUp"></div>

					<div class="u-form-group imgBtn-info">
						<label class="imgBtn" >
							Upload Photos
							<input id="uploadImg" style="display:none;" type="file" name="userImage"
							 accept=".jpg,.jpeg, .png">
						</label>
					</div>

					<div class="u-form-group">
						<button class="submit" type="submit">Sign Up</button>
					</div>
				
					
				</form>

				<div class="uploadSuccessfullyDiv bounce">
					<img class="uploadSuccessfullyImg">
				</div>
			</div>
	<div class="logInFormBackground"></div>
`
	}
}

class FbRegisterSystem {
	constructor() {
		window.fbAsyncInit = function () {
			FB.init({
				appId: '247997226431577',
				cookie: true,
				xfbml: true,
				version: 'v7.0',
			})
			FB.AppEvents.logPageView()
		}
		;(function (d, s, id) {
			var js,
				fjs = d.getElementsByTagName(s)[0]
			if (d.getElementById(id)) {
				return
			}
			js = d.createElement(s)
			js.id = id
			js.src = 'https://connect.facebook.net/en_US/sdk.js'
			fjs.parentNode.insertBefore(js, fjs)
		})(document, 'script', 'facebook-jssdk')
	}
	logIn() {
		FB.login(
			function (response) {
				if (response.status === 'connected') {
					FB.api(
						'/me',
						{
							fields: 'id,name,email,picture',
						},
						function (response) {
							fetch(config.api.user.signup, {
								method: 'POST',
								headers: {
									'Content-Type': 'application/json',
								},
								body: JSON.stringify({
									...response,
									provider: 'facebook',
								}),
							}).then((res) => {
								window.location = res.url
							})
						},
					)
				}
			},
			{
				scope: 'email',
				auth_type: 'rerequest',
			},
		)
	}

	logout() {
		FB.logout(function (response) {
			console.log(response)
		})
	}

	checkState() {
		FB.getLoginStatus(function (response) {
			if (response.status === 'connected') {
				console.log('Log out Successfully.')
			} else {
				facebookLogIn()
			}
		})
	}
}

customElements.define('sign-form', RegisterFrom)
// <div class="g-signin2" data-onsuccess="onSignIn">google</div>
