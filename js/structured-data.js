/**
 * DSRVM Limited — structured-data.js
 * AI-driven schema markup injection — runs on every page.
 * Adds page-specific Schema.org structured data beyond the inline JSON-LD.
 *
 * Schemas injected:
 *   - Organization (all pages, enhanced)
 *   - WebSite + SearchAction (all pages)
 *   - FAQPage (pricing.html)
 *   - Service (services.html)
 *   - BreadcrumbList (all inner pages)
 *   - Person (team.html)
 */

(function () {
  'use strict';

  var BASE_URL  = 'https://www.dsrvmltd.co.uk';
  var page      = window.location.pathname.split('/').pop() || 'index.html';

  /* ── Inject helper ────────────────────────────────────────────────────── */
  function injectSchema(obj) {
    var s = document.createElement('script');
    s.type = 'application/ld+json';
    s.textContent = JSON.stringify(obj, null, 2);
    document.head.appendChild(s);
  }

  /* ── WebSite + Sitelinks Search ─────────────────────────────────────── */
  injectSchema({
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "DSRVM Limited",
    "url": BASE_URL,
    "description": "AI-Powered Digital Transformation — DSRVM Limited delivers cutting-edge AI consulting, intelligent HR automation, and enterprise web solutions for UK and global businesses.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": BASE_URL + "/case-studies.html?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  });

  /* ── Organization (enhanced) ────────────────────────────────────────── */
  injectSchema({
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "DSRVM Limited",
    "legalName": "DSRVM Limited",
    "alternateName": "Digital Solutions & Resources Vitality Management",
    "url": BASE_URL,
    "logo": {
      "@type": "ImageObject",
      "url": BASE_URL + "/images/dsrvmltd-logo.png",
      "width": 240,
      "height": 60
    },
    "image": BASE_URL + "/images/dsrvm-og-image.png",
    "description": "DSRVM Limited — Digital Solutions & Resources Vitality Management — delivers cutting-edge AI consulting, intelligent HR automation, and enterprise web solutions for UK and global businesses.",
    "foundingDate": "2004",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Southampton",
      "addressLocality": "Southampton",
      "addressRegion": "Hampshire",
      "addressCountry": "GB"
    },
    "telephone": "+447780315635",
    "email": "info@dsrvmltd.co.uk",
    "areaServed": ["GB", "Worldwide"],
    "knowsAbout": [
      "Artificial Intelligence Consulting",
      "AI Strategy & Roadmap Design",
      "Intelligent HR Automation",
      "Workday HRIS Implementation",
      "SAP SuccessFactors",
      "Oracle HCM",
      "SharePoint CMS",
      "Azure DevOps",
      "Agile Delivery",
      "ITSM / ITIL v4",
      "Digital Transformation",
      "LLM Integration",
      "Generative AI"
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "DSRVM Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "AI Strategy & Consulting",
            "url": BASE_URL + "/services.html#ai-strategy"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Intelligent HR Automation",
            "url": BASE_URL + "/services.html#hr-automation"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Web Services & Digital Solutions",
            "url": BASE_URL + "/services.html#web-services"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Operational Management & ITSM",
            "url": BASE_URL + "/services.html#operational"
          }
        }
      ]
    },
    "sameAs": [
      "https://www.linkedin.com/company/dsrvm-limited/"
    ]
  });

  /* ── BreadcrumbList (inner pages) ───────────────────────────────────── */
  var breadcrumbs = {
    'services.html':       [['Home', '/'], ['Services', '/services.html']],
    'pricing.html':        [['Home', '/'], ['Pricing',  '/pricing.html']],
    'case-studies.html':   [['Home', '/'], ['Case Studies', '/case-studies.html']],
    'team.html':           [['Home', '/'], ['Team', '/team.html']],
    'contact.html':        [['Home', '/'], ['Contact', '/contact.html']],
    'privacy-policy.html': [['Home', '/'], ['Privacy Policy', '/privacy-policy.html']],
    'terms.html':          [['Home', '/'], ['Terms & Conditions', '/terms.html']],
  };

  if (breadcrumbs[page]) {
    injectSchema({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbs[page].map(function(item, idx) {
        return {
          "@type": "ListItem",
          "position": idx + 1,
          "name": item[0],
          "item": BASE_URL + item[1]
        };
      })
    });
  }

  /* ── Services page: individual Service schemas ──────────────────────── */
  if (page === 'services.html') {
    var services = [
      {
        name: "AI Strategy & Consulting",
        desc: "Tailored AI and digital roadmap design — identifying automation opportunities, architecting LLM integrations, and delivering clear ROI projections. Quick wins in weeks, long-term transformation over months.",
        url: "/services.html#ai-strategy",
        keywords: ["AI strategy UK", "AI consulting", "LLM integration", "digital transformation roadmap"]
      },
      {
        name: "Intelligent HR Automation",
        desc: "AI-powered HR automation including HRIS implementation (Workday, SAP, Oracle), intelligent candidate screening, onboarding automation, and GDPR-compliant payroll management.",
        url: "/services.html#hr-automation",
        keywords: ["HR automation AI", "Workday implementation UK", "SAP SuccessFactors", "AI candidate screening"]
      },
      {
        name: "Web Services & Digital Solutions",
        desc: "Enterprise CMS (SharePoint, Sitecore, AEM), Azure cloud, React/Angular web apps, AI-enhanced UX, and AI-driven SEO for UK organisations.",
        url: "/services.html#web-services",
        keywords: ["SharePoint consulting UK", "Sitecore implementation", "Azure web development", "AI-enhanced CMS"]
      },
      {
        name: "Operational Management & ITSM",
        desc: "Agile transformation, ITSM/ITIL v4 implementation, ServiceNow, Azure DevOps CI/CD, and AI-driven KPI analytics — delivering 18% sprint velocity improvements.",
        url: "/services.html#operational",
        keywords: ["ITSM consulting UK", "Agile transformation", "ServiceNow AI", "DevOps consulting"]
      }
    ];

    services.forEach(function(svc) {
      injectSchema({
        "@context": "https://schema.org",
        "@type": "Service",
        "name": svc.name,
        "description": svc.desc,
        "provider": {
          "@type": "Organization",
          "name": "DSRVM Limited",
          "url": BASE_URL
        },
        "url": BASE_URL + svc.url,
        "areaServed": {
          "@type": "Place",
          "name": "United Kingdom"
        },
        "serviceType": "IT Consulting",
        "keywords": svc.keywords.join(', ')
      });
    });
  }

  /* ── Pricing page: FAQ schema ───────────────────────────────────────── */
  if (page === 'pricing.html') {
    injectSchema({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Do you offer fixed-price AI consulting projects?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. Project-based engagements are quoted as fixed-price after a free scoping session. We don't charge for discovery — the first conversation is always free."
          }
        },
        {
          "@type": "Question",
          "name": "Can I start with just an AI readiness audit?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Absolutely. Many clients start with our AI Readiness Audit (from £2,500) — a low-risk entry point that gives you a clear picture of your AI opportunities before committing to a larger engagement."
          }
        },
        {
          "@type": "Question",
          "name": "Is VAT included in the prices shown?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "All prices are exclusive of VAT. DSRVM Limited is VAT registered. A full breakdown is provided in every formal proposal."
          }
        },
        {
          "@type": "Question",
          "name": "How quickly can DSRVM start an AI project?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Depending on scope, we typically begin within 1–2 weeks of contract signature. AI readiness audits can often start within days of initial contact."
          }
        },
        {
          "@type": "Question",
          "name": "What is DSRVM's approach to AI strategy design?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "We architect a tailored AI and digital roadmap — prioritising quick wins alongside long-term transformation with clear ROI projections. This includes an AI readiness audit, opportunity identification, vendor evaluation, and a 90-day quick-win plan."
          }
        }
      ]
    });
  }

  /* ── Team page: Person schemas ──────────────────────────────────────── */
  if (page === 'team.html') {
    var people = [
      {
        name: "Vinod Dangudubiyyapu",
        jobTitle: "Founder & Senior Delivery Manager",
        description: "AI Manager Certified Delivery Leader and Agile Coach with 20+ years in SaaS, telehealth, enterprise CMS, and ITSM. Leads DSRVM's AI strategy practice.",
        knowsAbout: ["AI Strategy", "Generative AI", "Azure OpenAI", "Agile Delivery", "ServiceNow", "SharePoint", "ITIL v4", "PMP"]
      },
      {
        name: "Madhavi Dangudubiyyapu",
        jobTitle: "Co-Founder & HR Operations Director",
        description: "CIPD-qualified HR professional with 15+ years in AI-powered HR automation, HRIS implementation, and UK employment law.",
        knowsAbout: ["HR Automation", "Workday", "SAP SuccessFactors", "Oracle HCM", "GDPR", "UK Immigration", "CIPD", "PMP"]
      }
    ];

    people.forEach(function(person) {
      injectSchema({
        "@context": "https://schema.org",
        "@type": "Person",
        "name": person.name,
        "jobTitle": person.jobTitle,
        "description": person.description,
        "worksFor": {
          "@type": "Organization",
          "name": "DSRVM Limited",
          "url": BASE_URL
        },
        "url": BASE_URL + "/team.html",
        "knowsAbout": person.knowsAbout
      });
    });
  }

  /* ── Contact page: ContactPoint ─────────────────────────────────────── */
  if (page === 'contact.html') {
    injectSchema({
      "@context": "https://schema.org",
      "@type": "ContactPage",
      "name": "Contact DSRVM Limited",
      "description": "Get in touch with DSRVM Limited for AI consulting, HR automation, and digital transformation enquiries.",
      "url": BASE_URL + "/contact.html",
      "mainEntity": {
        "@type": "Organization",
        "name": "DSRVM Limited",
        "telephone": "+447780315635",
        "email": "info@dsrvmltd.co.uk",
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+447780315635",
          "contactType": "customer service",
          "areaServed": "GB",
          "availableLanguage": "English"
        }
      }
    });
  }

})();
