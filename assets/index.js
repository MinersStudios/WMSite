const articles = [...document.querySelectorAll('article')]
const hamburger = document.querySelector('#hamburger')
const navItems = document.querySelector('#navItems')
const navContent = document.querySelector('#navContent')
const screenshot = document.querySelector('#screenshot-img')
const randomButton = document.querySelector('#random-button')
const toastsContainer = document.querySelector('.toasts')
const headContainer = document.querySelector('.heads')
const heads = [...headContainer.children]
const personalInfoContainers = document.querySelectorAll('.personal-info > div')
const bodyContainers = document.querySelectorAll('.skin > div')
const teamContainer = document.querySelector('#team')
const teamArrowRight = document.querySelector('#team-arrow-right')
const teamArrowLeft = document.querySelector('#team-arrow-left')

const ip = 'play.whomine.net'
const brightnessCache = {}
const screenshots = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
    11, 12, 13, 14, 15, 17, 18, 19,
    20, 22, 23, 24, 25, 26, 27, 28,
    30, 32, 33, 34, 35, 36, 37, 38,
    39, 40, 41, 42, 43, 44, 45, 46,
    47, 48, 49, 50, 51, 52, 53, 54,
    55, 56, 57, 58, 59, 61, 62, 63
]

let usedScreenshots = []
let faqButtons = [...document.querySelectorAll('.faq-master .item button')]
let anchorLinks = [...document.querySelectorAll('a[href*="#"]')]
let anchorButtons = [...document.querySelectorAll('button[onclick*="#"]')]
let ipButtons = [...document.querySelectorAll('.ip-button')]
let isHamburgering = false
let isScreenshotLoading = false
let currentIndex = 0
let isUpdating = false
let intervalId = null

if (anchorLinks) {
    for (let i = 0; i < anchorLinks.length; i++) {
        const link = anchorLinks[i]
        const attribute = link.getAttribute('href')
        const target = document.querySelector(attribute)

        if (!target) {
            console.error(`Cannot resolve anchor ${attribute} in file ${window.location.pathname}`)
        }

        link.addEventListener('click', (event) => {
            event.preventDefault()
            scrollTo(target)
        })
    }

    anchorLinks = null
}

if (anchorButtons) {
    for (let i = 0; i < anchorButtons.length; i++) {
        const button = anchorButtons[i]
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
    }

    anchorButtons = null
}

