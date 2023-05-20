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
