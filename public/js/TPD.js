TPDirect.setupSDK(
	11327,
	'app_whdEWBH8e8Lzy4N6BysVRRMILYORF6UxXbiOFsICkz0J9j1C0JUlCHv1tVJC',
	'sandbox',
)
TPDirect.card.setup({
	fields: {
		number: {
			element: '.form-control.card-number',
			placeholder: '**** **** **** ****',
		},
		expirationDate: {
			element: document.getElementById('tappay-expiration-date'),
			placeholder: 'MM / YY',
		},
		ccv: {
			element: $('.form-control.cvc')[0],
			placeholder: '後三碼',
		},
	},
	styles: {
		input: {
			color: 'gray',
		},
		'input.ccv': {
			// 'font-size': '16px'
		},
		':focus': {
			color: 'black',
		},
		'.valid': {
			color: 'green',
		},
		'.invalid': {
			color: 'red',
		},
		'@media screen and (max-width: 400px)': {
			input: {
				color: 'orange',
			},
		},
	},
})
// listen for TapPay Field
TPDirect.card.onUpdate(function (update) {
	/* Disable / enable submit button depend on update.canGetPrime  */
	/* ========================== */

	// update.canGetPrime === true //-原本註解掉
	update.canGetPrime = true //-原本註解掉
	//     --> you can call TPDirect.card.getPrime()
	// const submitButton = document.querySelector('button[type="submit"]')
	if (update.canGetPrime) {
		// submitButton.removeAttribute('disabled')
		$('button[type="submit"]').removeAttr('disabled')
	} else {
		// submitButton.setAttribute('disabled', true)
		$('button[type="submit"]').attr('disabled', true)
	}
	/* Change card type display when card type change */
	/* ========================== */

	// cardTypes = ['visa', 'mastercard', ...]
	var newType = update.cardType === 'unknown' ? '' : update.cardType
	$('#cardtype').text(newType)

	/* Change form-group style when tappay field status change */
	/* ========================== */

	// number 欄位是錯誤的
	if (update.status.number === 2) {
		setNumberFormGroupToError('.card-number-group')
	} else if (update.status.number === 0) {
		setNumberFormGroupToSuccess('.card-number-group')
	} else {
		setNumberFormGroupToNormal('.card-number-group')
	}

	if (update.status.expiry === 2) {
		setNumberFormGroupToError('.expiration-date-group')
	} else if (update.status.expiry === 0) {
		setNumberFormGroupToSuccess('.expiration-date-group')
	} else {
		setNumberFormGroupToNormal('.expiration-date-group')
	}

	if (update.status.cvc === 2) {
		setNumberFormGroupToError('.cvc-group')
	} else if (update.status.cvc === 0) {
		setNumberFormGroupToSuccess('.cvc-group')
	} else {
		setNumberFormGroupToNormal('.cvc-group')
	}
})

$('form').on('submit', function (event) {
	event.preventDefault()
	// fix keyboard issue in iOS device
	forceBlurIos()
	const tappayStatus = TPDirect.card.getTappayFieldsStatus()
	console.log(tappayStatus)

	// Check TPDirect.card.getTappayFieldsStatus().canGetPrime before TPDirect.card.getPrime
	if (tappayStatus.canGetPrime === false) {
		alert('can not get prime')
		return
	}
	// Get prime
	TPDirect.card.getPrime(function (result) {
		if (result.status !== 0) {
			alert('get prime error ' + result.msg)
			return
		}
		// alert('get prime 成功，prime: ' + result.card.prime)
		let primeTPD = result.card.prime
		let ID = window.location.search.split('=')[1]
		/* ========================== */
		/*  Fetch POST TO SERVER                  
        /* ========================== */
		alert('後端功能維護中！ ')
		window.location.href = '/cart.html'
		// fetch('/api/1.0/admin/checkout', {
		// 	method: 'POST',
		// 	headers: {
		// 		'Content-Type': 'application/json',
		// 	},
		// 	redirect: 'follow',
		// 	body: JSON.stringify({ primeTPD, localStorage }),
		// })
		// 	.then((response) => {
		// 		localStorage.clear()
		// 		if (response.redirected) {
		// 			window.location.href = response.url
		// 		}
		// 	}) /*
		//     .then(json => {
		//         console.log(json);
		//         alert('Thank you!');
		//     }) */
		// 	.catch((err) => {
		// 		console.log('ERROR:', err)
		// 	})
	})
})

function setNumberFormGroupToError(selector) {
	$(selector).addClass('has-error')
	$(selector).removeClass('has-success')
}

function setNumberFormGroupToSuccess(selector) {
	$(selector).removeClass('has-error')
	$(selector).addClass('has-success')
}

function setNumberFormGroupToNormal(selector) {
	$(selector).removeClass('has-error')
	$(selector).removeClass('has-success')
}

function forceBlurIos() {
	if (!isIos()) {
		return
	}
	var input = document.createElement('input')
	input.setAttribute('type', 'text')
	// Insert to active element to ensure scroll lands somewhere relevant
	document.activeElement.prepend(input)
	input.focus()
	input.parentNode.removeChild(input)
}

function isIos() {
	return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
}
