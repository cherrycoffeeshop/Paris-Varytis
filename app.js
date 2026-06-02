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
        initYear();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
