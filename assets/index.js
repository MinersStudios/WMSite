const articles = document.querySelectorAll('article')
const anchorLinks = document.querySelectorAll('a[href*="#"]')
const anchorButtons = document.querySelectorAll('button[onclick*="#"]')
const ipButtons = document.querySelectorAll('.ip-button')
const hamburger = document.querySelector('#hamburger')
const navItems = document.querySelector('#navItems')
const navContent = document.querySelector('#navContent')
const screenshotImg = document.querySelector('#screenshot-img')
const randomButton = document.querySelector('#random-button')
const heads = Array.from(document.querySelectorAll('.head'))
const personalInfoContainers = document.querySelectorAll('.personal-info > div')
const bodyContainers = document.querySelectorAll('.skin > div')
const teamContainer = document.querySelector('#team')
const ip = 'play.whomine.net'
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

let isHamburgering = false
let isScreenshotLoading = false
let screenshotsSeen = 0

if (anchorLinks) {
    anchorLinks.forEach((link) => {
        const attribute = link.getAttribute('href')
        const target = document.querySelector(attribute)

        if (!target) {
            console.error(`Cannot resolve anchor ${attribute} in file ${window.location.pathname}`)
        }

        link.addEventListener('click', (event) => {
            event.preventDefault()
            scrollTo(target)
        })
    })
}

if (anchorButtons) {
    anchorButtons.forEach((button) => {
        const attribute = button.getAttribute('onclick').split('\'')[1]
        const target = document.querySelector(attribute)

        if (!target) {
            console.error(`Cannot resolve anchor ${attribute} in file ${window.location.pathname}`)
        }

        button.addEventListener('click', (event) => {
            event.preventDefault()
            scrollTo(target)
        })
        button.removeAttribute('onclick')
    })
}

if (ipButtons) {
    ipButtons.forEach((button) => {
        button.addEventListener('click', async () => {
            try {
                if (navigator.clipboard) {
                    await navigator.clipboard.writeText(ip)
                } else {
                    const textarea = document.createElement('textarea')
                    textarea.value = ip

                    document.body.appendChild(textarea)
                    textarea.select()
                    document.execCommand('copy')
                    document.body.removeChild(textarea)
                }

                showToast('Айпи скопирован!', 'green')
            } catch (error) {
                showToast('Айпи не удалось скопировать :(', 'red')
                console.error('Failed to copy the IP: ', error)
            }
        })
    })
}

hamburger.addEventListener('click', () => {
    if (isHamburgering) return

    isHamburgering = true

    navItems.classList.toggle('open')
    navContent.classList.toggle('open')

    setTimeout(async () => {
        navItems.style.display = navItems.classList.contains('open') ? 'flex' : ''
        isHamburgering = false
    }, 250)
})

document.addEventListener('DOMContentLoaded', () => {
    let currentIndex = 0
    let isUpdating = false
    let intervalId = null

    document.querySelector('#team-arrow-right').addEventListener('click', () => {
        if (isUpdating) return

        const previousIndex = currentIndex
        currentIndex = (currentIndex + 1) % heads.length

        updateSelectedIndex(currentIndex, previousIndex)
    })

    document.querySelector('#team-arrow-left').addEventListener('click', () => {
        if (isUpdating) return

        const previousIndex = currentIndex
        currentIndex = (currentIndex - 1 + heads.length) % heads.length

        updateSelectedIndex(currentIndex, previousIndex)
    })

    heads.forEach((head) => {
        head.addEventListener('click', () => {
            if (isUpdating) return

            const previousIndex = currentIndex
            const newIndex = heads.findIndex((h) => h.getAttribute('id') === head.getAttribute('id'))

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

document.querySelector('#random-button').addEventListener('click', getRandomScreenshot)
document.addEventListener('scroll', handleScroll)

getRandomScreenshot().catch((error) => {
    console.error('Failed to get random screenshot: ', error)
    showToast(`Failed to get random screenshot: ${error.message}`, 'red')
})
handleScroll()

function scrollTo(target) {
    const top =
        target.offsetHeight < window.innerHeight
        ? target.offsetTop - (window.innerHeight - target.offsetHeight) / 2
        : target.offsetTop

    window.scrollTo({
        top,
        behavior: 'smooth'
    })
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

async function getRandomScreenshot() {
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
    screenshotImg.style.opacity = '0'

    setTimeout(() => {
        screenshotImg.style.backgroundImage = `url(./assets/img/screenshots/${screenshot})`
    }, 350)

    isScreenshotLoading = true

    const image = new Image()
    image.src = `./assets/img/screenshots/${screenshot}`

    try {
        await new Promise((resolve) => image.addEventListener('load', resolve))
        updateButtonColor(calculateBrightness(image, randomButton))
        setTimeout(() => {
            screenshotImg.classList.add('loaded')
            screenshotImg.style.opacity = '1'
        }, 350)
    } catch (error) {
        console.error(`Failed to load the screenshot ${screenshot}: `, error)
    } finally {
        isScreenshotLoading = false
    }

    screenshotsSeen += 1
}

function updateButtonColor(brightness) {
    randomButton.classList.toggle('dark', brightness > 128)
}

function calculateBrightness(image, button) {
    const canvas = document.createElement('canvas')
    canvas.width = button.offsetWidth
    canvas.height = button.offsetHeight

    const context = canvas.getContext('2d')
    const buttonRect = button.getBoundingClientRect()
    context.drawImage(image, -buttonRect.left, -buttonRect.top)

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
    const data = imageData.data

    let brightnessSum = 0
    let weightSum = 0

    for (let i = 0; i < data.length; i += 4) {
        const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3
        const weight = brightness / 255

        brightnessSum += brightness * weight
        weightSum += weight
    }

    return brightnessSum / weightSum
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
    articles.forEach((article) => {
        if (isElementInViewport(article)) {
            article.classList.add('animate')
        }
    })
}

function shuffle(array) {
    for (let i = 0; i < array.length; ++i) {
        const j = Math.floor(Math.random() * array.length);
        [array[i], array[j]] = [array[j], array[i]]
    }
}
