const anchorLinks = document.querySelectorAll('a[href*="#"]');
anchorLinks.forEach((link) => {
    link.addEventListener('click', function(event) {
        event.preventDefault();
        const attribute = this.getAttribute('href');
        const target = document.querySelector(attribute);
        if (target) {
            window.scrollTo({
                top: target.offsetTop,
                behavior: 'smooth'
            });
        } else {
            console.error("Cannot resolve anchor " + attribute + " in file " + window.location.pathname);
        }
    });
});

const ipButtons = document.querySelectorAll('button#ip');
ipButtons.forEach((button) => {
    button.addEventListener('click', function() {
        const ip = 'play.whomine.net';

        navigator.clipboard.writeText(ip)
            .then(() => {
                showToast('Айпи скопирован!', 'green');
            })
            .catch((error) => {
                showToast('Айпи не удалось скопировать :(', 'red');
                console.error('Failed to copy the IP, please use a better browser: ', error);
            });
    });
});

function showToast(text, color) {
    const toastsContainer = document.querySelector('.toasts');
    const toast = document.createElement('div');
    toast.classList.add('toast', 'transitionIn', 'transitionOut', color);
    toast.textContent = text;
    toastsContainer.appendChild(toast);

    setTimeout(() => {
        toastsContainer.removeChild(toast);
    }, 3500);
}

document.addEventListener("DOMContentLoaded", () => {
    const arrowLeft = document.getElementById("team-arrow-left");
    const arrowRight = document.getElementById("team-arrow-right");
    const heads = Array.from(document.querySelectorAll(".head"));
    const personalInfoContainers = Array.from(document.querySelectorAll(".personal-info > div"));
    const bodyContainers = Array.from(document.querySelectorAll(".skin > div"));
    const teamContainer = document.getElementById("team");

    let currentIndex = 0;
    let isUpdating = false;
    let intervalId = null;

    function updateSelectedIndex(index, previousIndex) {
        if (isUpdating) return;
        isUpdating = true;

        heads[previousIndex].classList.remove("selected");

        personalInfoContainers[previousIndex].classList.add("fadeText-leave-to", "fadeText-leave-active");
        setTimeout(() => {
            personalInfoContainers[previousIndex].classList.remove("selected", "fadeText-leave-to", "fadeText-leave-active");
        }, 350);

        bodyContainers[previousIndex].classList.add("fadeImg-leave-to", "fadeImg-leave-active");
        setTimeout(() => {
            bodyContainers[previousIndex].classList.remove("selected", "fadeImg-leave-to", "fadeImg-leave-active");
        }, 350);

        heads[index].classList.add("selected");

        personalInfoContainers[index].classList.add("selected", "fadeText-enter-from", "fadeText-enter-active");
        setTimeout(() => {
            personalInfoContainers[index].classList.remove("fadeText-enter-from");
        }, 10);
        setTimeout(() => {
            personalInfoContainers[index].classList.remove("fadeText-enter-active");
            isUpdating = false;
        }, 350);

        bodyContainers[index].classList.add("selected", "fadeImg-enter-from", "fadeImg-enter-active");
        setTimeout(() => {
            bodyContainers[index].classList.remove("fadeImg-enter-from");
        }, 10);
        setTimeout(() => {
            bodyContainers[index].classList.remove("fadeImg-enter-active");
            isUpdating = false;
        }, 350);
    }

    arrowRight.addEventListener("click", () => {
        if (isUpdating) return;
        const previousIndex = currentIndex;
        currentIndex = (currentIndex + 1) % heads.length;
        updateSelectedIndex(currentIndex, previousIndex);
    });

    arrowLeft.addEventListener("click", () => {
        if (isUpdating) return;
        const previousIndex = currentIndex;
        currentIndex = (currentIndex - 1 + heads.length) % heads.length;
        updateSelectedIndex(currentIndex, previousIndex);
    });

    heads.forEach((head) => {
        head.addEventListener("click", function() {
            if (isUpdating) return;
            const headId = this.getAttribute("id");
            const previousIndex = currentIndex;
            const newIndex = heads.findIndex((head) => head.getAttribute("id") === headId);
            if (newIndex !== currentIndex) {
                currentIndex = newIndex;
                updateSelectedIndex(currentIndex, previousIndex);
            }
        });
    });

    function startAutoScroll() {
        intervalId = setInterval(() => {
            const previousIndex = currentIndex;
            currentIndex = (currentIndex + 1) % heads.length;
            updateSelectedIndex(currentIndex, previousIndex);
        }, 5000);
    }

    function stopAutoScroll() {
        clearInterval(intervalId);
    }

    teamContainer.addEventListener("mouseenter", stopAutoScroll);
    teamContainer.addEventListener("mouseleave", startAutoScroll);

    updateSelectedIndex(currentIndex, 1);
    startAutoScroll();
});

