/* ============================================================
   Tech Skills Hub Ghana — Main JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    /* ——— Mobile Navigation ——————————————————————————————— */
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            const expanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', String(!expanded));
            navMenu.classList.toggle('open');
        });

        // Close menu when a link is clicked
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    /* ——— Sticky Header Shadow ———————————————————————————— */
    const header = document.querySelector('.site-header');
    if (header) {
        window.addEventListener('scroll', () => {
            header.style.boxShadow = window.scrollY > 20
                ? '0 4px 24px rgba(0,0,0,0.28)'
                : '0 2px 16px rgba(0,0,0,0.18)';
        }, { passive: true });
    }

    /* ——— Back to Top Button ——————————————————————————————— */
    const backToTop = document.querySelector('.back-to-top');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            backToTop.classList.toggle('visible', window.scrollY > 380);
        }, { passive: true });

        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* ——— Scroll Reveal ————————————————————————————————— */
    const revealEls = document.querySelectorAll('.reveal');

    if (revealEls.length) {
        const revealObs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    revealObs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

        revealEls.forEach(el => revealObs.observe(el));
    }

    /* ——— Animated Counters (hero stats) ———————————————— */
    const statNums = document.querySelectorAll('.stat-num[data-target]');

    if (statNums.length) {
        const countObs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    countObs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        statNums.forEach(el => countObs.observe(el));
    }

    function animateCounter(el) {
        const target = parseInt(el.dataset.target, 10);
        const suffix = el.dataset.suffix || '';
        const duration = 1800;
        const step = 16;
        const increment = target / (duration / step);
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                el.textContent = target + suffix;
                clearInterval(timer);
            } else {
                el.textContent = Math.floor(current) + suffix;
            }
        }, step);
    }

    /* ——— Active Nav Link Highlighting ————————————————— */
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-menu a').forEach(link => {
        const linkPage = link.getAttribute('href');
        if (
            linkPage === currentPage ||
            (currentPage === '' && linkPage === 'index.html') ||
            (currentPage === 'index.html' && linkPage === 'index.html')
        ) {
            link.setAttribute('aria-current', 'page');
        }
    });

    /* ——— Contact Form Handler ———————————————————————— */
    const contactForm = document.getElementById('inquiryForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const btn = contactForm.querySelector('button[type="submit"]');
            const orig = btn.textContent;
            btn.textContent = 'Sending…';
            btn.disabled = true;

            // Simulate async submission
            setTimeout(() => {
                const formEl = document.getElementById('formBody');
                const successEl = document.getElementById('formSuccess');
                if (formEl && successEl) {
                    formEl.style.display = 'none';
                    successEl.style.display = 'block';
                }
                btn.textContent = orig;
                btn.disabled = false;
            }, 1400);
        });
    }

    /* ——— Resource Filter Tabs ————————————————————————— */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const filterItems = document.querySelectorAll('[data-category]');

    if (filterBtns.length && filterItems.length) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const cat = btn.dataset.filter;
                filterItems.forEach(item => {
                    if (cat === 'all' || item.dataset.category === cat) {
                        item.style.display = '';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }

    /* ——— Skill Card Hover Tooltips (keyboard support) —— */
    document.querySelectorAll('.skill-card').forEach(card => {
        card.setAttribute('tabindex', '0');
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const link = card.querySelector('a');
                if (link) link.click();
                else card.click();
            }
        });
    });

    /* ——— Smooth internal anchor links ——————————————— */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const targetId = anchor.getAttribute('href').slice(1);
            const targetEl = document.getElementById(targetId);
            if (targetEl) {
                e.preventDefault();
                targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    /* ——— Lazy Image Shimmer (placeholder before load) — */
    document.querySelectorAll('img[data-src]').forEach(img => {
        img.classList.add('img-loading');
        const obs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    img.classList.remove('img-loading');
                    obs.unobserve(img);
                }
            });
        }, { rootMargin: '200px' });
        obs.observe(img);
    });

});
