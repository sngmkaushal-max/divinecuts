/* Divine Cuts — minimal front-end behaviour (no jQuery, no dependencies). */
(function () {
  'use strict';

  var nav = document.getElementById('dc-primary-nav');
  var burger = document.querySelector('.dc-burger');
  var closeBtn = document.querySelector('.dc-nav__close');
  var scrim = null;

  function openNav() {
    if (!nav) return;
    nav.classList.add('is-open');
    burger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    scrim = document.createElement('button');
    scrim.className = 'dc-scrim';
    scrim.setAttribute('aria-label', 'Close menu');
    scrim.addEventListener('click', closeNav);
    nav.parentNode.appendChild(scrim); /* inside the header, so it sits under the drawer */
    var first = nav.querySelector('a, button');
    if (first) first.focus();
  }

  function closeNav() {
    if (!nav) return;
    nav.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    if (scrim) { scrim.remove(); scrim = null; }
    burger.focus();
  }

  if (burger && nav) {
    burger.addEventListener('click', function () {
      nav.classList.contains('is-open') ? closeNav() : openNav();
    });
  }
  if (closeBtn) closeBtn.addEventListener('click', closeNav);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav && nav.classList.contains('is-open')) closeNav();
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth >= 1080 && nav && nav.classList.contains('is-open')) closeNav();
  });

  /* Pre-fill the enquiry form when a visitor arrives from a product page. */
  var params = new URLSearchParams(window.location.search);
  var product = params.get('product');
  if (product) {
    var field = document.getElementById('dc-product-required');
    if (field) field.value = product.replace(/[<>]/g, '');
  }

  /* Keep the "Product required" select in step with a free-text override. */
  var select = document.getElementById('dc-product-select');
  var other = document.getElementById('dc-product-required');
  if (select && other) {
    select.addEventListener('change', function () {
      if (select.value && select.value !== 'other') other.value = select.value;
    });
  }
})();

/* Static-site enquiry form: builds the message and opens WhatsApp or the email app. */
(function () {
  'use strict';
  var form = document.getElementById('dc-enquiry-form');
  if (!form) return;
  var WA = '917889121628';
  var TO = 'info@thedivineexport.com,sales@thedivineexport.com';
  var mode = 'whatsapp';
  form.querySelectorAll('[data-send]').forEach(function (b) {
    b.addEventListener('click', function () { mode = b.getAttribute('data-send'); });
  });
  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    if (document.getElementById('dc_website').value) return;           // honeypot
    var bad = null;
    form.querySelectorAll('[required]').forEach(function (f) {
      var ok = f.value.trim() !== '' && (f.type !== 'email' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value.trim()));
      f.setAttribute('aria-invalid', ok ? 'false' : 'true');
      if (!ok && !bad) bad = f;
    });
    if (bad) { bad.focus(); bad.reportValidity && bad.reportValidity(); return; }
    var lines = ['New enquiry — Divine Cuts website', ''];
    form.querySelectorAll('input[name], textarea[name]').forEach(function (f) {
      if (f.value.trim()) lines.push(f.name + ': ' + f.value.trim());
    });
    var text = lines.join('\n');
    var product = document.getElementById('dc-product-required').value.trim();
    var url = mode === 'email'
      ? 'mailto:' + TO + '?subject=' + encodeURIComponent('Quotation request: ' + product) + '&body=' + encodeURIComponent(text)
      : 'https://wa.me/' + WA + '?text=' + encodeURIComponent(text);
    document.getElementById('dc-sent').hidden = false;
    if (mode === 'email') { window.location.href = url; } else { window.open(url, '_blank', 'noopener'); }
  });
})();
document.querySelectorAll('[data-year]').forEach(function (n) { n.textContent = new Date().getFullYear(); });
