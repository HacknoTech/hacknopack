document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('header');

  // Header starts transparent and gains the reference site's highlighted glass bar on scroll.
  const updateHeader = () => {
    if (!header) return;
    const scrolled = window.scrollY > 36;
    header.classList.toggle('site-header-scrolled', scrolled);
    header.classList.toggle('site-header-top', !scrolled);
  };
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });
  window.addEventListener('resize', updateHeader, { passive: true });

  // Accessible mobile menu.
  const menuButton = header?.querySelector('button[aria-label="Open menu"], button[aria-label="Close menu"]');
  const menuPanel = header ? Array.from(header.children).find(el => el.classList.contains('md:hidden') && el.querySelector('a')) : null;
  if (menuPanel && menuButton) {
    menuPanel.classList.add('site-mobile-menu');
    menuPanel.hidden = true;
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.addEventListener('click', () => {
      const open = menuPanel.hidden;
      menuPanel.hidden = !open;
      menuButton.setAttribute('aria-expanded', String(open));
      menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      document.body.classList.toggle('mobile-menu-open', open);
    });
    menuPanel.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      menuPanel.hidden = true;
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Open menu');
      document.body.classList.remove('mobile-menu-open');
    }));
  }

  // Active page navigation.
  const current = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('header nav a').forEach(link => {
    const href = (link.getAttribute('href') || '').split('#')[0];
    if (href && href.split('/').pop() === current) {
      link.classList.add('site-nav-current');
      link.setAttribute('aria-current', 'page');
    }
  });

  // PRODUCT CATALOGUE FILTERS — target the six real product cards, not the
  // content-list wrapper (which uses display:contents in the captured markup).
  const filterNav = document.querySelector('nav[aria-label="Browse by category"]');
  if (filterNav) {
    const filters = Array.from(filterNav.querySelectorAll(':scope > span'));
    const cards = Array.from(document.querySelectorAll('[data-dev-content-list="products"][data-dev-item-id]'));
    const normalize = value => (value || '').replace(/\s+/g, ' ').trim().toLowerCase();
    const categoryFor = card => normalize(card.querySelector('[data-dev-content-key$=".category"]')?.textContent);
    const filterFor = label => {
      const value = normalize(label);
      if (value === 'all') return 'all';
      if (value === 'wall types') return 'wall types';
      return value;
    };

    // If the expected card markup is missing, leave the controls visible but
    // don't attach a misleading interaction that hides the whole catalogue.
    if (filters.length && cards.length) {
      filters.forEach((filter, index) => {
        const label = filter.textContent;
        filter.dataset.filter = filterFor(label);
        filter.setAttribute('role', 'button');
        filter.setAttribute('tabindex', '0');
        filter.setAttribute('aria-pressed', 'false');
        filter.setAttribute('aria-label', `Show ${normalize(label) === 'all' ? 'all products' : label} products`);
        filter.classList.add('site-filter-button');
        filter.classList.remove('cursor-default');
      });

      const applyFilter = selected => {
        let visibleCount = 0;
        cards.forEach(card => {
          const category = categoryFor(card);
          const show = selected === 'all' || category === selected;
          card.hidden = !show;
          card.setAttribute('aria-hidden', String(!show));
          if (show) visibleCount += 1;
        });
        filters.forEach(filter => {
          const active = filter.dataset.filter === selected;
          filter.classList.toggle('site-filter-active', active);
          filter.setAttribute('aria-pressed', String(active));
        });
        filterNav.dataset.activeFilter = selected;
        filterNav.setAttribute('aria-label', `Browse by category. ${visibleCount} products shown.`);
      };

      filters.forEach(filter => {
        filter.addEventListener('click', () => applyFilter(filter.dataset.filter));
        filter.addEventListener('keydown', event => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            applyFilter(filter.dataset.filter);
          }
        });
      });
      applyFilter('all');
    }
  }

  // Scroll reveal, excluding cards which may be hidden by the catalogue filter.
  const revealTargets = document.querySelectorAll('main section, main article, main [data-reveal]');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver((entries, obs) => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); obs.unobserve(entry.target); }
    }), { threshold: 0.1, rootMargin: '0px 0px -35px 0px' });
    revealTargets.forEach((el, i) => {
      if (el.getBoundingClientRect().top > window.innerHeight * 0.9) {
        el.classList.add('scroll-reveal');
        el.style.setProperty('--reveal-delay', `${(i % 4) * 65}ms`);
        observer.observe(el);
      }
    });
  }

  // Keep native cursor visible and give every interactive control a pointer cursor.
  document.querySelectorAll('a, button, [role="button"], input[type="submit"], .site-filter-button').forEach(el => {
    el.style.cursor = 'pointer';
  });

  // Optional custom orange cursor ring on desktop; native cursor remains visible for clarity.
  if (window.matchMedia('(pointer:fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const cursor = document.createElement('span');
    cursor.className = 'site-cursor-ring';
    cursor.setAttribute('aria-hidden', 'true');
    document.body.appendChild(cursor);
    window.addEventListener('pointermove', e => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
      cursor.classList.add('is-visible');
    }, { passive: true });
    document.addEventListener('pointerover', e => {
      if (e.target.closest('a,button,[role="button"],input,select,textarea')) cursor.classList.add('is-hovering');
    });
    document.addEventListener('pointerout', e => {
      if (e.target.closest('a,button,[role="button"],input,select,textarea')) cursor.classList.remove('is-hovering');
    });
  }

  // Smooth in-page anchors.
  document.querySelectorAll('a[href^="#"]').forEach(link => link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  }));
});
