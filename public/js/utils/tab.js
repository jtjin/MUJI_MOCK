function addTabToggleListener(howManyTag) {
	for (let ti = 1; ti <= howManyTag; ti++) {
		let nowTab = document.querySelector(`#tab${ti}`)
		nowTab.addEventListener('click', function () {
			toggleTab(howManyTag, ti)
		})
	}
}

function toggleTab(howManyTag, index) {
	for (let ti = 1; ti <= howManyTag; ti++) {
		let nowContain = 'tabContain' + ti
		let nowTab = 'tab' + ti
		let tabContain = document.querySelector(`.${nowContain}`)
		let tabA = document.querySelector(` #${nowTab} > a`)
		if (ti == index) {
			tabContain.style.zIndex = '999'
			tabContain.style.visibility = 'visible'
			tabA.style.backgroundColor = '#EB2637'
		} else {
			tabContain.style.zIndex = '0'
			tabContain.style.visibility = 'hidden'
			tabA.style.backgroundColor = '#00495d'
		}
	}
}

export { addTabToggleListener }
