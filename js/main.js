/**
 * DSRVM Limited — main.js
 * Navigation, scroll animations, anchor scroll, section-aware active state, cookies.
 *
 * Fix summary (v3):
 *  - Smooth scroll works for BOTH href="#id" AND href="index.html#id" (cross-page anchor)
 *  - "How We Work" nav link only highlights when #process section is in view (IntersectionObserver)
 *  - Page-load active state: respects hash in URL; anchor-only links never highlighted on plain page load
 *  - Bootstrap navbar collapse close on link-click (mobile)
 */

(function () {
  'use strict';

  var NAV_HEIGHT = 72; // matches --nav-height CSS var

  /* ══════════════════════════════════════════════════════════════════════════
     1. MOBILE MENU (custom, not Bootstrap collapse — keeps existing design)
  ══════════════════════════════════════════════════════════════════════════ */
  var menuToggle = document.getElementById('mobileMenuToggle');
  var navLinks   = document.getElementById('navLinks');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', function () {
      var isOpen = navLinks.classList.toggle('active');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      menuToggle.classList.toggle('open', isOpen);
    });

    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.classList.remove('open');
      });
    });

    document.addEventListener('click', function (e) {
      if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
        navLinks.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.classList.remove('open');
      }
    });
  }

  /* ══════════════════════════════════════════════════════════════════════════
     2. NAVBAR SHADOW ON SCROLL
  ══════════════════════════════════════════════════════════════════════════ */
  var navbar = document.querySelector('nav');

  if (navbar) {
    function updateNavbar() {
      if (window.pageYOffset > 80) {
        navbar.style.boxShadow = '0 4px 20px rgba(10,22,40,.10)';
        navbar.style.background = 'rgba(255,248,240,.98)';
      } else {
        navbar.style.boxShadow = 'none';
        navbar.style.background = 'rgba(255,248,240,.96)';
      }
    }
    window.addEventListener('scroll', updateNavbar, { passive: true });
    updateNavbar();
  }

  /* ══════════════════════════════════════════════════════════════════════════
     3. SCROLL-REVEAL ANIMATIONS
  ══════════════════════════════════════════════════════════════════════════ */
  var animatedEls = document.querySelectorAll('.animate-on-scroll');

  if (animatedEls.length > 0 && 'IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var siblings = entry.target.parentElement
            ? Array.from(entry.target.parentElement.querySelectorAll('.animate-on-scroll'))
            : [];
          var idx = siblings.indexOf(entry.target);
          var delay = Math.min(idx * 80, 400);
          setTimeout(function () {
            entry.target.classList.add('visible');
          }, delay);
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

    animatedEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    animatedEls.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ══════════════════════════════════════════════════════════════════════════
     4. SMOOTH ANCHOR SCROLL
     Handles:
       • href="#id"              — plain hash links (same page)
       • href="index.html#id"   — page+hash links (same page)
     Cross-page hash links (different page) are left to the browser.
  ══════════════════════════════════════════════════════════════════════════ */
  var currentFile = window.location.pathname.split('/').pop() || 'index.html';

  function getNavOffset() {
    // Read CSS variable if available, fall back to constant
    var cssVal = getComputedStyle(document.documentElement)
                   .getPropertyValue('--nav-height');
    return parseInt(cssVal, 10) || NAV_HEIGHT;
  }

  function smoothScrollTo(hash) {
    if (!hash) return false;
    var target = document.querySelector(hash);
    if (!target) return false;
    var top = target.getBoundingClientRect().top + window.pageYOffset - getNavOffset() - 16;
    window.scrollTo({ top: top, behavior: 'smooth' });
    // Update URL hash without jumping
    history.replaceState(null, '', hash);
    return true;
  }

  document.querySelectorAll('a[href]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var href = this.getAttribute('href') || '';

      // Case A: pure hash link  #section
      if (href.startsWith('#')) {
        if (href === '#') return;
        if (smoothScrollTo(href)) e.preventDefault();
        return;
      }

      // Case B: page + hash  e.g. index.html#process
      var hashIdx = href.indexOf('#');
      if (hashIdx === -1) return; // no hash — normal link

      var filePart = href.slice(0, hashIdx).split('/').pop() || 'index.html';
      var hashPart = href.slice(hashIdx); // "#process"

      // Only intercept if we're already on that page
      if (filePart === currentFile) {
        if (smoothScrollTo(hashPart)) e.preventDefault();
      }
      // Otherwise let the browser navigate normally (it will land at the anchor)
    });
  });

  // On page load: if URL has a hash, smooth-scroll to it after a tick
  // (avoids the browser's instant jump)
  if (window.location.hash) {
    var loadHash = window.location.hash;
    history.replaceState(null, '', window.location.pathname + window.location.search);
    window.addEventListener('load', function () {
      setTimeout(function () { smoothScrollTo(loadHash); }, 150);
    });
  }

  /* ══════════════════════════════════════════════════════════════════════════
     5. ACTIVE NAV LINK — section-aware
     Rules:
       a) Links that point to a DIFFERENT page (no hash, or different file):
          highlight if the filename matches the current page.
       b) Links that are same-page ANCHORS (href="#id" or "thispage.html#id"):
          NEVER highlighted on page load — only when the section is in view.
       c) "How We Work" (index.html#process) only highlights when #process
          is scrolled into view on the homepage.
  ══════════════════════════════════════════════════════════════════════════ */
  var allNavLinks = document.querySelectorAll('.nav-links a');

  function clearAllActive() {
    allNavLinks.forEach(function (l) { l.classList.remove('active'); });
  }

  function setActive(selector) {
    clearAllActive();
    var el = document.querySelector('.nav-links a[href="' + selector + '"]');
    if (el) el.classList.add('active');
  }

  // --- Step A: page-level active (non-anchor links only) ---
  allNavLinks.forEach(function (link) {
    var href = link.getAttribute('href') || '';
    var hashIdx = href.indexOf('#');
    var hasHash = hashIdx !== -1;

    if (hasHash) return; // skip anchor links for page-load highlight

    var filePart = href.split('/').pop() || 'index.html';
    if (filePart === currentFile) {
      link.classList.add('active');
    }
  });

  // --- Step B: section-aware active for same-page anchor links ---
  // Map of  section-id  →  nav link href to highlight
  var SECTION_NAV_MAP = {
    'process'  : 'index.html#process',
    'services' : 'services.html',    // services section on homepage → services page link
    'about'    : 'index.html',
  };

  // Only run on the page that has these sections
  var sectionIds = Object.keys(SECTION_NAV_MAP);
  var observedSections = [];

  sectionIds.forEach(function (id) {
    var el = document.getElementById(id);
    if (el) observedSections.push({ el: el, id: id });
  });

  if (observedSections.length > 0 && 'IntersectionObserver' in window) {
    // Track which section is currently most visible
    var visibleSections = {};

    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var id = entry.target.id;
        visibleSections[id] = entry.isIntersecting;
      });

      // Find topmost visible section
      var activeId = null;
      observedSections.forEach(function (item) {
        if (visibleSections[item.id]) activeId = item.id;
      });

      if (activeId && SECTION_NAV_MAP[activeId]) {
        setActive(SECTION_NAV_MAP[activeId]);
      } else if (!activeId) {
        // No section visible — revert to page-level active
        clearAllActive();
        allNavLinks.forEach(function (link) {
          var href = link.getAttribute('href') || '';
          if (href.indexOf('#') !== -1) return;
          var filePart = href.split('/').pop() || 'index.html';
          if (filePart === currentFile) link.classList.add('active');
        });
      }
    }, {
      threshold: 0.25,
      rootMargin: '-' + getNavOffset() + 'px 0px -40% 0px'
    });

    observedSections.forEach(function (item) {
      sectionObserver.observe(item.el);
    });
  }

