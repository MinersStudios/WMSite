document.querySelectorAll('a[href*="#"]')
	.forEach(link => {
		link.addEventListener('click', event => {
			event.preventDefault()
			const attribute = event.target.getAttribute('href')
			const target = document.querySelector(attribute)
			if (target) {
				window.scrollTo({
					top: target.offsetTop,
					behavior: 'smooth'
				})
			} else {
				console.error(`Unable to resolve anchor ${attribute} in file ${window.location.pathname}.`)
			}
		})
	})

document.getElementById('ip')
	.addEventListener('click', () => {
		const address = 'play.whomine.net'
		navigator.clipboard.writeText(address)
			.then(() => {
				showToast('Айпи скопирован!', 'green')
			})
			.catch(error => {
				showToast(`Айпи не удалось скопировать :(\n${address}`, 'red')
				console.error('Failed to copy the IP, please use a better browser: ', error)
			})
	})

function showToast(text, color) {
	const toastsContainer = document.querySelector('.toasts')
	const toast = document.createElement('div')
	toast.classList.add('toast', 'transitionIn', 'transitionOut', color)
	toast.textContent = text
	toastsContainer.appendChild(toast)

	setTimeout(() => {
		toastsContainer.removeChild(toast)
	}, 3500)
}

document.addEventListener('DOMContentLoaded', () => {
	const headContainer = document.querySelector('.heads')
	const heads = Array.from(headContainer.children)
	const personalInfoContainers = Array.from(document.querySelectorAll('.personal-info > div'))
	const bodyContainers = Array.from(document.querySelectorAll('.skin > div'))
	const teamContainer = document.getElementById('team')

	let currentIndex = 0
	let isUpdating = false
	let intervalId = null

	function updateSelectedIndex(index, previousIndex) {
		if (isUpdating) return
		isUpdating = true

		heads[previousIndex].classList.remove('selected')

		personalInfoContainers[previousIndex].classList.add('fadeText-leave-to', 'fadeText-leave-active')
		setTimeout(() => {
			personalInfoContainers[previousIndex].classList.remove('selected', 'fadeText-leave-to', 'fadeText-leave-active')
		}, 350)

		bodyContainers[previousIndex].classList.add('fadeImg-leave-to', 'fadeImg-leave-active')
		setTimeout(() => {
			bodyContainers[previousIndex].classList.remove('selected', 'fadeImg-leave-to', 'fadeImg-leave-active')
		}, 350)

		heads[index].classList.add('selected')

		personalInfoContainers[index].classList.add('selected', 'fadeText-enter-from', 'fadeText-enter-active')
		setTimeout(() => {
			personalInfoContainers[index].classList.remove('fadeText-enter-from')
		}, 10)
		setTimeout(() => {
			personalInfoContainers[index].classList.remove('fadeText-enter-active')
			isUpdating = false
		}, 350)

		bodyContainers[index].classList.add('selected', 'fadeImg-enter-from', 'fadeImg-enter-active')
		setTimeout(() => {
			bodyContainers[index].classList.remove('fadeImg-enter-from')
		}, 10)
		setTimeout(() => {
			bodyContainers[index].classList.remove('fadeImg-enter-active')
			isUpdating = false
		}, 350)
	}

	document.getElementById('team-arrow-right').addEventListener('click', () => {
		if (isUpdating) return
		const previousIndex = currentIndex
		currentIndex = (currentIndex + 1) % heads.length
		updateSelectedIndex(currentIndex, previousIndex)
	})

	document.getElementById('team-arrow-left').addEventListener('click', () => {
		if (isUpdating) return
		const previousIndex = currentIndex
		currentIndex = (currentIndex - 1 + heads.length) % heads.length
		updateSelectedIndex(currentIndex, previousIndex)
	})

	headContainer.addEventListener('click', event => {
		if (isUpdating) return
		const headId = event.target.getAttribute('id')
		const previousIndex = currentIndex
		currentIndex = heads.findIndex(head => head.getAttribute('id') === headId)
		updateSelectedIndex(currentIndex, previousIndex)
	})

	function startAutoScroll() {
		intervalId = setInterval(() => {
			const previousIndex = currentIndex
			currentIndex = (currentIndex + 1) % heads.length
			updateSelectedIndex(currentIndex, previousIndex)
		}, 5000)
	}

	function stopAutoScroll() {
		clearInterval(intervalId)
	}

	teamContainer.addEventListener('mouseenter', stopAutoScroll)
	teamContainer.addEventListener('mouseleave', startAutoScroll)

	updateSelectedIndex(currentIndex, 1)
	startAutoScroll()
})

const screenshots = [
	1,
	2,
	3,
	4,
	5,
	6,
	7,
	8,
	9,
	10,
	11,
	12,
	13,
	14,
	15,
	16,
	17,
	18,
	19,
	20,
	21,
	22,
	23,
	24,
	25,
	26,
	27,
	28,
	29,
	30
]

const brightnessMap = {}
let isHamburgering = false
let isScreenshotLoading = false
let screenshotsSeen = 0

function getRandomScreenshot() {
	if (isScreenshotLoading) return

	const image = new Image()
	image.src = `./assets/img/screenshots/${screenshotsSeen % screenshots.length + 1}.webp`

	const screenshotImg = document.getElementById('screenshot-img')
	screenshotImg.style.opacity = '0'
	setTimeout(() => {
		screenshotImg.style.backgroundImage = `url(${image.src})`
	}, 350)
	isScreenshotLoading = true

	image.onload = () => {
		updateButtonColor(brightnessMap[screenshotsSeen])
		setTimeout(() => {
			screenshotImg.classList.add('loaded')
			screenshotImg.style.opacity = '1'
		}, 350)
		setTimeout(() => {
			isScreenshotLoading = false
		}, 500)
	}
	screenshotsSeen += 1
}

function calculateBrightness(image) {
	const canvas = document.createElement('canvas')
	canvas.width = image.width
	canvas.height = image.height
	const context = canvas.getContext('2d')
	context.drawImage(image, 0, 0)
	const data = context.getImageData(0, 0, image.width, image.height).data

	let brightnessSum = 0
	for (let i = 0; i < data.length; i += 4) {
		brightnessSum += (data[i] + data[i + 1] + data[i + 2]) / 3
	}
	return brightnessSum * 4 / data.length
}

function updateButtonColor(isBright) {
	document.getElementById('random-button').classList.toggle('dark', isBright)
}

(async function precalculateBrightness() {
	await Promise.all(
		screenshots.map(async screenshot => {
			const image = new Image()
			image.src = `./assets/img/screenshots/${screenshot}.webp`

			await new Promise(resolve => {
				image.onload = () => {
					brightnessMap[screenshot] = calculateBrightness(image) >= 128
					resolve()
				}
			})
		})
	)
})()

document.getElementById('random-button').addEventListener('click', getRandomScreenshot)
getRandomScreenshot()

function isInViewport(element, threshold = 125) {
	const rect = element.getBoundingClientRect()
	const windowHeight = window.innerHeight || document.documentElement.clientHeight
	const windowWidth = window.innerWidth || document.documentElement.clientWidth
	return (
		rect.top + threshold < windowHeight &&
		rect.bottom - threshold > 0 &&
		rect.left + threshold < windowWidth &&
		rect.right - threshold > 0
	)
}

function handleScroll() {
	for (const article of document.querySelectorAll('article')) {
		if (isInViewport(article)) {
			article.classList.add('animate')
		}
	}
}

window.addEventListener('scroll', handleScroll)
handleScroll()