let previousRandomIndex = -1;
let isScreenshotLoading = false;

function getRandomScreenshot() {
    if (isScreenshotLoading) return;

    const screenshots = [
        '1.png',
        '2.png',
        '3.png',
        '4.png',
        '5.png',
        '6.png',
        '7.png',
        '8.png',
        '9.png',
        '10.png',
        '11.png',
        '12.png',
        '13.png',
        '14.png',
        '15.png',
        '17.png',
        '18.png',
        '19.png',
        '20.png',
        '22.png',
        '23.png',
        '24.png',
        '25.png',
        '26.png',
        '27.png',
        '28.png',
        '30.png'
    ];

    const screenshotImg = document.getElementById('screenshot-img');
    let random = Math.floor(Math.random() * screenshots.length);

    while (random === previousRandomIndex) {
        random = Math.floor(Math.random() * screenshots.length);
    }

    screenshotImg.style.opacity = "0";
    setTimeout(() => {
        screenshotImg.style.backgroundImage = `url(./assets/img/screenshots/${screenshots[random]})`;
    }, 350);
    previousRandomIndex = random;
    isScreenshotLoading = true;

    const image = new Image();
    image.src = './assets/img/screenshots/' + screenshots[random];
    image.onload = function() {
        const brightness = calculateBrightness(image);
        updateButtonColor(brightness);
        setTimeout(() => {
            screenshotImg.classList.add('loaded');
            screenshotImg.style.opacity = "1";
        }, 350);
        setTimeout(() => {
            isScreenshotLoading = false;
        }, 500);
    };
}

function calculateBrightness(image) {
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    const context = canvas.getContext('2d');
    context.drawImage(image, 0, 0);
    return getAverageBrightness(context.getImageData(0, 0, image.width, image.height));
}

function getAverageBrightness(imageData) {
    let brightnessSum = 0;
    const data = imageData.data;
    const pixelCount = data.length / 4;

    for (let i = 0; i < pixelCount; i++) {
        const r = data[i * 4];
        const g = data[i * 4 + 1];
        const b = data[i * 4 + 2];
        const brightnessValue = (r + g + b) / 3;
        brightnessSum += brightnessValue;
    }

    return brightnessSum / pixelCount;
}

function updateButtonColor(brightness) {
    const button = document.getElementById('random-button');
    if (brightness > 128) {
        button.classList.add('dark');
    } else {
        button.classList.remove('dark');
    }
}

document.getElementById('random-button').addEventListener('click', getRandomScreenshot);

getRandomScreenshot();

function isElementInViewport(element, threshold = 125) {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const windowWidth = window.innerWidth || document.documentElement.clientWidth;
    const topVisible = rect.top + threshold < windowHeight;
    const bottomVisible = rect.bottom - threshold > 0;
    const leftVisible = rect.left + threshold < windowWidth;
    const rightVisible = rect.right - threshold > 0;
    return topVisible && bottomVisible && leftVisible && rightVisible;
}

function handleScroll() {
    const articles = document.querySelectorAll('article');
    for (const article of articles) {
        if (isElementInViewport(article)) {
            article.classList.add('animate');
        }
    }
}

window.addEventListener('scroll', handleScroll);

handleScroll();
