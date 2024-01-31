// Just some code reuse thing, you should track more of these patterns.
function e(o) { throw new Error(o) }

// Additional files worsen load times, I think you would not do that if you
// understood what you are doing, so I moved it here.
const toastsContainer = document.querySelector('.toasts')

const ToastType = {
    INFO: 'info',
    SUCCESS: 'success',
    ERROR: 'error',
    WARNING: 'warning'
}

const toastTypeSet = new Set(Object.values(ToastType))

function showToast(
    text,
    color = ToastType.INFO
) {
    if (typeof text !== 'string') {
        e('Toast text must be a string')
    }

    // has() has O(1) time complexity by utilising hashes of values instead of
    // Object.includes()'s O(log(n)) (which is probably just a loop)
    if (toastTypeSet.has(color) === false) {
        e('Toast color must be a valid ToastType')
    }

    const toast = document.createElement('div')

    toast.classList.add('toast', 'transitionIn', 'transitionOut', color)
    toast.textContent = text
    toastsContainer.appendChild(toast)

    setTimeout(() => {
        toastsContainer.removeChild(toast)
    }, 3500)
}

const articles = document.querySelectorAll('article')
const navItems = document.querySelector('#navItems')
const navContent = document.querySelector('#navContent')
const screenshot = document.querySelector('#screenshot-img')
const randomButton = document.querySelector('#random-button')
const headContainer = document.querySelector('.heads')
const heads = [...headContainer.children]
const personalInfoContainers = document.querySelectorAll('.personal-info > div')
const bodyContainers = document.querySelectorAll('.skin > div')
const teamContainer = document.querySelector('#team')

const ip = 'play.whomine.net'
const brightnessCache = {}
// I did not come up yet with a way to fill it dynamically (i.e. by getting
// basenames of contents of /assets/img/screenshots directory). And by the way,
// we should cache more stuff than just brightness map. Also, I can't stop
// eating when nervous, how do you deal with that? I feel like its the only
// thing that helps me not die from starvation.
const screenshots = []
for (let i = 1; i <= 63; ++i) screenshots.push(i) // This is not an inspiration.

let usedScreenshots = []
let isHamburgering = false
let isScreenshotLoading = false
let currentIndex = 0
let isUpdating = false
let intervalId = null

async function loadAnchorLinks() {
    const anchorLinks = document.querySelectorAll('a[href*="^#"]')

    if (anchorLinks.length !== 0) {
        for (const link of anchorLinks) {
            const attribute = link.getAttribute('href')
            const target = document.querySelector(attribute)

            if (target === null) {
                console.error(`Cannot resolve anchor ${attribute} in file ${window.location.pathname}`)
            }

            link.addEventListener('click', event => {
                event.preventDefault()
                scrollTo(target)
            })
        }
    }
}

async function loadAnchorButtons() {
    const anchorButtons = document.querySelectorAll('button[onclick*="^#"]')

    if (anchorButtons.length !== 0) {
        for (const button of anchorButtons) {
            const attribute = button.getAttribute('onclick').split("'")[1]
            const target = document.querySelector(attribute)

            if (target === null) {
                console.error(`Cannot resolve anchor ${attribute} in file ${window.location.pathname}`)
            }

            button.addEventListener('click', event => {
                event.preventDefault()
                scrollTo(target)
            })
            button.removeAttribute('onclick')
        }
    }
}

// Changed capitalisation because IP and FAQ are abbreviations.
async function loadIPButtons() {
    const ipButtons = document.querySelectorAll('.ip-button')

    if (ipButtons.length !== 0) {
        for (let i = 0, n = ipButtons.length; i < n; ++i) {
            ipButtons[i].addEventListener('click', async () => {
                try {
                    if (typeof navigator.clipboard === 'undefined') {
                        await navigator.clipboard.writeText(ip)
                    } else {
                        const textarea = document.createElement('textarea')
                        textarea.value = ip

                        document.body.appendChild(textarea)
                        textarea.select()
                        document.execCommand('copy')
                        document.body.removeChild(textarea)
                    }

                    showToast('Айпи скопирован!', ToastType.SUCCESS)
                } catch (error) {
                    showToast('Айпи не удалось скопировать :(', ToastType.ERROR)
                    console.error('Failed to copy the IP: ', error)
                }
            })
        }
    }
}

