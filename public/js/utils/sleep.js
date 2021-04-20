'use strict'
export function sleep(seconds) {
	return new Promise(function (resolve, reject) {
		setTimeout(function () {
			resolve('anything')
		}, seconds)
	})
}
