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
const faqButtons = document.querySelectorAll('.faq-master .item button');

const ip = 'play.whomine.net'
const brightnessCache = {}
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
    17,
    18,
    19,
    20,
    22,
    23,
    24,
    25,
    26,
    27,
    28,
    30,
    32,
    33,
    34,
    35,
    36,
    37,
    38,
    39,
    40,
    41,
    42,
    43,
    44,
    45,
    46,
    47,
    48,
    49,
    50,
    51,
    52,
    53,
    54,
    55,
    56,
    57,
    58
]

let usedScreenshots = []
let anchorLinks = [...document.querySelectorAll('a[href*="#"]')]
let anchorButtons = [...document.querySelectorAll('button[onclick*="#"]')]
let ipButtons = [...document.querySelectorAll('.ip-button')]
let isHamburgering = false
let isScreenshotLoading = false

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

    anchorLinks = null
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

    anchorButtons = null
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

    ipButtons = null
}

if (faqButtons) {
    faqButtons.forEach(button => {
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
    })
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

    headContainer.addEventListener('click', event => {
        if (isUpdating) return

        const classList = event.target.classList

        if (
            classList.contains('selected')
            || !classList.contains('head')
        ) return

        const previousIndex = currentIndex
        const newIndex = heads.findIndex(
            (h) => h.getAttribute('id') === event.target.getAttribute('id')
        )

        updateSelectedIndex(currentIndex = newIndex, previousIndex)
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
            if (
                !isInViewport(teamContainer)
                && window.innerWidth < 768
            ) return

            const previousIndex = currentIndex
            currentIndex = (currentIndex + 1) % heads.length

            updateSelectedIndex(currentIndex, previousIndex)
        }, 5000)
    }

    function stopAutoScroll() {
        clearInterval(intervalId)
    }
})

getRandomScreenshot()
handleScroll()

function getRandomScreenshot() {
    if (isScreenshotLoading) return

    let unusedScreenshots = screenshots.filter(
        (_, index) => !usedScreenshots.includes(index)
    )

    if (unusedScreenshots.length === 0) {
        usedScreenshots = []
        unusedScreenshots = screenshots
    }

    let random = Math.trunc(Math.random() * unusedScreenshots.length)
    let index = screenshots.indexOf(unusedScreenshots[random])

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

function isInViewport(element, threshold = 125) {
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

function showToast(text, color) {
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
    articles.forEach((article) => {
        if (isInViewport(article)) {
            article.classList.add('animate')
        }
    })
}
