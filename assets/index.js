const anchorLinks = document.querySelectorAll('a[href*="#"]')
const anchorButtons = document.querySelectorAll('button[onclick*="#"]')
const ipButtons = document.querySelectorAll('.ip-button')
const hamburger = document.getElementById('hamburger')
const navItems = document.getElementById('navItems')
const navContent = document.getElementById('navContent')
const screenshots = [
    '1.webp',
    '2.webp',
    '3.webp',
    '4.webp',
    '5.webp',
    '6.webp',
    '7.webp',
    '8.webp',
    '9.webp',
    '10.webp',
    '11.webp',
    '12.webp',
    '13.webp',
    '14.webp',
    '15.webp',
    '17.webp',
    '18.webp',
    '19.webp',
    '20.webp',
    '22.webp',
    '23.webp',
    '24.webp',
    '25.webp',
    '26.webp',
    '27.webp',
    '28.webp',
    '30.webp'
]

let isScreenshotLoading = false
let screenshotsSeen = 0

if (anchorLinks) {
    for (const link of anchorLinks) {
        link.addEventListener('click', function(event) {
            event.preventDefault()

            const attribute = this.getAttribute('href')
            const target = document.querySelector(attribute)

            if (target) {
                scrollTo(target)
            } else {
                console.error('Cannot resolve anchor ' + attribute + ' in file ' + window.location.pathname)
            }
        })
    }
}

if (anchorButtons) {
    for (const button of anchorButtons) {
        button.addEventListener('click', function(event) {
            event.preventDefault()

            const attribute = this.getAttribute('onclick').split('\'')[1]
            const target = document.querySelector(attribute)

            if (target) {
                scrollTo(target)
            } else {
                console.error('Cannot resolve anchor ' + attribute + ' in file ' + window.location.pathname)
            }
        })
    }
}

if (ipButtons) {
    for (const button of ipButtons) {
        button.addEventListener('click', function() {
            const ip = 'play.whomine.net'

            navigator.clipboard
            .writeText(ip)
            .then(() => {
                showToast('Айпи скопирован!', 'green')
            })
            .catch((error) => {
                showToast('Айпи не удалось скопировать :(', 'red')
                console.error('Failed to copy the IP, please use a better browser: ', error)
            })
        })
    }
}

let isAnimating = false;

hamburger.addEventListener('click', function() {
    if (isAnimating) return

    isAnimating = true

    navItems.classList.toggle('open')
    navContent.classList.toggle('open')

    setTimeout(function() {
        if (!navItems.classList.contains('open')) {
            navItems.style.display = ''
        } else {
            navItems.style.display = 'flex'
        }

        isAnimating = false
    }, 250)
})

document.addEventListener('DOMContentLoaded', () => {
    const heads = document.querySelectorAll('.head')
    const personalInfoContainers = document.querySelectorAll('.personal-info > div')
    const bodyContainers = document.querySelectorAll('.skin > div')
    const teamContainer = document.getElementById('team')

    let currentIndex = 0
    let isUpdating = false
    let intervalId = null

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

    heads.forEach((head) => {
        head.addEventListener('click', function() {
            if (isUpdating) return

            const previousIndex = currentIndex
            const newIndex = heads.findIndex(
                head => head.getAttribute('id') === this.getAttribute('id')
            )

            if (newIndex !== currentIndex) {
                updateSelectedIndex(currentIndex = newIndex, previousIndex)
            }
        })
    })

    teamContainer.addEventListener('mouseenter', stopAutoScroll)
    teamContainer.addEventListener('mouseleave', startAutoScroll)

    updateSelectedIndex(currentIndex, 1)
    startAutoScroll()

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
})

document.getElementById('random-button').addEventListener('click', getRandomScreenshot)
document.addEventListener('scroll', handleScroll)

getRandomScreenshot()
handleScroll()

function scrollTo(target) {
    if (target.offsetHeight < window.innerHeight) {
        window.scrollTo({
            top: target.offsetTop - (window.innerHeight - target.offsetHeight) / 2,
            behavior: 'smooth'
        })
    } else {
        window.scrollTo({
            top: target.offsetTop,
            behavior: 'smooth'
        })
    }
}

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

function getRandomScreenshot() {
    if (isScreenshotLoading) return
    if (screenshotsSeen === screenshots.length) {
        const that = screenshots.indexOf(screenshots[screenshotsSeen])

        shuffle(screenshots)

        screenshotsSeen = 0

        if (!that) {
            [screenshots[0], screenshots[that]] = [screenshots[that], screenshots[0]]
        }
    }

    const screenshot = screenshots[screenshotsSeen]
    const screenshotImg = document.getElementById('screenshot-img')
    screenshotImg.style.opacity = '0'

    setTimeout(() => {
        screenshotImg.style.backgroundImage = `url(./assets/img/screenshots/${screenshot})`
    }, 350)

    isScreenshotLoading = true

    const image = new Image()
    image.src = './assets/img/screenshots/' + screenshot
    image.onload = function() {
        updateButtonColor(calculateBrightness(image))
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

function updateButtonColor(brightness) {
    const button = document.getElementById('random-button')

    if (brightness > 128) {
        button.classList.add('dark')
    } else {
        button.classList.remove('dark')
    }
}

function calculateBrightness(image) {
    const canvas = document.createElement('canvas')
    canvas.width = image.width
    canvas.height = image.height

    const context = canvas.getContext('2d')
    context.drawImage(image, 0, 0)

    return getAverageBrightness(context.getImageData(0, 0, image.width, image.height).data)
}

function getAverageBrightness(data) {
    let brightnessSum = 0
    const pixelCount = data.length / 4

    for (let i = 0; i < pixelCount; i++) {
        brightnessSum += (data[i] + data[i + 1] + data[i + 2]) / 3
    }

    return brightnessSum / pixelCount
}

function isElementInViewport(element, threshold = 125) {
    const rect = element.getBoundingClientRect()
    const windowHeight = window.innerHeight || document.documentElement.clientHeight
    const windowWidth = window.innerWidth || document.documentElement.clientWidth
    const topVisible = rect.top + threshold < windowHeight
    const bottomVisible = rect.bottom - threshold > 0
    const leftVisible = rect.left + threshold < windowWidth
    const rightVisible = rect.right - threshold > 0
    return topVisible && bottomVisible && leftVisible && rightVisible
}

function handleScroll() {
    for (const article of document.querySelectorAll('article')) {
        if (isElementInViewport(article)) {
            article.classList.add('animate')
        }
    }
}

function shuffle(array) {
    for (let i = 0; i < array.length; ++i) {
        const j = Math.floor(Math.random() * array.length);
        [array[i], array[j]] = [array[j], array[i]]
    }
}
