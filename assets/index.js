const anchorLinks = document.querySelectorAll('a[href*="#"]');

anchorLinks.forEach(function(link) {
    link.addEventListener("click", function(event) {
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