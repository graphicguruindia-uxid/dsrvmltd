/**
 * DSRVM Limited — structured-data.js
 * AI-driven schema markup injection — runs on every page.
 * Adds page-specific Schema.org structured data beyond the inline JSON-LD.
 *
 * Schemas injected:
 *   - Organization (all pages, enhanced)
 *   - WebSite + SearchAction (all pages)
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
            "name": "UX & UI Design Consulting",
            "url": BASE_URL + "/services.html#ux-ui"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Branding for CMS & Enterprise Apps",
            "url": BASE_URL + "/services.html#branding"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "CMS Migration & ITSM L2/L3 Support",
            "url": BASE_URL + "/services.html#cms-migration"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Enterprise Application Consulting",
            "url": BASE_URL + "/services.html#enterprise-apps"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "HR Automation",
            "url": BASE_URL + "/services.html#hr-automation"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "AI Resource & Expertise Advisory",
            "url": BASE_URL + "/services.html#ai-advisory"
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
    'careerforge-ai.html': [['Home', '/'], ['Services', '/services.html'], ['CareerForge AI', '/careerforge-ai.html']],
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
        name: "UX & UI Design Consulting",
        desc: "User-centred interface design, wireframing, prototyping, design systems and accessibility-first component libraries for CMS and enterprise applications.",
        url: "/services.html#ux-ui",
        keywords: ["UX design UK", "UI design consulting", "Figma design system", "WCAG accessibility", "CMS UI"]
      },
      {
        name: "Branding for CMS & Enterprise Apps",
        desc: "Brand application to AEM, SharePoint, Sitecore and OpenCMS including digital brand guidelines, component-level implementation and design-to-dev handover.",
        url: "/services.html#branding",
        keywords: ["branding CMS", "AEM branding", "SharePoint theming", "Sitecore branding", "brand governance"]
      },
      {
        name: "CMS Migration & ITSM L2/L3 Support",
        desc: "End-to-end CMS migration consulting with embedded ITSM L2/L3 support for AEM, SharePoint, Sitecore and OpenCMS — from planning through post-go-live stabilisation.",
        url: "/services.html#cms-migration",
        keywords: ["CMS migration UK", "AEM migration", "SharePoint migration", "Sitecore migration", "ITSM L2 L3"]
      },
      {
        name: "Enterprise Application Consulting",
        desc: "Requirements definition, technical architecture, agile delivery governance and AI-driven resource management for complex enterprise application builds.",
        url: "/services.html#enterprise-apps",
        keywords: ["enterprise app consulting", "agile governance", "Azure DevOps", "AI resource planning"]
      },
      {
        name: "HR Automation",
        desc: "AI-powered HR automation covering candidate intake, resume parsing and skills-gap analysis, AI screening with human review, and privacy-first GDPR-aware processing with a full audit trail.",
        url: "/services.html#hr-automation",
        keywords: ["HR automation AI", "resume parsing UK", "AI candidate screening", "human review", "GDPR HR automation"]
      },
      {
        name: "AI Resource & Expertise Advisory",
        desc: "AI readiness assessment, skills gap analysis, expert advisor pairing and flexible engagement models from scoping through to live delivery.",
        url: "/services.html#ai-advisory",
        keywords: ["AI readiness", "skills gap analysis", "resource planning", "SaaS transformation", "AI advisory"]
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

  /* ── CareerForge AI page: SoftwareApplication schema ───────────────── */
  if (page === 'careerforge-ai.html') {
    injectSchema({
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "CareerForge AI",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web",
      "description": "DSRVM's candidate-facing AI career assistant: resume parsing, UK role gap analysis, ATS compliance, and CV, cover letter and LinkedIn generation against 15 UK role benchmarks — offline by default and privacy-first.",
      "provider": {
        "@type": "Organization",
        "name": "DSRVM Limited",
        "url": BASE_URL
      },
      "url": BASE_URL + "/careerforge-ai.html",
      "featureList": [
        "Resume parsing",
        "UK role gap analysis",
        "ATS compliance checking",
        "CV generation",
        "Cover letter generation",
        "LinkedIn profile drafting",
        "Boolean job-search strings",
        "Job matching against 15 UK role benchmarks",
        "Privacy-first, offline by default",
        "Pluggable AI gateway"
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
