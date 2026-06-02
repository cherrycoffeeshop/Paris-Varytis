/**
 * Paris Varytis — PhD in Theoretical Physics
 * Vanilla JS: language toggle (EL/EN) · mobile nav · active-link on scroll ·
 * scroll-reveal · contact→mailto compose · copyright year.
 * No dependencies. Works from file:// and from GitHub Pages root.
 */
(function () {
    'use strict';

    var $  = function (sel, ctx) { return (ctx || document).querySelector(sel); };
    var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

    var LANG_KEY = 'pv_lang';
    var root = document.documentElement;

    function store(key, val) { try { localStorage.setItem(key, val); } catch (e) {} }
    function read(key) { try { return localStorage.getItem(key); } catch (e) { return null; } }

    // ---------- Language ----------
    function applyLang(lang) {
        if (lang !== 'en') { lang = 'el'; }
        root.setAttribute('data-lang', lang);
        root.setAttribute('lang', lang);

        // Placeholders
        $$('[data-ph-el]').forEach(function (el) {
            el.setAttribute('placeholder', lang === 'el' ? el.getAttribute('data-ph-el') : el.getAttribute('data-ph-en'));
        });
        // Select options
        $$('option[data-el]').forEach(function (op) {
            op.textContent = lang === 'el' ? op.getAttribute('data-el') : op.getAttribute('data-en');
        });
        // Toggle buttons: reflect state for assistive tech
        $$('.lang-toggle').forEach(function (btn) {
            btn.setAttribute('aria-pressed', lang === 'en' ? 'true' : 'false');
        });
    }

    function initLanguage() {
        var stored = read(LANG_KEY);
        applyLang(stored === 'en' ? 'en' : 'el');

        $$('.lang-toggle').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var next = root.getAttribute('data-lang') === 'el' ? 'en' : 'el';
                applyLang(next);
                store(LANG_KEY, next);
            });
        });
    }

    // ---------- Navigation ----------
    function initNav() {
        var toggle = $('.nav-toggle');
        var links = $('.nav-links');
        if (toggle && links) {
            var close = function () {
                toggle.setAttribute('aria-expanded', 'false');
                links.classList.remove('open');
            };
            toggle.addEventListener('click', function () {
                var open = toggle.getAttribute('aria-expanded') === 'true';
                toggle.setAttribute('aria-expanded', String(!open));
                links.classList.toggle('open', !open);
            });
            $$('.nav-link', links).forEach(function (l) { l.addEventListener('click', close); });
            document.addEventListener('click', function (e) {
                if (!e.target.closest('.navbar')) { close(); }
            });
            document.addEventListener('keydown', function (e) {
                if (e.key === 'Escape') { close(); }
            });
        }

        // Active link on scroll
        var navLinks = $$('.nav-link');
        var sections = $$('main section[id]');
        if (!('IntersectionObserver' in window) || !sections.length) { return; }
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) { return; }
                var id = entry.target.id;
                navLinks.forEach(function (l) {
                    l.classList.toggle('active', l.getAttribute('href') === '#' + id);
                });
            });
        }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
        sections.forEach(function (s) { io.observe(s); });
    }

    // ---------- Scroll reveal ----------
    function initReveal() {
        var items = $$('[data-reveal]');
        if (!items.length) { return; }
        var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduce || !('IntersectionObserver' in window)) {
            items.forEach(function (el) { el.classList.add('is-visible'); });
            return;
        }
        var io = new IntersectionObserver(function (entries, obs) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    obs.unobserve(entry.target);
                }
            });
        }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
        items.forEach(function (el) { io.observe(el); });
    }

    // ---------- Contact → mailto ----------
    function initContactForm() {
        var form = $('.contact-form');
        if (!form) { return; }
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var lang = root.getAttribute('data-lang') === 'en' ? 'en' : 'el';
            var name = ($('#cf-name', form).value || '').trim();
            var email = ($('#cf-email', form).value || '').trim();
            var message = ($('#cf-message', form).value || '').trim();

            if (!name) { $('#cf-name', form).focus(); return; }
            if (!email || email.indexOf('@') === -1) { $('#cf-email', form).focus(); return; }

            var to = form.getAttribute('data-email') || '';
            var subjLine = (lang === 'el' ? 'Μήνυμα από την ιστοσελίδα — ' : 'Website message — ') + name;
            var body = (lang === 'el'
                ? ['Ονοματεπώνυμο: ' + name, 'Email: ' + email, '', message]
                : ['Name: ' + name, 'Email: ' + email, '', message]
            ).join('\n');

            window.location.href = 'mailto:' + to +
                '?subject=' + encodeURIComponent(subjLine) +
                '&body=' + encodeURIComponent(body);
        });
    }

    // ---------- Photo carousel + lightbox ----------
    function initCarousel() {
        var wrap = $('.carousel');
        var lb = $('.lightbox');
        if (!wrap || !lb) { return; }

        var track   = $('.carousel-track', wrap);
        var dotsBox = $('.carousel-dots', wrap);
        var counter = $('.carousel-counter', wrap);
        var lbImg   = $('.lightbox-img', lb);
        var lbCount = $('.lightbox-counter', lb);

        var EXT = ['jpg', 'jpeg', 'webp', 'png'];
        var BASE = 'carousel/';
        var MAX = 60, MISS_STOP = 3, DELAY = 4000;
        var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        var srcs = [], cur = 0, lbOpen = false, lastFocus = null, timer = null;

        function pad(n) { return (n < 10 ? '0' : '') + n; }
        function label(i) { return 'Φωτογραφία / Photo ' + (i + 1); }

        // Try candidate filenames in order; cb(name|null) with the first that loads.
        function tryNames(cands, k, cb) {
            if (k >= cands.length) { return cb(null); }
            var im = new Image();
            im.onload  = function () { cb(cands[k]); };
            im.onerror = function () { tryNames(cands, k + 1, cb); };
            im.src = BASE + cands[k];
        }

        // Sequentially detect carousel/01.*, 02.* … preserving order; stop after MISS_STOP gaps.
        function probe(i, miss) {
            if (i > MAX) { return finish(); }
            var cands = [];
            EXT.forEach(function (e) { cands.push(pad(i) + '.' + e); });
            if (i < 10) { EXT.forEach(function (e) { cands.push(i + '.' + e); }); }
            tryNames(cands, 0, function (name) {
                if (name) { srcs.push(BASE + name); return probe(i + 1, 0); }
                if (miss + 1 >= MISS_STOP) { return finish(); }
                probe(i + 1, miss + 1);
            });
        }

        function finish() {
            if (!srcs.length) { return; }            // no images found → carousel stays hidden
            build();
            wrap.hidden = false;
            if (srcs.length === 1) { wrap.classList.add('is-single'); }
            requestAnimationFrame(function () { wrap.classList.add('is-visible'); });
        }

        function build() {
            var slidesHtml = '', dotsHtml = '';
            srcs.forEach(function (src, idx) {
                slidesHtml += '<li class="carousel-slide"><img src="' + src + '" alt="' + label(idx) +
                    '" loading="' + (idx === 0 ? 'eager' : 'lazy') + '" decoding="async"></li>';
                dotsHtml += '<button class="carousel-dot" type="button" data-idx="' + idx +
                    '" aria-label="' + label(idx) + '"></button>';
            });
            track.innerHTML = slidesHtml;
            dotsBox.innerHTML = dotsHtml;

            $$('.carousel-slide img', track).forEach(function (im, idx) {
                im.addEventListener('click', function () { openLightbox(idx); });
            });
            $$('.carousel-dot', dotsBox).forEach(function (btn) {
                btn.addEventListener('click', function () { go(parseInt(btn.getAttribute('data-idx'), 10)); restartAuto(); });
            });
            $('.carousel-prev', wrap).addEventListener('click', function () { go(cur - 1); restartAuto(); });
            $('.carousel-next', wrap).addEventListener('click', function () { go(cur + 1); restartAuto(); });
            $('.carousel-expand', wrap).addEventListener('click', function () { openLightbox(cur); });

            var vp = $('.carousel-viewport', wrap);
            addSwipe(vp);
            addSwipe(lb);
            vp.addEventListener('mouseenter', stopAuto);
            vp.addEventListener('mouseleave', startAuto);

            go(0);
            startAuto();
        }

        function go(n) {
            if (!srcs.length) { return; }
            cur = (n % srcs.length + srcs.length) % srcs.length;
            track.style.transform = 'translateX(' + (-cur * 100) + '%)';
            if (counter) { counter.textContent = (cur + 1) + ' / ' + srcs.length; }
            $$('.carousel-dot', dotsBox).forEach(function (btn, idx) {
                var on = idx === cur;
                btn.classList.toggle('is-active', on);
                if (on) { btn.setAttribute('aria-current', 'true'); } else { btn.removeAttribute('aria-current'); }
            });
            if (lbOpen) { syncLightbox(); }
        }

        // Autoplay (4s) — paused on hover, while the lightbox is open, and under reduced-motion.
        function startAuto() {
            if (reduce || lbOpen || srcs.length < 2) { return; }
            stopAuto();
            timer = setInterval(function () { if (!lbOpen) { go(cur + 1); } }, DELAY);
        }
        function stopAuto() { if (timer) { clearInterval(timer); timer = null; } }
        function restartAuto() { stopAuto(); startAuto(); }

        function syncLightbox() {
            lbImg.src = srcs[cur];
            lbImg.alt = label(cur);
            if (lbCount) { lbCount.textContent = (cur + 1) + ' / ' + srcs.length; }
        }

        function openLightbox(n) {
            lbOpen = true;
            lastFocus = document.activeElement;
            stopAuto();
            go(n);
            lb.hidden = false;
            document.body.style.overflow = 'hidden';
            var c = $('.lightbox-close', lb);
            if (c) { c.focus(); }
        }

        function closeLightbox() {
            lbOpen = false;
            lb.hidden = true;
            document.body.style.overflow = '';
            if (lastFocus && lastFocus.focus) { lastFocus.focus(); }
            startAuto();
        }

        $('.lightbox-prev', lb).addEventListener('click', function () { go(cur - 1); });
        $('.lightbox-next', lb).addEventListener('click', function () { go(cur + 1); });
        $('.lightbox-close', lb).addEventListener('click', closeLightbox);
        lb.addEventListener('click', function (e) { if (e.target === lb) { closeLightbox(); } });

        document.addEventListener('keydown', function (e) {
            if (!lbOpen) { return; }
            if (e.key === 'Escape') { closeLightbox(); }
            else if (e.key === 'ArrowLeft') { go(cur - 1); }
            else if (e.key === 'ArrowRight') { go(cur + 1); }
            else if (e.key === 'Tab') {
                var f = $$('button', lb);
                if (!f.length) { return; }
                var first = f[0], last = f[f.length - 1];
                if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
                else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
            }
        });

        function addSwipe(el) {
            if (!el || !('onpointerdown' in el)) { return; }
            var x0 = null;
            el.addEventListener('pointerdown', function (e) { x0 = e.clientX; });
            el.addEventListener('pointerup', function (e) {
                if (x0 === null) { return; }
                var dx = e.clientX - x0; x0 = null;
                if (Math.abs(dx) > 40) { go(cur + (dx < 0 ? 1 : -1)); restartAuto(); }
            });
            el.addEventListener('pointercancel', function () { x0 = null; });
        }

        probe(1, 0);
    }

    // ---------- Testimonials ticker (seamless marquee) ----------
    function initTicker() {
        var ticker = $('.ticker');
        if (!ticker) { return; }
        var track = $('.ticker-track', ticker);
        if (!track) { return; }
        if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) { return; }

        var setWidth = track.scrollWidth;            // width of the authored set, before duplicating
        $$('.ticker-item', track).forEach(function (it) {
            var clone = it.cloneNode(true);
            clone.setAttribute('aria-hidden', 'true');
            track.appendChild(clone);                // duplicate → translateX(-50%) loops seamlessly
        });
        var SPEED = 40;                              // px/sec — gentle, and constant no matter how many comments
        track.style.setProperty('--ticker-dur', Math.max(20, Math.round(setWidth / SPEED)) + 's');
        track.classList.add('is-running');
    }

    // ---------- Year ----------
    function initYear() {
        var y = $('#year');
        if (y) { y.textContent = new Date().getFullYear(); }
    }

    function init() {
        initLanguage();
        initNav();
        initReveal();
        initContactForm();
        initCarousel();
        initTicker();
        initYear();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
