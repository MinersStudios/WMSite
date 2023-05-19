const anchorLinks = document.querySelectorAll('a[href*="#"]');
anchorLinks.forEach(function(link) {
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
ipButtons.forEach(function(button) {
    button.addEventListener('click', function() {
        const ip = 'play.whomine.net';

        navigator.clipboard.writeText(ip)
            .then(function() {
                showToast('Айпи скопирован!', 'green');
            })
            .catch(function() {
                showToast('Айпи не удалось скопировать :(', 'red');
                console.error('Failed to copy the IP, please use a better browser');
            });
    });
});


function showToast(text, color) {
    const toastsContainer = document.querySelector('.toasts');
    const toast = document.createElement('div');
    toast.classList.add('toast', 'transitionIn', 'transitionOut', color);
    toast.textContent = text;
    toastsContainer.appendChild(toast);

    setTimeout(function () {
        toastsContainer.removeChild(toast);
    }, 3500);
}