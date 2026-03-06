/**
 * DSRVM Limited — main.js
 * Shared scripts: navigation, scroll animations, cookie consent
 * Applies to: all pages
 */

(function () {
  'use strict';

  /* ── Mobile Menu ──────────────────────────────────────────────────────────── */
  const menuToggle = document.getElementById('mobileMenuToggle');
  const navLinks   = document.getElementById('navLinks');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('active');
      menuToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when a link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close menu on outside click
    document.addEventListener('click', e => {
      if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
        navLinks.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ── Navbar Shadow on Scroll ──────────────────────────────────────────────── */
  const navbar = document.querySelector('nav');

  if (navbar) {
    const updateNavbar = () => {
      if (window.pageYOffset > 80) {
        navbar.style.boxShadow = '0 4px 20px rgba(10, 22, 40, 0.1)';
        navbar.style.background = 'rgba(255, 248, 240, 0.98)';
      } else {
        navbar.style.boxShadow = 'none';
        navbar.style.background = 'rgba(255, 248, 240, 0.96)';
      }
    };

    window.addEventListener('scroll', updateNavbar, { passive: true });
    updateNavbar();
  }

  /* ── Scroll-Reveal Animations ─────────────────────────────────────────────── */
  const animatedEls = document.querySelectorAll('.animate-on-scroll');

  if (animatedEls.length > 0 && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            // Stagger sibling cards by a small delay
            const siblings = entry.target.parentElement
              ? Array.from(entry.target.parentElement.querySelectorAll('.animate-on-scroll'))
              : [];
            const idx = siblings.indexOf(entry.target);
            const delay = Math.min(idx * 80, 400);

            setTimeout(() => {
              entry.target.classList.add('visible');
            }, delay);

            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );

    animatedEls.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback: show all immediately if IntersectionObserver not supported
    animatedEls.forEach(el => el.classList.add('visible'));
  }

  /* ── Smooth Anchor Scroll (for same-page links) ───────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const navH = parseInt(getComputedStyle(document.documentElement)
          .getPropertyValue('--nav-height')) || 72;
        const top = target.getBoundingClientRect().top + window.pageYOffset - navH - 16;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ── Cookie Consent Banner ────────────────────────────────────────────────── */
  const COOKIE_KEY = 'dsrvm_cookie_consent';

  function showCookieBanner() {
    if (localStorage.getItem(COOKIE_KEY)) return;
    setTimeout(() => {
      const banner = document.getElementById('cookie-banner');
      if (banner) banner.classList.add('visible');
    }, 900);
  }

  function hideBanner() {
    const banner = document.getElementById('cookie-banner');
    if (!banner) return;
    banner.style.transform = 'translateY(100%)';
    setTimeout(() => {
      if (banner.parentNode) banner.parentNode.removeChild(banner);
    }, 420);
  }

  // Exposed globally so inline onclick handlers work
  window.acceptCookies = function () {
    localStorage.setItem(COOKIE_KEY, 'accepted');
    hideBanner();
    // Initialise any analytics that require consent here
    initAnalytics();
  };

  window.declineCookies = function () {
    localStorage.setItem(COOKIE_KEY, 'declined');
    hideBanner();
  };

  window.resetCookieConsent = function () {
    localStorage.removeItem(COOKIE_KEY);
    location.reload();
  };

  function initAnalytics() {
    // Statcounter: already embedded passively; add any consent-gated
    // analytics initialisation here in future (e.g. GA4 gtag consent mode)
  }

  showCookieBanner();

  /* ── Active Nav Link Highlight ────────────────────────────────────────────── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    const page = href.split('/').pop().split('#')[0] || 'index.html';
    if (page === currentPage) {
      link.classList.add('active');
    }
  });

})();
