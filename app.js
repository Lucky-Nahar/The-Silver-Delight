// The Silver Delight - JavaScript functionality

class SilverDelightApp {
    constructor() {
        this.currentSlide = 0;
        this.totalSlides = document.querySelectorAll('.hero__slide').length;
        this.slideInterval = null;
        this.isMenuOpen = false;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.startHeroSlider();
        this.updateThemeToggle();
    }
    
    setupEventListeners() {
        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }
        
        // Theme toggle bar logic
        const themeToggleBar = document.getElementById('themeToggleBar');
        if (themeToggleBar) {
            themeToggleBar.addEventListener('click', function () {
                const html = document.documentElement;
                const current = html.getAttribute('data-color-scheme');
                html.setAttribute('data-color-scheme', current === 'dark' ? 'light' : 'dark');
            });
        }
        
        // Mobile menu toggle
        const navHamburger = document.getElementById('navHamburger');
        const navMenu = document.getElementById('navMenu');
        if (navHamburger && navMenu) {
            navHamburger.addEventListener('click', () => this.toggleMobileMenu());
        }
        
        // Close mobile menu when clicking nav links
        const navLinks = document.querySelectorAll('.nav__link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMobileMenu());
        });
        
        // Hero slide indicators
        const indicators = document.querySelectorAll('.hero__indicator');
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });
        
        // Categories navigation
        const categoriesPrev = document.getElementById('categoriesPrev');
        const categoriesNext = document.getElementById('categoriesNext');
        const categoriesContainer = document.getElementById('categoriesContainer');
        
        if (categoriesPrev && categoriesNext && categoriesContainer) {
            categoriesPrev.addEventListener('click', () => this.scrollCategories('prev'));
            categoriesNext.addEventListener('click', () => this.scrollCategories('next'));
            
            // Update navigation buttons based on scroll position
            categoriesContainer.addEventListener('scroll', () => this.updateCategoriesNav());
            this.updateCategoriesNav(); // Initial check
        }
        
        // Category cards hover effect
        const categoryCards = document.querySelectorAll('.category__card');
        categoryCards.forEach(card => {
            card.addEventListener('click', () => {
                const title = card.querySelector('.category__title').textContent;
                this.showCategoryAlert(title);
            });
        });
        
        // Smooth scrolling for navigation links
        this.setupSmoothScrolling();
        
        // Handle window resize
        window.addEventListener('resize', () => this.handleResize());
    }
    
    toggleTheme() {
        const html = document.documentElement;
        const currentTheme = html.getAttribute('data-color-scheme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        html.setAttribute('data-color-scheme', newTheme);
        this.updateThemeToggle();
        
        // Save theme preference
        localStorage.setItem('theme', newTheme);
    }
    
    updateThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        const themeIcon = themeToggle?.querySelector('.theme-toggle__icon');
        const currentTheme = document.documentElement.getAttribute('data-color-scheme');
        
        if (themeIcon) {
            themeIcon.textContent = currentTheme === 'light' ? '🌙' : '☀️';
        }
    }
    
    toggleMobileMenu() {
        const navMenu = document.getElementById('navMenu');
        const navHamburger = document.getElementById('navHamburger');
        
        if (navMenu && navHamburger) {
            this.isMenuOpen = !this.isMenuOpen;
            navMenu.classList.toggle('active', this.isMenuOpen);
            navHamburger.classList.toggle('active', this.isMenuOpen);
            
            // Prevent body scrolling when menu is open
            document.body.style.overflow = this.isMenuOpen ? 'hidden' : '';
        }
    }
    
    closeMobileMenu() {
        const navMenu = document.getElementById('navMenu');
        const navHamburger = document.getElementById('navHamburger');
        
        if (navMenu && navHamburger && this.isMenuOpen) {
            this.isMenuOpen = false;
            navMenu.classList.remove('active');
            navHamburger.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
    
    startHeroSlider() {
        this.slideInterval = setInterval(() => {
            this.nextSlide();
        }, 4000);
        
        // Pause on hover
        const heroSlider = document.querySelector('.hero__slider');
        if (heroSlider) {
            heroSlider.addEventListener('mouseenter', () => this.pauseSlider());
            heroSlider.addEventListener('mouseleave', () => this.resumeSlider());
        }
    }
    
    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
        this.updateSlider();
    }
    
    goToSlide(slideIndex) {
        this.currentSlide = slideIndex;
        this.updateSlider();
        this.resetSliderInterval();
    }
    
    updateSlider() {
        const slides = document.querySelectorAll('.hero__slide');
        const indicators = document.querySelectorAll('.hero__indicator');
        
        slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === this.currentSlide);
        });
        
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentSlide);
        });
    }
    
    pauseSlider() {
        if (this.slideInterval) {
            clearInterval(this.slideInterval);
            this.slideInterval = null;
        }
    }
    
    resumeSlider() {
        if (!this.slideInterval) {
            this.startHeroSlider();
        }
    }
    
    resetSliderInterval() {
        this.pauseSlider();
        this.resumeSlider();
    }
    
    scrollCategories(direction) {
        const container = document.getElementById('categoriesContainer');
        if (!container) return;
        
        const cardWidth = 216; // 200px width + 16px gap
        const scrollAmount = direction === 'next' ? cardWidth : -cardWidth;
        
        container.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
    }
    
    updateCategoriesNav() {
        const container = document.getElementById('categoriesContainer');
        const prevBtn = document.getElementById('categoriesPrev');
        const nextBtn = document.getElementById('categoriesNext');
        
        if (!container || !prevBtn || !nextBtn) return;
        
        const { scrollLeft, scrollWidth, clientWidth } = container;
        
        prevBtn.disabled = scrollLeft <= 0;
        nextBtn.disabled = scrollLeft >= scrollWidth - clientWidth - 1;
        
        prevBtn.style.opacity = prevBtn.disabled ? '0.3' : '1';
        nextBtn.style.opacity = nextBtn.disabled ? '0.3' : '1';
    }
    
    showCategoryAlert(categoryName) {
        // Simple alert for category selection - in real app would navigate to category page
        alert(`You selected: ${categoryName}\n\nThis would normally navigate to the ${categoryName} category page.`);
    }
    
    setupSmoothScrolling() {
        const navLinks = document.querySelectorAll('.nav__link[href^="#"]');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
                
                this.closeMobileMenu();
            });
        });
    }
    
    handleResize() {
        // Close mobile menu on resize to desktop
        if (window.innerWidth > 768 && this.isMenuOpen) {
            this.closeMobileMenu();
        }
        
        // Update categories navigation
        this.updateCategoriesNav();
    }
    
    // Initialize theme from localStorage or system preference
    initTheme() {
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
        
        document.documentElement.setAttribute('data-color-scheme', initialTheme);
        this.updateThemeToggle();
    }
}

