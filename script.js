/**
 * Автослон - BRP Dealer
 * Vanilla JavaScript functionality
 */

document.addEventListener('DOMContentLoaded', function () {
    'use strict';

    // Init Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Elements
    const navbar = document.getElementById('navbar');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelectorAll('a[href^="#"]');

    /**
     * Navbar scroll effect - add solid background on scroll
     */
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    }, { passive: true });

    /**
     * Mobile menu toggle
     */
    function toggleMobileMenu() {
        mobileMenu.classList.toggle('hidden');
        const icon = mobileMenuBtn.querySelector('i');

        if (!mobileMenu.classList.contains('hidden')) {
            icon.setAttribute('data-lucide', 'x');
        } else {
            icon.setAttribute('data-lucide', 'menu');
        }

        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }

    /**
     * Close mobile menu on link click
     */
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
                const icon = mobileMenuBtn.querySelector('i');
                if (icon) {
                    icon.setAttribute('data-lucide', 'menu');
                    lucide.createIcons();
                }
            }
        });
    });

    /**
     * Optimized Snow Effect - Always ON
     */
    const snowCanvas = document.getElementById('snow-canvas');
    let animationId = null;
    const snowflakes = [];
    const snowCount = 50;

    function resizeCanvas() {
        if (snowCanvas) {
            snowCanvas.width = window.innerWidth;
            snowCanvas.height = window.innerHeight;
        }
    }

    function createSnowflakes() {
        snowflakes.length = 0;
        for (let i = 0; i < snowCount; i++) {
            snowflakes.push({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                radius: Math.random() * 1.5 + 0.5,
                speed: Math.random() * 0.6 + 0.15,
                wind: (Math.random() - 0.5) * 0.3,
                opacity: Math.random() * 0.4 + 0.2,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.02
            });
        }
    }

    function drawSimpleSnowflake(ctx, x, y, radius, rotation, opacity) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);
        ctx.globalAlpha = opacity;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = Math.max(0.5, radius * 0.3);
        ctx.lineCap = 'round';

        const size = radius * 2.5;
        
        ctx.beginPath();
        ctx.moveTo(0, -size);
        ctx.lineTo(0, size);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(-size, 0);
        ctx.lineTo(size, 0);
        ctx.stroke();
        
        if (radius > 1.2) {
            const diag = size * 0.7;
            ctx.beginPath();
            ctx.moveTo(-diag, -diag);
            ctx.lineTo(diag, diag);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(-diag, diag);
            ctx.lineTo(diag, -diag);
            ctx.stroke();
        }
        
        ctx.restore();
    }

    let lastTime = 0;
    function drawSnow(currentTime) {
        if (!snowCanvas) return;
        
        // Пропускаем кадры если меньше 16ms прошло (ограничение ~60fps)
        if (currentTime - lastTime < 16) {
            animationId = requestAnimationFrame(drawSnow);
            return;
        }
        lastTime = currentTime;

        const ctx = snowCanvas.getContext('2d');
        ctx.clearRect(0, 0, snowCanvas.width, snowCanvas.height);

        snowflakes.forEach(flake => {
            flake.rotation += flake.rotationSpeed;
            flake.y += flake.speed;
            flake.x += flake.wind;
            const wobble = Math.sin(flake.rotation * 0.5) * 0.1;
            
            drawSimpleSnowflake(ctx, flake.x + wobble, flake.y, flake.radius, flake.rotation, flake.opacity);
            
            if (flake.y > window.innerHeight + 5) {
                flake.y = -5;
                flake.x = Math.random() * window.innerWidth;
            }
            if (flake.x > window.innerWidth) flake.x = 0;
            if (flake.x < 0) flake.x = window.innerWidth;
        });

        animationId = requestAnimationFrame(drawSnow);
    }

    // Инициализация снега (всегда включен)
    if (snowCanvas) {
        snowCanvas.style.willChange = 'transform';
        snowCanvas.style.opacity = '1';
        
        resizeCanvas();
        createSnowflakes();
        
        window.addEventListener('resize', () => {
            resizeCanvas();
            createSnowflakes();
        });
        
        drawSnow(0);
    }

    // Проверка загрузки hero video
    const heroVideo = document.getElementById('hero-video');
    if (heroVideo) {
        heroVideo.addEventListener('error', () => {
            console.log('Видео не загрузилось, показываем фallback');
            heroVideo.style.display = 'none';
        });

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                heroVideo.pause();
            } else {
                heroVideo.play();
            }
        });
    }

    /**
     * Smooth scroll
     */
    function smoothScroll(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetSection = document.querySelector(targetId);
        if (targetSection) {
            const headerOffset = 80;
            const elementPosition = targetSection.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }

    navLinks.forEach(link => {
        link.addEventListener('click', smoothScroll);
    });

    /**
     * Intersection Observer for animations
     */
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealElements = document.querySelectorAll('section h2, .glass-card, table, .glass-image');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.05}s, transform 0.6s ease ${index * 0.05}s`;
        revealObserver.observe(el);
    });

    // Progress bar scroll indicator
    const progressBar = document.getElementById('scroll-progress');

    window.addEventListener('scroll', () => {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (scrollTop / scrollHeight) * 100;

        if (progressBar) {
            progressBar.style.width = scrolled + "%";
        }
    }, { passive: true });

    /**
     * Active nav highlighting
     */
    const sections = document.querySelectorAll('section[id]');

    function highlightNav() {
        const scrollPos = window.pageYOffset + 150;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                document.querySelectorAll('nav a[href^="#"]').forEach(link => {
                    link.classList.remove('text-white');
                    link.classList.add('text-white/80');
                });

                const activeLink = document.querySelector(`nav a[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.remove('text-white/80');
                    activeLink.classList.add('text-white');
                }
            }
        });
    }

    window.addEventListener('scroll', highlightNav, { passive: true });

    console.log('🏔️ АВТОСЛОН загружен');
});