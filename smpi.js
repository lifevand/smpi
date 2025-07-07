document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    const navLinks = document.querySelectorAll('.main-nav .nav-list a:not(.dropbtn)');
    const dropdownToggles = document.querySelectorAll('.main-nav .dropbtn');

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            menuToggle.querySelector('i').classList.toggle('fa-bars');
            menuToggle.querySelector('i').classList.toggle('fa-times');
        });

        // Close mobile nav when a link is clicked (excluding dropdown parents)
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (mainNav.classList.contains('active')) {
                    mainNav.classList.remove('active');
                    menuToggle.querySelector('i').classList.remove('fa-times');
                    menuToggle.querySelector('i').classList.add('fa-bars');
                    // Close any open dropdowns if present
                    dropdownToggles.forEach(toggle => {
                        toggle.closest('.dropdown').classList.remove('open');
                    });
                }
            });
        });

        // Toggle dropdowns in mobile view
        dropdownToggles.forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                // Prevent default link behavior for dropdown button
                e.preventDefault();
                const parentDropdown = toggle.closest('.dropdown');
                parentDropdown.classList.toggle('open');
                // Close other open dropdowns
                dropdownToggles.forEach(otherToggle => {
                    const otherParentDropdown = otherToggle.closest('.dropdown');
                    if (otherParentDropdown !== parentDropdown && otherParentDropdown.classList.contains('open')) {
                        otherParentDropdown.classList.remove('open');
                    }
                });
            });
        });

        // Close mobile menu if window is resized above mobile breakpoint
        window.addEventListener('resize', () => {
            if (window.innerWidth > 992 && mainNav.classList.contains('active')) {
                mainNav.classList.remove('active');
                menuToggle.querySelector('i').classList.remove('fa-times');
                menuToggle.querySelector('i').classList.add('fa-bars');
                dropdownToggles.forEach(toggle => {
                    toggle.closest('.dropdown').classList.remove('open');
                });
            }
        });
    }


    // 2. Hero Slider
    const slides = document.querySelectorAll('.hero-slider .slide');
    const prevButton = document.querySelector('.slider-nav .prev-slide');
    const nextButton = document.querySelector('.slider-nav .next-slide');
    const sliderDotsContainer = document.querySelector('.slider-dots');
    let currentSlide = 0;
    let slideInterval;

    function createDots() {
        slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (index === 0) {
                dot.classList.add('active');
            }
            dot.addEventListener('click', () => {
                goToSlide(index);
                resetInterval();
            });
            sliderDotsContainer.appendChild(dot);
        });
    }

    function showSlide(index) {
        // Remove active class from all slides and dots
        slides.forEach(slide => slide.classList.remove('active'));
        document.querySelectorAll('.slider-dots .dot').forEach(dot => dot.classList.remove('active'));

        // Add active class to current slide and dot
        slides[index].classList.add('active');
        document.querySelectorAll('.slider-dots .dot')[index].classList.add('active');
        currentSlide = index;
    }

    function goToNextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    function goToPrevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    }

    function goToSlide(index) {
        showSlide(index);
    }

    function startSlider() {
        slideInterval = setInterval(goToNextSlide, 7000); // Change slide every 7 seconds
    }

    function resetInterval() {
        clearInterval(slideInterval);
        startSlider();
    }

    if (slides.length > 0) {
        createDots();
        showSlide(currentSlide);
        startSlider();

        prevButton.addEventListener('click', () => {
            goToPrevSlide();
            resetInterval();
        });

        nextButton.addEventListener('click', () => {
            goToNextSlide();
            resetInterval();
        });
    }


    // 3. Scroll Reveal / Fade-in Animation for sections
    // This will add a class 'animate' when the section is in view
    const sections = document.querySelectorAll('.section-padded');

    const observerOptions = {
        root: null, // relative to the viewport
        rootMargin: '0px',
        threshold: 0.2 // 20% of the section must be visible
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // Add CSS for .animate class for fade-in/slide-up effects
    // This should be in style.css, but including here for context:
    /*
    .section-padded {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.8s ease-out, transform 0.8s ease-out;
    }
    .section-padded.animate {
        opacity: 1;
        transform: translateY(0);
    }
    */


    // 4. Smooth Scroll for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId && targetId !== '#') {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    // Calculate offset for fixed header
                    const headerOffset = document.querySelector('.main-header').offsetHeight;
                    const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                    const offsetPosition = elementPosition - headerOffset - 20; // -20 for a little extra space

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                } else {
                    // Fallback for non-existent targets or just a hash
                    window.location.hash = targetId;
                }
            }
        });
    });

    // 5. Active Nav Link on Scroll
    const header = document.querySelector('.main-header');
    const navList = document.querySelector('.main-nav .nav-list');
    const sectionsToObserve = document.querySelectorAll('main section'); // Observe all main sections

    const navObserverOptions = {
        root: null,
        rootMargin: `-${header.offsetHeight + 1}px 0px -50% 0px`, // Adjust based on header height
        threshold: 0
    };

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                // Remove active from all
                navList.querySelectorAll('a').forEach(link => link.classList.remove('active'));

                // Add active to the corresponding link
                const activeLink = navList.querySelector(`a[href="#${id}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }, navObserverOptions);

    sectionsToObserve.forEach(sec => {
        navObserver.observe(sec);
    });

    // Initial active link setting for home
    if (window.scrollY === 0) {
        navList.querySelector('a[href="#home"]').classList.add('active');
    }

});