// Additional utility functions
function addScrollEffect() {
    const header = document.querySelector('.header');
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            header.style.backgroundColor = 'var(--color-surface)';
            header.style.backdropFilter = 'blur(20px)';
            header.style.boxShadow = 'var(--shadow-md)';
        } else {
            header.style.backgroundColor = 'var(--color-surface)';
            header.style.backdropFilter = 'blur(10px)';
            header.style.boxShadow = 'var(--shadow-sm)';
        }
        
        lastScrollY = currentScrollY;
    });
}

function addIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe category cards and store cards
    const cards = document.querySelectorAll('.category__card, .store__card');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}

// Enhanced map interaction
function initMap() {
    const mapContainer = document.querySelector('.map__placeholder');
    if (!mapContainer) return;
    
    mapContainer.addEventListener('click', (e) => {
        const rect = mapContainer.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        
        // Calculate ripple size based on container size
        const minDim = Math.min(rect.width, rect.height);
        const rippleDiameter = Math.max(24, minDim * 0.2); // at least 24px, 20% of container
        
        // Create ripple effect
        const ripple = document.createElement('div');
        ripple.style.position = 'absolute';
        ripple.style.left = `${x}%`;
        ripple.style.top = `${y}%`;
        ripple.style.width = `${rippleDiameter}px`;
        ripple.style.height = `${rippleDiameter}px`;
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(33, 128, 141, 0.3)';
        ripple.style.transform = 'translate(-50%, -50%) scale(0)';
        ripple.style.animation = 'mapRipple 0.6s ease-out forwards';
        ripple.style.pointerEvents = 'none';
        
        mapContainer.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
    
    // Add CSS for map ripple animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes mapRipple {
            to {
                transform: translate(-50%, -50%) scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Footer fade-in on scroll
function observeFooterFadeIn() {
    const footer = document.querySelector('.footer');
    if (!footer) return;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                footer.classList.add('footer--visible');
            }
        });
    }, { threshold: 0.1 });
    observer.observe(footer);
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new SilverDelightApp();
    app.initTheme();
    
    // Add additional effects
    addScrollEffect();
    addIntersectionObserver();
    initMap();
    observeFooterFadeIn();
    
    // Add loading animation completion
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.3s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Handle system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
        const newTheme = e.matches ? 'dark' : 'light';
        document.documentElement.setAttribute('data-color-scheme', newTheme);
        
        const app = window.silverDelightApp;
        if (app) {
            app.updateThemeToggle();
        }
    }
});

// Export for global access
window.silverDelightApp = null;

// Performance optimization - lazy load images
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Call lazy load on DOM ready
document.addEventListener('DOMContentLoaded', lazyLoadImages);

// Smooth scrolling for anchor links

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href').slice(1);
        const target = document.getElementById(targetId);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// --- LEAFLET MAP FOR STORES ---
function initLeafletStoreMap() {
    const mapDiv = document.getElementById('leafletMap');
    if (!mapDiv) return;

    const stores = [
        {
            name: 'The Silver Delight - Bahadurgarh',
            coords: [28.6916, 76.9352],
            gmaps: 'https://www.google.com/maps/dir/?api=1&destination=28.6916,76.9352'
        },
        {
            name: 'The Silver Delight - Panipat',
            coords: [29.3906, 76.9632],
            gmaps: 'https://www.google.com/maps/dir/?api=1&destination=29.3906,76.9632'
        }
    ];

    const map = L.map('leafletMap').setView([29.04, 76.95], 9);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://carto.com/attributions">CARTO</a> contributors'
    }).addTo(map);

    stores.forEach(store => {
        const marker = L.marker(store.coords).addTo(map);
        marker.bindPopup(
            `<b>${store.name}</b><br>` +
            `<a href="${store.gmaps}" target="_blank" rel="noopener" style="color:#1976d2;font-weight:bold;">Get Directions</a>`
        );
    });

    const bounds = L.latLngBounds(stores.map(s => s.coords));
    map.fitBounds(bounds, { padding: [40, 40] });
}
window.addEventListener('DOMContentLoaded', initLeafletStoreMap);