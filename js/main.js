document.addEventListener("DOMContentLoaded",() => {
    "use strict";
// SPINNER
    const spinner = () => {
        setTimeout(() => {
            const spinnerEl = document.getElementById('spinner');
            if (spinnerEl) spinnerEl.classList.remove('show');
        }, 1);
    };
    spinner();

// HAMBURGER
    $(document).ready(() => {
        $(".hamburger").click(function () {
            $(this).toggleClass("is-active");
        });
    });

new WOW().init();

// NAVBAR
    const navbar = document.querySelector('.sticky-top');
    const logoText = document.querySelector('.logo-text');
    
    if (navbar && logoText) {
        let lastScrollTop = 0; 
    
        function updateNavbarBackground() {
            const scrollTop = window.scrollY;
            const screenWidth = window.innerWidth;
        
            if (screenWidth >= 1200) {
                const opacity = Math.min(0.5, (scrollTop / 300) * 0.5);
                navbar.style.backgroundColor = `rgba(33, 33, 33, ${1 - opacity})`;
                logoText.classList.toggle('visible', scrollTop > 0);
            } else {
                navbar.style.backgroundColor = "transparent";
                logoText.classList.remove('visible');
            }
        }
    
        window.addEventListener("scroll", function () {
            updateNavbarBackground();
            const scrollTop = window.scrollY;
            if (scrollTop > lastScrollTop) {
                navbar.style.top = "0"; 
            } else if (scrollTop === 0) {
                navbar.style.top = "0";
            } else {
                navbar.style.top = "-100px";
            }
            lastScrollTop = scrollTop;
        });
    
        window.addEventListener("resize", updateNavbarBackground);
        updateNavbarBackground();
    
    } else {
        console.error("Error: navbar o logoText no encontrados.");
    }
// ENLACES
    const currentLocation = window.location.pathname.split("/").pop();
    document.querySelectorAll(".navbar-nav a").forEach(link => {
        if (link.getAttribute("href") === currentLocation) link.classList.add("active");
    });

// CARTA
    const galeria = document.querySelector(".galeria-carta");
    const imagenes = {
        "Café": "url('img/cafe.jpg')",
        "Café frío": "url('img/cafe-frio.jpg')",
        "Para comer": "url('img/para-comer.jpg')",
        "Otras bebidas": "url('img/otras-bebidas.jpg')"
    };

    document.querySelectorAll(".accordion-item").forEach(item => {
        item.addEventListener("mouseenter", function () {
            const titulo = this.querySelector("button span:nth-child(2)")?.textContent.trim();
            if (imagenes[titulo]) {
                galeria.style.setProperty("--bg-image", imagenes[titulo], "important");
                galeria.classList.add("active");
                galeria.style.setProperty("background-image", imagenes[titulo], "important");
            }
        });
        item.addEventListener("mouseleave", () => galeria.classList.remove("active"));
    });

// BOTÓN PARA IR ARRIBA
$(window).scroll(function () {
    if ($(this).scrollTop() > 300) {
        if (!$('.back-to-top').is(':visible')) {
            $('.back-to-top').fadeIn(200);
        }
    } else {
        if ($('.back-to-top').is(':visible')) {
            $('.back-to-top').fadeOut(200);
        }
    }
});

$('.back-to-top').click(function () {
    $('html, body').animate({scrollTop: 0}, 700, 'easeOutCubic');
    return false;
});
        
// FORM
    const form = document.querySelector('form');
    if (!form) return console.error("Error: No se encontró el formulario en el DOM.");

    const emailInput = form.querySelector('[type=email]');
    const telInput = form.querySelector('[type=tel]');
    const feedbackEmail = document.querySelector('.invalid-feedback.email');
    const feedbackTel = document.querySelector('.invalid-feedback.tel');
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    emailInput?.addEventListener("input", function () {
        const isValid = emailRegex.test(emailInput.value);
        feedbackEmail.textContent = isValid ? '' : emailInput.title;
        feedbackEmail.style.display = isValid ? "none" : "block";
        emailInput.classList.toggle("is-invalid", !isValid);
    });

    telInput?.addEventListener("input", function () {
        feedbackTel.textContent = this.validity.patternMismatch ? telInput.title : '';
    });

    form.addEventListener('submit', async event => {
        event.preventDefault();
        if (!form.checkValidity()) {
            event.stopPropagation();
            form.classList.add('was-validated');
            return;
        }

        grecaptcha.execute('6LcLDGEqAAAAALrMvzbZnBUnmZ0k-p7DnccMXLDc', { action: 'formulario' })
        .then(async token => {
            document.getElementById('recaptchaResponse').value = token;
            const formData = new FormData(form);
            try {
                const response = await fetch('proceso-contacto.php', { method: 'POST', body: formData });
                const data = await response.json();
                if (data.success) {
                    new bootstrap.Modal(document.getElementById('feedback')).show();
                    form.classList.remove('was-validated');
                    form.reset();
                } else {
                    alert('Error al enviar el formulario: ' + data.message);
                }
            } catch (error) {
                console.error('Error en la petición:', error);
                alert('Hubo un problema al enviar el formulario. Intenta de nuevo.');
            }
        });
    });
});