async function loadFAQButtons() {
    const faqButtons = document.querySelectorAll('.faq-master .item button')

    if (faqButtons.length !== 0) {
        for (const button of faqButtons) {
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
    }
}

// Removed error catching because it has no sense here.
// You either get it because there is an programming error in this script or
// HTML document does not have expected elements. Either way, it just costs
// more performance even when there is no errors (this may be wrong?) and by
// shipping this script together with HTML file you will not have a need for
// this. Also, you had non-portable racing condition, because you linked this
// script as a module (implying defer = true) and having async at the same time
// which made it behave differently between web browsers and probably caused
// running this entire script while DOM was constructing, which you seem by the
// code have already encountered and tried to create elements if there were not
// present at the time the check was performed, mitigating the race.
// Conclusion: by having no bugs in the code and consider index.html to be
// always present when this script is ran (they had the same name and does not
// look like a template to me) you will not ever need those checks. And you may
// ask: how do I have no bugs in my code? Answer: by constantly improving it.
// Why leave a constant mark on performance while them being useful only
// because of compile-time errors. This is irrational. And that is why I
// removed them.
loadAnchorLinks()
loadAnchorButtons()
loadIPButtons()
loadFAQButtons()

window.addEventListener('scroll', handleScroll)

randomButton.addEventListener('click', getRandomScreenshot)

document.querySelector('#hamburger')
    .addEventListener('click', () => {
        if (isHamburgering === true) return

        // A good one.
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

document.querySelector('#team-arrow-right')
    .addEventListener('click', () => {
        if (isUpdating === true) return

        const previousIndex = currentIndex
        currentIndex = (currentIndex + 1) % heads.length

        updateSelectedIndex(previousIndex)
    })

document.querySelector('#team-arrow-left')
    .addEventListener('click', () => {
        if (isUpdating === true) return

        const previousIndex = currentIndex
        currentIndex = (currentIndex - 1 + heads.length) % heads.length

        updateSelectedIndex(previousIndex)
    })

headContainer.addEventListener('click', event => {
    if (isUpdating === true) return

    const classList = event.target.classList

    if (classList.contains('selected') === true
        || classList.contains('head') === false)
        return

    const previousIndex = currentIndex
    currentIndex = heads.findIndex(
        h => h.getAttribute('id') === event.target.getAttribute('id')
    )

    updateSelectedIndex(previousIndex)
})

updateSelectedIndex()
startAutoScroll()
getRandomScreenshot()
handleScroll()

function updateSelectedIndex(previousIndex = 1) {
    if (isUpdating === true) return

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
        if (isInViewport(teamContainer) === false
            && window.innerWidth < 768) return

        const previousIndex = currentIndex
        currentIndex = (currentIndex + 1) % heads.length

        updateSelectedIndex(previousIndex)
    }, 5000)
}

function getRandomScreenshot() {
    if (isScreenshotLoading === true) return

    let unusedScreenshots = screenshots.filter(
        (_, index) => !usedScreenshots.includes(index)
    )

    if (unusedScreenshots.length === 0) {
        usedScreenshots = []
        unusedScreenshots = screenshots
    }

    const random = Math.trunc(Math.random() * unusedScreenshots.length)
    // Line below is quite expensive, you dereference an element in
    // unusedScreenshots, then compare it with every element of screenshots
    // array until they are or there are no more elements, take its index or -1
    // (invalid index) and then dereference an element from screenshots array
    // with that index. Which could be solved if it did not involved 2
    // unnecessary arrays which together have the same contents and also
    // introduce additional strain on GC every time you get a new screenshot.
    // Yes, I agree, it solved problem of never ending random generation, which
    // I instead of solving delayed by shuffling an array, i.e. random'ing it
    // instead of drawing its elements randomly.
    const index = screenshots.indexOf(unusedScreenshots[random])

    usedScreenshots.push(index)

    screenshot.style.opacity = '0'
    isScreenshotLoading = true

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
    if (typeof brightnessCache[image.src] === 'undefined')
        brightnessCache[image.src] = calculateBrightness(image) > 128
    return brightnessCache[image.src]
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
    const windowHeight = window.innerHeight ?? document.documentElement.clientHeight
    const windowWidth = window.innerWidth ?? document.documentElement.clientWidth

    // Should probably be replaced with some simpler arithmetic. Those
    // comparison can quite literally turn into branches, I don't trust modern
    // JavaScript engines (and it may be not possible to not turn them into
    // branches on client's architecture).
    return (
        top + threshold < windowHeight &&
        bottom - threshold > 0 &&
        left + threshold < windowWidth &&
        right - threshold > 0
    )
}

function scrollTo(target) {
    const windowHeight = window.innerHeight ?? document.documentElement.clientHeight
    const top = target.offsetTop - Math.max(0, windowHeight - target.offsetHeight) / 2

    window.scrollTo({
        top,
        behavior: 'smooth'
    })
}

function handleScroll() {
    for (const article of articles) {
        if (isInViewport(article)) article.classList.add('animate')
    }
}
