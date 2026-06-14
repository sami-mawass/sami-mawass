/* main.js — minimal vanilla JS for nav + scroll-reveal + chart animation */

/* Scroll reveal */
(function () {
  const els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    els.forEach(el => el.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => io.observe(el));

  /* Fallback: if nothing revealed after 800ms (e.g. iframe sandbox), reveal all */
  setTimeout(() => {
    if (!document.querySelector('.reveal.in')) {
      els.forEach(el => el.classList.add('in'));
    }
  }, 800);
})();

/* Hero chart — draw line once in view */
(function () {
  const line = document.querySelector('.chart-line');
  if (!line) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    line.classList.add('drawn');
    return;
  }
  const io = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      line.classList.add('drawn');
      io.disconnect();
    }
  }, { threshold: 0.3 });
  io.observe(line.closest('svg') || line);
})();

/* Nav — mobile burger */
(function () {
  const burger = document.getElementById('nav-burger');
  const menu   = document.getElementById('mobile-menu');
  if (!burger || !menu) return;

  function closeMobileMenu() {
    menu.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-hidden', 'true');
  }

  burger.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
    menu.setAttribute('aria-hidden', !open);
  });

  /* Close when any link inside mobile menu is clicked */
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  /* Escape key closes mobile menu */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('open')) {
      closeMobileMenu();
      burger.focus();
    }
  });
})();

/* Nav — Portfolio dropdown (click to toggle) */
(function () {
  const btn  = document.getElementById('port-drop-btn');
  const drop = document.getElementById('port-dropdown');
  if (!btn || !drop) return;

  function closeDropdown() {
    drop.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
  }

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = drop.classList.toggle('open');
    btn.setAttribute('aria-expanded', open);
  });

  document.addEventListener('click', closeDropdown);

  drop.addEventListener('click', e => e.stopPropagation());

  /* Escape key closes dropdown and returns focus to toggle button */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drop.classList.contains('open')) {
      closeDropdown();
      btn.focus();
    }
  });
})();

/* Copy email to clipboard */
(function () {
  const btn = document.getElementById('copy-email-btn');
  if (!btn) return;
  if (!navigator.clipboard) { btn.hidden = true; return; }

  btn.addEventListener('click', () => {
    navigator.clipboard.writeText('sami.mawass@outlook.com').then(() => {
      const orig = btn.textContent;
      btn.textContent = 'Copied';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = orig;
        btn.disabled = false;
      }, 2000);
    }).catch(() => {});
  });
})();