// Get the button
let mybutton = document.getElementById("scrollTopBtn");

// When the user scrolls down 300px from the top of the document, show the button
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
    if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
        mybutton.style.display = "block";
    } else {
        mybutton.style.display = "none";
    }
}

// When the user clicks on the button, scroll to the top of the document
mybutton.addEventListener("click", function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});
  /* ══════════════════════════════════════════════════════════════════════════
     6. COOKIE CONSENT
  ══════════════════════════════════════════════════════════════════════════ */
  var COOKIE_KEY = 'dsrvm_cookie_consent';

  function showCookieBanner() {
    if (localStorage.getItem(COOKIE_KEY)) return;
    setTimeout(function () {
      var banner = document.getElementById('cookie-banner');
      if (banner) banner.classList.add('visible');
    }, 900);
  }

  function hideBanner() {
    var banner = document.getElementById('cookie-banner');
    if (!banner) return;
    banner.style.transform = 'translateY(100%)';
    setTimeout(function () {
      if (banner.parentNode) banner.parentNode.removeChild(banner);
    }, 420);
  }

  window.acceptCookies = function () {
    localStorage.setItem(COOKIE_KEY, 'accepted');
    hideBanner();
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
    // Consent-gated analytics init (GA4, Statcounter etc.)
  }

  showCookieBanner();

})();