if (ipButtons) {
    for (let i = 0; i < ipButtons.length; i++) {
        ipButtons[i].addEventListener('click', async () => {
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
    }

    ipButtons = null
}

if (faqButtons) {
    for (let i = 0; i < faqButtons.length; i++) {
        const button = faqButtons[i]

        button.addEventListener('click', () => {
            const text = button.nextElementSibling
            text.style.display = ''

            setTimeout(() => {
                text.classList.toggle('open')
                button.lastElementChild.classList.toggle('open')
            }, 1)

            setTimeout(() => {
                text.style.display = text.classList.contains('open') ? '' : 'none'
            }, 500)
        })
    }

    faqButtons = null
}

window.addEventListener('scroll', handleScroll)

randomButton.addEventListener('click', getRandomScreenshot)

hamburger.addEventListener('click', () => {
    if (isHamburgering) return

    isHamburgering = true

    navItems.classList.toggle('open')
    navContent.classList.toggle('open')

    setTimeout(() => {
        navItems.style.display = navItems.classList.contains('open') ? 'flex' : ''
        isHamburgering = false
    }, 250)
})

teamContainer.addEventListener('mouseenter', () => {
    clearInterval(intervalId)
})

teamContainer.addEventListener('mouseleave', startAutoScroll)

teamArrowRight.addEventListener('click', () => {
    if (isUpdating) return

    const previousIndex = currentIndex
    currentIndex = (currentIndex + 1) % heads.length

    updateSelectedIndex(previousIndex)
})

teamArrowLeft.addEventListener('click', () => {
    if (isUpdating) return

    const previousIndex = currentIndex
    currentIndex = (currentIndex - 1 + heads.length) % heads.length

    updateSelectedIndex(previousIndex)
})

headContainer.addEventListener('click', event => {
    if (isUpdating) return

    const classList = event.target.classList

    if (
        classList.contains('selected')
        || !classList.contains('head')
    ) return

    const previousIndex = currentIndex
    currentIndex = heads.findIndex(
        (h) => h.getAttribute('id') === event.target.getAttribute('id')
    )

    updateSelectedIndex(previousIndex)
})

updateSelectedIndex(1)
startAutoScroll()
getRandomScreenshot()
handleScroll()

function updateSelectedIndex(previousIndex) {
    if (isUpdating) return

    isUpdating = true
    const previousPersonalInfo = personalInfoContainers[previousIndex].classList
    const previousBody = bodyContainers[previousIndex].classList
    const currentPersonalInfo = personalInfoContainers[currentIndex].classList
    const currentBody = bodyContainers[currentIndex].classList

    heads[previousIndex].classList.remove('selected')

    previousPersonalInfo.add('fadeText-leave-to', 'fadeText-leave-active')
    setTimeout(() => {
        previousPersonalInfo.remove('selected', 'fadeText-leave-to', 'fadeText-leave-active')
    }, 350)

    previousBody.add('fadeImg-leave-to', 'fadeImg-leave-active')
    setTimeout(() => {
        previousBody.remove('selected', 'fadeImg-leave-to', 'fadeImg-leave-active')
    }, 350)

    heads[currentIndex].classList.add('selected')

    currentPersonalInfo.add('selected', 'fadeText-enter-from', 'fadeText-enter-active')
    setTimeout(() => {
        currentPersonalInfo.remove('fadeText-enter-from')
    }, 10)
    setTimeout(() => {
        currentPersonalInfo.remove('fadeText-enter-active')
        isUpdating = false
    }, 350)

    currentBody.add('selected', 'fadeImg-enter-from', 'fadeImg-enter-active')
    setTimeout(() => {
        currentBody.remove('fadeImg-enter-from')
    }, 10)
    setTimeout(() => {
        currentBody.remove('fadeImg-enter-active')
        isUpdating = false
    }, 350)
}

function startAutoScroll() {
    intervalId = setInterval(() => {
        if (
            !isInViewport(teamContainer)
            && window.innerWidth < 768
        ) return

        const previousIndex = currentIndex
        currentIndex = (currentIndex + 1) % heads.length

        updateSelectedIndex(previousIndex)
    }, 5000)
}

function getRandomScreenshot() {
    if (isScreenshotLoading) return

    let unusedScreenshots = screenshots.filter(
        (_, index) => !usedScreenshots.includes(index)
    )

    if (unusedScreenshots.length === 0) {
        usedScreenshots = []
        unusedScreenshots = screenshots
    }

    const random = Math.trunc(Math.random() * unusedScreenshots.length)
    const index = screenshots.indexOf(unusedScreenshots[random])

    usedScreenshots.push(index)

    screenshot.style.opacity = '0'

    setTimeout(() => {
        screenshot.src = `./assets/img/screenshots/${screenshots[index]}.webp`

        screenshot.onload = () => {
            randomButton.classList.toggle('dark', getCachedBrightness(screenshot))

            screenshot.style.opacity = '1'
            isScreenshotLoading = false
        }

        screenshot.onerror = () => {
            console.error(`Failed to load image: ${screenshot.src}`)
            isScreenshotLoading = false
        }
    }, 350)
}

function getCachedBrightness(image) {
    const cached = brightnessCache[image.src]
    return cached
        ? cached
        : brightnessCache[image.src] = calculateBrightness(image) > 128
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

function isInViewport(
    element,
    threshold = 125
) {
    const { top, bottom, left, right } = element.getBoundingClientRect()
    const windowHeight = window.innerHeight || document.documentElement.clientHeight
    const windowWidth = window.innerWidth || document.documentElement.clientWidth

    return (
        top + threshold < windowHeight &&
        bottom - threshold > 0 &&
        left + threshold < windowWidth &&
        right - threshold > 0
    )
}

function showToast(
    text,
    color
) {
    const toast = document.createElement('div')

    toast.classList.add('toast', 'transitionIn', 'transitionOut', color)
    toast.textContent = text
    toastsContainer.appendChild(toast)

    setTimeout(() => {
        toastsContainer.removeChild(toast)
    }, 3500)
}

function scrollTo(target) {
    const windowHeight = window.innerHeight || document.documentElement.clientHeight
    const top = target.offsetHeight < windowHeight
        ? target.offsetTop - (windowHeight - target.offsetHeight) / 2
        : target.offsetTop

    window.scrollTo({
        top,
        behavior: 'smooth'
    })
}

function handleScroll() {
    for (let i = 0; i < articles.length; i++) {
        if (isInViewport(articles[i])) {
            articles[i].classList.add('animate')
        }
    }
}
