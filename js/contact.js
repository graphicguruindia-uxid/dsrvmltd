/**
 * DSRVM Limited — contact.js
 * Contact form — validates, then sends to info@dsrvmltd.co.uk via EmailJS
 *
 * ══════════════════════════════════════════════════════════════════════════════
 *  ONE-TIME SETUP  (~10 minutes, free up to 200 emails/month)
 * ══════════════════════════════════════════════════════════════════════════════
 *
 *  STEP 1 — Create a free EmailJS account
 *    → https://www.emailjs.com  → Sign Up
 *
 *  STEP 2 — Connect your email service
 *    Dashboard → Email Services → Add Service
 *    Choose "Microsoft Outlook" (or Gmail / Outlook 365)
 *    Sign in with info@dsrvmltd.co.uk
 *    Copy the Service ID  →  paste as EMAILJS_SERVICE_ID in CONFIG below
 *
 *  STEP 3 — Create an email template
 *    Dashboard → Email Templates → Create New
 *    Name it "dsrvm_contact"
 *
 *    ⚠️  CRITICAL — In the template Settings panel set these three fields:
 *        To Email  →  info@graphicguru.in        ← TYPE THIS DIRECTLY, do not use {{to_email}}
 *        Reply To  →  {{reply_to}}
 *        Subject   →  New Enquiry — {{sender_name}} ({{service}})
 *
 *    Paste this into the template body:
 *    ─────────────────────────────────────────────────────────────
 *    New website enquiry received on {{submitted_at}}
 *
 *    CONTACT DETAILS
 *    Name:      {{sender_name}}
 *    Email:     {{sender_email}}
 *    Phone:     {{sender_phone}}
 *    Company:   {{sender_company}}
 *
 *    ENQUIRY
 *    Service:   {{service}}
 *    Budget:    {{budget}}
 *    Found via: {{how_found}}
 *
 *    MESSAGE
 *    {{message}}
 *
 *    Marketing consent: {{marketing_consent}}
 *    GDPR consent:      Yes (required field)
 *    ─────────────────────────────────────────────────────────────
 *
 *    Save → copy the Template ID  →  paste as templateId in CONFIG below
 *
 *  STEP 4 — Get your Public Key
 *    Dashboard → Account → General → Public Key
 *    Paste as publicKey in CONFIG below
 *
 *  STEP 5 — Save this file and upload to your server. Done.
 *
 * ══════════════════════════════════════════════════════════════════════════════
 */

