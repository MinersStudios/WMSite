const ip = 'play.whomine.net'
const screenshots = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
  11, 12, 13, 14, 15, 17, 18, 19,
  20, 22, 23, 24, 25, 26, 27, 28,
  30, 32, 33, 34, 35, 36, 37, 38,
  39, 40, 41, 42, 43, 44, 45, 46,
  47, 48, 49, 50, 51, 52, 53, 54,
  55, 56, 57, 58, 59, 61, 62, 63
]
const ToastType = {
  INFO: 'info',
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning'
}

const toastTypeSet = new Set(Object.values(ToastType))
const toastsContainer = document.querySelector('.toasts')
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
const brightnessCache = {}

let usedScreenshots = []
let isHamburgering = false
let isScreenshotLoading = false
let currentIndex = 0
let isUpdating = false
let intervalId = null

window.addEventListener('scroll', handleScroll)
randomButton.addEventListener('click', getRandomScreenshot)
headContainer.addEventListener('click', event => handleHeadClick(event.target))
teamContainer.addEventListener('mouseenter', () => clearInterval(intervalId))
teamContainer.addEventListener('mouseleave', startAutoScroll)

document
.querySelectorAll('a[href*="#"], button[onclick*="#"]')
.forEach(element => element.addEventListener('click', handleAnchorClick))

document
.querySelectorAll('.ip-button')
.forEach(element => element.addEventListener('click', handleIPButtonClick))

document
.querySelectorAll('.faq-master .item button')
.forEach(element => element.addEventListener('click', handleFAQButtonClick))

document
.querySelector('#hamburger')
.addEventListener('click', handleHamburgering)

document
.querySelector('#team-arrow-right')
.addEventListener('click', () => handleTeamScroll(1))

document
.querySelector('#team-arrow-left')
.addEventListener('click', () => handleTeamScroll(heads.length - 1))

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
    if (
        isInViewport(teamContainer) === true
        && window.innerWidth >= 768
    ) {
      handleTeamScroll(1)
    }
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
  const {top, bottom, left, right} = element.getBoundingClientRect()
  const windowHeight = window.innerHeight ?? document.documentElement.clientHeight
  const windowWidth = window.innerWidth ?? document.documentElement.clientWidth

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

function handleAnchorClick(event) {
  event.preventDefault()

  const target = document.querySelector(
      event.currentTarget.getAttribute('href')
      ?? event.currentTarget.getAttribute('onclick').split("'")[1]
  )

  if (target === null) {
    console.error(`Cannot resolve anchor ${event.currentTarget.getAttribute('href')} in file ${window.location.pathname}`)
  } else {
    scrollTo(target)
  }
}

async function handleIPButtonClick() {
  try {
    if ("clipboard" in navigator) {
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
}

function handleFAQButtonClick() {
  const text = this.nextElementSibling
  text.style.display = ''

  setTimeout(() => {
    text.classList.toggle('open')
    this.lastElementChild.classList.toggle('open')
  }, 1)
  setTimeout(() => {
    text.style.display = text.classList.contains('open') ? '' : 'none'
  }, 500)
}

function handleHamburgering() {
  if (isHamburgering === true) return

  isHamburgering = true

  navItems.classList.toggle('open')
  navContent.classList.toggle('open')

  setTimeout(() => {
    navItems.style.display = navItems.classList.contains('open') ? 'flex' : ''
    isHamburgering = false
  }, 250)
}

function handleTeamScroll(offset) {
  openTeamMember((currentIndex + offset) % heads.length)
}

function handleHeadClick(head) {
  if (isUpdating === true) return

  const classList = head.classList

  if (
      classList.contains('head') === true
      && classList.contains('selected') === false
  ) openTeamMember(heads.indexOf(head))
}

function openTeamMember(index) {
  if (isUpdating === true) return

  const previousIndex = currentIndex
  currentIndex = index

  updateSelectedIndex(previousIndex)
}

function showToast(
    text,
    color = ToastType.INFO
) {
  if (typeof text !== 'string') {
    e('Toast text must be a string')
  }

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

function e(o) { throw new Error(o) }
