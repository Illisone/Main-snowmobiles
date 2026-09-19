/**
 * SibXtrim - BRP Dealer
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
     * Navbar scroll effect
     */
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        if (currentScroll > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
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
     * Snow Effect
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

    // Hero video
    const heroVideo = document.getElementById('hero-video');
    if (heroVideo) {
        heroVideo.addEventListener('error', () => {
            console.log('Видео не загрузилось, показываем fallback');
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
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetSection = document.querySelector(targetId);
        if (targetSection) {
            e.preventDefault();
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

    const revealElements = document.querySelectorAll('section h2, .glass-card, .glass-image');

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

    // Progress bar
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

    console.log('🏔️ SibXtrim загружен');
});

/* ============================================================
 * MODEL MODAL
 * ============================================================ */

const MODELS_DATA = {
    'skandic-le-2027': {
        badge: { text: 'В НАЛИЧИИ', class: 'bg-green-500/20 border-green-500/30 text-green-400' },
        model: 'Модель 2027',
        title: 'BRP SKANDIC LE 24"',
        subtitle: '900 ACE • 95 л.с.',
        price: '2 090 000 ₽',
        description: 'Флагманский утилитарный снегоход, построенный на совершенно новой платформе REV Gen5. Это не просто рабочая лошадка, а настоящий вездеход, созданный для покорения самых суровых зимних ландшафтов и выполнения самых тяжелых задач.',
        image: 'https://ski-doo.brp.com/content/dam/global/en/ski-doo/my25/studio/sport-utility/skandic/side/SKI-MY25-SKA-SE-900-ACE-Dusty-Navy-000ANSH00-Studio-RSIDE-NA.png',
        specs: [
            { value: '899 см³', label: 'Объем двигателя' },
            { value: '302 кг', label: 'Сухая масса' },
            { value: '610 мм', label: 'Ширина гусеницы' },
            { value: '239 мм', label: 'Ход задней подвески' }
        ],
        features: [
            'Платформа REV Gen5 с телескопической подвеской LTS',
            'Система Multi-LinQ с грузоподъемностью 56.7 кг',
            'Цифровой дисплей 4.5 дюйма',
            'Понижающая передача EasyShift для буксировки'
        ]
    },
    'skandic-se-2027': {
        badge: { text: 'ПРЕДЗАКАЗ', class: 'bg-blue-500/20 border-blue-500/30 text-blue-400' },
        model: 'Модель 2027',
        title: 'BRP SKANDIC SE 24"',
        subtitle: '900 ACE • 95 л.с.',
        price: '2 250 000 ₽',
        description: 'Утилитарный снегоход, построенный на абсолютно новой платформе REV Gen5. В отличие от чисто рабочей версии LE, модель SE делает акцент на комфорте, технологиях и универсальности.',
        image: 'https://ski-doo.brp.com/content/dam/global/en/ski-doo/my25/studio/sport-utility/skandic/3-4-front/SKI-MY25-SKA-SE-600R-ETEC-Dusty-Navy-000AUSD00-Studio-34FR-NA.png',
        specs: [
            { value: '42 л', label: 'Топливный бак' },
            { value: '680 кг', label: 'Буксировочная способность' },
            { value: '95 л.с.', label: 'Мощность' },
            { value: 'REV Gen5', label: 'Платформа' }
        ],
        features: [
            'Платформа REV Gen5',
            'Улучшенная эргономика и комфорт',
            'Современные технологии и опции',
            'Универсальность для работы и экспедиций'
        ]
    },
    'expedition-le-2026': {
        badge: { text: 'NEW 2026', class: 'bg-purple-500/20 border-purple-500/30 text-purple-400' },
        model: 'Флагман',
        title: 'BRP EXPEDITION LE 24"',
        subtitle: '900 ACE • REV Gen5',
        price: '2 260 000 ₽',
        description: 'Универсальный спортивно-утилитарный снегоход на новой платформе REV Gen5, который сочетает комфорт для дальних путешествий с возможностью выполнять тяжелую работу.',
        image: 'https://www.brp-world.com/content/dam/global/en/ski-doo/my26/studio/crossover/expedition/3-4-front/SKI-MY26-EXP-SE-900-ACE-Turbo-R-Tundra-Green-000AYTJ00-Studio-34FR-NA.png',
        specs: [
            { value: '266 мм', label: 'Ход подвески uMotion' },
            { value: '220 мм', label: 'Ход передней подвески' },
            { value: '62.2 кг', label: 'Грузоподъемность Multi-LinQ' },
            { value: '291 кг', label: 'Сухая масса' }
        ],
        features: [
            'Подвеска uMotion: +27 мм хода (266 мм)',
            'Гусеница Crosscut: новый рисунок, меньше шума',
            'Платформа REV Gen5: оптимальное распределение веса, LED-фары'
        ],
        highlight: {
            icon: 'sparkles',
            title: 'Инновации 2026 года'
        }
    }
};

function openModelModal(id) {
    const data = MODELS_DATA[id];
    if (!data) return;

    const modal = document.getElementById('model-modal');
    const content = document.getElementById('model-content');
    const scroll = document.getElementById('model-scroll');

    const badgeHtml = data.badge
        ? `<span class="px-3 py-1 ${data.badge.class} border text-xs font-bold rounded-full">${data.badge.text}</span>`
        : '';

    const specsHtml = data.specs.map(s => `
        <div class="glass-stat p-3 sm:p-4 rounded-lg border border-gray-800">
            <div class="text-lg sm:text-2xl font-bold text-white mb-1">${s.value}</div>
            <div class="text-[10px] sm:text-sm text-gray-500">${s.label}</div>
        </div>
    `).join('');

    const featuresHtml = data.features.map(f => `
        <li class="flex items-start">
            <i data-lucide="check-circle" class="w-4 h-4 sm:w-5 sm:h-5 text-slon-blue mr-2 sm:mr-3 flex-shrink-0 mt-0.5"></i>
            <span class="text-gray-300 text-sm">${f}</span>
        </li>
    `).join('');

    const highlightBlock = data.highlight ? `
        <div class="glass-card p-4 rounded-lg border border-slon-blue/30 mb-6">
            <h4 class="font-semibold mb-3 text-slon-blue flex items-center text-sm sm:text-base">
                <i data-lucide="${data.highlight.icon}" class="w-4 h-4 sm:w-5 sm:h-5 mr-2"></i>
                ${data.highlight.title}
            </h4>
        </div>
    ` : '';

    scroll.innerHTML = `
        <div class="p-4 sm:p-6 pt-14 sm:pt-16">
            <div class="flex items-center gap-3 mb-4 flex-wrap">
                ${badgeHtml}
                ${data.badge ? '<span class="text-gray-500">•</span>' : ''}
                <span class="text-slon-blue font-semibold text-sm">${data.model}</span>
            </div>

            <h2 class="text-xl sm:text-3xl font-bold text-white mb-2">${data.title}</h2>
            <p class="text-base sm:text-xl text-gray-400 mb-4">${data.subtitle}</p>
            <div class="text-xl sm:text-3xl font-bold text-slon-blue mb-6">${data.price}</div>

            <div class="mb-6 flex items-center justify-center relative">
                <img src="${data.image}" alt="${data.title}"
                    class="w-full h-auto max-h-[200px] sm:max-h-[320px] object-contain drop-shadow-2xl relative z-10">
                <div class="absolute bottom-[5%] left-1/2 -translate-x-1/2 w-[80%] h-[80px] bg-gradient-to-b from-slon-blue/60 via-slon-blue/25 to-transparent blur-3xl rounded-full opacity-70 pointer-events-none"></div>
            </div>

            <p class="text-gray-300 text-sm sm:text-base mb-6 leading-relaxed">${data.description}</p>

            <div class="grid grid-cols-2 gap-3 sm:gap-4 mb-6">
                ${specsHtml}
            </div>

            ${highlightBlock}

            <ul class="space-y-3 mb-8">
                ${featuresHtml}
            </ul>

            <a href="tel:+79137871232"
                class="w-full px-6 sm:px-8 py-3 sm:py-4 glass-button text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-slon-blue/25 btn-primary text-center flex items-center justify-center gap-2 text-sm sm:text-base">
                <i data-lucide="phone" class="w-4 h-4 sm:w-5 sm:h-5"></i> Позвонить
            </a>
        </div>
    `;

    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    scroll.scrollTop = 0;

    requestAnimationFrame(() => {
        content.classList.remove('translate-y-full', 'sm:scale-95');
    });

    setTimeout(() => lucide.createIcons(), 50);
}

function closeModelModal() {
    const modal = document.getElementById('model-modal');
    const content = document.getElementById('model-content');
    const scroll = document.getElementById('model-scroll');

    content.classList.add('translate-y-full', 'sm:scale-95');

    setTimeout(() => {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
        scroll.innerHTML = '';
    }, 300);
}

document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModelModal();
});