(function () {
  'use strict';

  /* ── ⚙️  CONFIGURATION — replace all three values before going live ─────────
   *
   *  Find these in your EmailJS dashboard at https://dashboard.emailjs.com
   *
   * ─────────────────────────────────────────────────────────────────────────── */
  const CONFIG = {
    serviceId  : 'service_bv7g4ii',    // Email Services tab  → e.g. 'service_a1b2c3'
    templateId : 'template_lmk9hxf',   // Email Templates tab → e.g. 'template_x9y8z7'
    publicKey  : 'QoWEg0tVFOyrwjeAN',    // Account → General   → e.g. 'AbCdEfGhIjKlMnOp'
    toEmail    : 'info@dsrvmltd.co.uk',
  };

  /* ── DOM ──────────────────────────────────────────────────────────────────── */
  const form       = document.getElementById('contactForm');
  const successBox = document.getElementById('formSuccess');
  const errorBox   = document.getElementById('formError');
  const submitBtn  = form ? form.querySelector('.submit-btn') : null;

  if (!form) return;

  /* ── Validation rules ─────────────────────────────────────────────────────── */
  const RULES = {
    firstName  : { test: v      => v.trim().length >= 1,
                   msg: 'Please enter your first name.' },
    lastName   : { test: v      => v.trim().length >= 1,
                   msg: 'Please enter your last name.' },
    email      : { test: v      => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
                   msg: 'Please enter a valid email address.' },
    service    : { test: v      => v !== '',
                   msg: 'Please select a service area.' },
    message    : { test: v      => v.trim().length >= 20,
                   msg: 'Please describe your project (at least 20 characters).' },
    gdprConsent: { test: (v,el) => el.checked,
                   msg: 'You must accept the privacy policy consent to submit.' },
  };

  const f = name => form.querySelector(`[name="${name}"]`);

  /* ── Inline error helpers ─────────────────────────────────────────────────── */
  function markError(el, msg) {
    clearMark(el);
    el.style.borderColor = '#DC2626';
    el.setAttribute('aria-invalid', 'true');
    const wrap = el.closest('.form-group') || el.parentElement;
    const span = document.createElement('span');
    span.className = 'field-error';
    span.setAttribute('role', 'alert');
    span.style.cssText = 'display:block;color:#DC2626;font-size:.78rem;margin-top:.35rem;';
    span.textContent = msg;
    wrap.appendChild(span);
  }

  function markOk(el) {
    clearMark(el);
    el.style.borderColor = '#16A34A';
    el.setAttribute('aria-invalid', 'false');
  }

  function clearMark(el) {
    el.style.borderColor = '';
    el.removeAttribute('aria-invalid');
    const wrap = el.closest('.form-group') || el.parentElement;
    const existing = wrap.querySelector('.field-error');
    if (existing) existing.remove();
  }

  function validateField(name, el) {
    const rule = RULES[name];
    if (!rule) return true;
    const ok = rule.test(el.value, el);
    ok ? markOk(el) : markError(el, rule.msg);
    return ok;
  }

  /* ── Live validation (blur + re-check on input after first error) ─────────── */
  Object.keys(RULES).forEach(name => {
    const el = f(name);
    if (!el) return;
    el.addEventListener('blur',  () => validateField(name, el));
    el.addEventListener('input', () => {
      if (el.getAttribute('aria-invalid') === 'true') validateField(name, el);
    });
    if (el.type === 'checkbox') {
      el.addEventListener('change', () => validateField(name, el));
    }
  });

  /* ── Character counter on message textarea ────────────────────────────────── */
  const msgEl = f('message');
  if (msgEl) {
    msgEl.setAttribute('maxlength', '1000');
    const counter = document.createElement('span');
    counter.setAttribute('aria-live', 'polite');
    counter.style.cssText = 'display:block;font-size:.75rem;color:var(--color-slate-light);text-align:right;margin-top:.35rem;';
    counter.textContent = '0 / 1000';
    (msgEl.closest('.form-group') || msgEl.parentElement).appendChild(counter);
    msgEl.addEventListener('input', () => {
      const n = msgEl.value.length;
      counter.textContent = n + ' / 1000';
      counter.style.color = n > 900 ? '#DC2626' : 'var(--color-slate-light)';
    });
  }

  /* ── Phone sanitiser ──────────────────────────────────────────────────────── */
  const phoneEl = f('phone');
  if (phoneEl) {
    phoneEl.addEventListener('input', () => {
      phoneEl.value = phoneEl.value.replace(/[^\d\s+\-()/]/g, '');
    });
  }

  /* ── Submit handler ───────────────────────────────────────────────────────── */
  form.addEventListener('submit', onSubmit);

  function onSubmit(e) {
    e.preventDefault();
    hideStatus();

    // Run all validators
    let valid = true;
    Object.keys(RULES).forEach(name => {
      const el = f(name);
      if (el && !validateField(name, el)) valid = false;
    });

    if (!valid) {
      const first = form.querySelector('[aria-invalid="true"]');
      if (first) {
        first.scrollIntoView({ behavior: 'smooth', block: 'center' });
        first.focus();
      }
      return;
    }

    // Warn if EmailJS not configured (development guard)
    if (CONFIG.serviceId  === 'YOUR_SERVICE_ID'  ||
        CONFIG.templateId === 'YOUR_TEMPLATE_ID' ||
        CONFIG.publicKey  === 'YOUR_PUBLIC_KEY') {
      console.warn(
        '[DSRVM] EmailJS not configured.\n' +
        'Open js/contact.js and set CONFIG.serviceId, CONFIG.templateId, CONFIG.publicKey.\n' +
        'Full instructions are at the top of the file.'
      );
      showError({ text: 'Email delivery not configured — see browser console for setup.' });
      return;
    }

    setLoading(true);

    // Build template variables — each {{key}} maps to an EmailJS template placeholder
    // NOTE: recipient address is set in the EmailJS dashboard template, not here.
    var now    = new Date();
    var params = {
      reply_to         : f('email').value.trim(),

      sender_name      : f('firstName').value.trim() + ' ' + f('lastName').value.trim(),
      sender_email     : f('email').value.trim(),
      sender_phone     : (f('phone')   && f('phone').value.trim())   || 'Not provided',
      sender_company   : (f('company') && f('company').value.trim()) || 'Not provided',

      service          : getLabel(f('service'),   serviceLabels),
      budget           : getLabel(f('budget'),    budgetLabels),
      message          : f('message').value.trim(),
      how_found        : getLabel(f('howFound'),  howFoundLabels),

      marketing_consent: (f('marketingConsent') && f('marketingConsent').checked) ? 'Yes' : 'No',
      submitted_at     : now.toLocaleString('en-GB', {
        dateStyle: 'long', timeStyle: 'short', timeZone: 'Europe/London',
      }),
    };

    // Initialise EmailJS with public key then send
    emailjs.init({ publicKey: CONFIG.publicKey });

    emailjs.send(CONFIG.serviceId, CONFIG.templateId, params)
      .then(function () {
        setLoading(false);
        showSuccess();
      })
      .catch(function (err) {
        console.error('[DSRVM contact form] EmailJS error:', err);
        setLoading(false);
        showError(err);
      });
  }

  /* ── UI helpers ───────────────────────────────────────────────────────────── */
  function setLoading(on) {
    if (!submitBtn) return;
    submitBtn.disabled      = on;
    submitBtn.textContent   = on ? 'Sending…' : 'Send Message →';
    submitBtn.style.opacity = on ? '0.7' : '1';
    submitBtn.style.cursor  = on ? 'not-allowed' : 'pointer';
  }

  function hideStatus() {
    if (successBox) successBox.style.display = 'none';
    if (errorBox)   errorBox.style.display   = 'none';
  }

  function showSuccess() {
    form.style.display = 'none';
    if (successBox) {
      successBox.style.display = 'block';
      successBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  function showError(err) {
    if (!errorBox) return;
    errorBox.style.display = 'block';
    var detail = errorBox.querySelector('.error-detail');
    if (detail) {
      detail.textContent = err && err.text
        ? 'Technical detail: ' + err.text
        : 'Please try again or use one of the direct contact options above.';
    }
    errorBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  /* ── Label formatters ─────────────────────────────────────────────────────── */
  function getLabel(el, map) {
    if (!el) return 'Not specified';
    return map[el.value] || el.value || 'Not specified';
  }

  var serviceLabels = {
    'hr-automation': 'HR Automation & HRIS Implementation',
    'web-services' : 'Web Services & Digital Solutions',
    'operational'  : 'Operational Management & ITSM',
    'recruitment'  : 'Executive Recruitment',
    'consultation' : 'General IT Consultation',
    'other'        : 'Other / Not Sure Yet',
  };

  var budgetLabels = {
    'under-5k' : 'Under £5,000',
    '5k-15k'   : '£5,000 – £15,000',
    '15k-50k'  : '£15,000 – £50,000',
    '50k-plus' : '£50,000+',
    'retainer' : 'Monthly Retainer',
    'tbd'      : 'To Be Discussed',
  };

  var howFoundLabels = {
    'linkedin' : 'LinkedIn',
    'google'   : 'Google Search',
    'referral' : 'Referral',
    'other'    : 'Other',
  };

})();