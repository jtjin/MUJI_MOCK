'use strict'
export function fade(element) {
	var op = 1 // initial opacity
	var timer = setInterval(function () {
		if (op <= 0.1) {
			clearInterval(timer)
			element.style.display = 'none'
		}
		element.style.opacity = op
		element.style.filter = 'alpha(opacity=' + op * 100 + ')'
		op -= op * 1
	}, 50)
}

export function unFade(element) {
	var op = 1 // initial opacity
	element.style.display = 'block'
	var timer = setInterval(function () {
		if (op >= 1) {
			clearInterval(timer)
		}
		element.style.opacity = op
		element.style.filter = 'alpha(opacity=' + op * 100 + ')'
		op += op * 0.5
	}, 10)
}
