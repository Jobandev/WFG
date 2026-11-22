(() => {
  const standalone = window.matchMedia('(display-mode: standalone)');
  let installPrompt;
  let installed = false;
  let prompting = false;

  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    installPrompt = event;
  });

  document.body.insertAdjacentHTML('beforeend', `
    <button class="install-app" type="button" aria-haspopup="dialog" aria-controls="install-help">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M12 3v12m-4-4 4 4 4-4M4 16v4h16v-4"/>
      </svg>
      Install app
    </button>
    <dialog id="install-help" class="install-help" aria-labelledby="install-title">
      <h3 id="install-title">Install Wolfgramm Holdings</h3>
      <p>On iPhone or iPad, open this page in Safari. Tap <strong>Share</strong>, then <strong>Add to Home Screen</strong>.</p>
      <p>On Android, open Chrome’s menu and choose <strong>Install app</strong> or <strong>Add to Home screen</strong>.</p>
      <p>On a computer, look for the install icon in Chrome or Edge’s address bar, or check the browser menu. In Safari on Mac, choose <strong>File → Add to Dock</strong>.</p>
      <p>If you opened the site inside another app, open it in your browser first.</p>
      <form method="dialog"><button type="submit" autofocus>Done</button></form>
    </dialog>
  `);

  const button = document.querySelector('.install-app');
  const help = document.querySelector('#install-help');
  const sync = () => { button.hidden = installed || standalone.matches || navigator.standalone === true; };
  sync();
  standalone.addEventListener('change', sync);
  window.addEventListener('appinstalled', () => {
    installed = true;
    installPrompt = null;
    if (help.open) help.close();
    sync();
  });

  button.addEventListener('click', async () => {
    if (prompting) return;
    if (!installPrompt) {
      help.showModal();
      return;
    }

    const prompt = installPrompt;
    installPrompt = null;
    prompting = true;
    try {
      const choice = await prompt.prompt();
      if (choice.outcome === 'accepted') {
        installed = true;
        sync();
      }
    } catch {
      if (!button.hidden) help.showModal();
    } finally {
      prompting = false;
    }
  });
})();

(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const nav = document.querySelector('.nav');
  const year = document.querySelector('#year');
  const menuButton = document.querySelector('[data-menu-toggle]');
  const navigation = document.querySelector('#navigation');
  const socialDisclosure = document.querySelector('.social-disclosure');
  const config = window.WFG_CONFIG || {};
  if (year) year.textContent = String(new Date().getFullYear());

  if (menuButton && navigation) {
    menuButton.addEventListener('click', () => {
      const open = navigation.classList.toggle('is-open');
      menuButton.setAttribute('aria-expanded', String(open));
      if (open && socialDisclosure) socialDisclosure.open = false;
    });
  }

  if (socialDisclosure) {
    socialDisclosure.addEventListener('toggle', () => {
      if (socialDisclosure.open && navigation && menuButton) {
        navigation.classList.remove('is-open');
        menuButton.setAttribute('aria-expanded', 'false');
      }
    });
    document.addEventListener('click', (event) => {
      if (!socialDisclosure.contains(event.target)) socialDisclosure.open = false;
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && socialDisclosure.open) {
        socialDisclosure.open = false;
        socialDisclosure.querySelector('summary').focus();
      }
    });
  }

  document.querySelectorAll('[data-wh-sms]').forEach((link) => {
    if (config.whatsappUrl) {
      const separator = config.whatsappUrl.includes('?') ? '&' : '?';
      const message = encodeURIComponent(link.dataset.message || 'Kia ora, I would like to start a conversation.');
      link.href = `${config.whatsappUrl}${separator}text=${message}`;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    } else {
      link.href = config.contactUrl || 'https://wgholdings.co.nz/contact/';
      link.removeAttribute('target');
      link.removeAttribute('rel');
    }
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    }), { threshold: .08 });
    document.body.classList.add('motion-ready');
    document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
  }

  let frame = 0;
  const update = () => {
    frame = 0;
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 35);
    document.documentElement.style.setProperty('--sculpture-y', reduced.matches ? '0px' : `${Math.min(window.scrollY * .06, 28)}px`);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    document.documentElement.style.setProperty('--progress', max > 0 ? Math.min(1, window.scrollY / max) : 0);
  };
  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(update);
  };
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  window.addEventListener('load', schedule);
  reduced.addEventListener('change', schedule);
  update();

  const gallery = document.querySelector('.photo-carousel');
  if (!gallery) return;
  const track = gallery.querySelector('.gallery-track');
  const originals = [...track.querySelectorAll('.gallery-item')];
  originals.forEach((photo) => {
    const copy = photo.cloneNode(true);
    copy.querySelectorAll('img').forEach((image) => { image.alt = ''; });
    copy.setAttribute('aria-hidden', 'true');
    track.appendChild(copy);
  });
  const pause = gallery.querySelector('[data-gallery="pause"]');
  let paused = reduced.matches;
  let animation = 0;
  let lastTime = 0;
  let position = track.scrollLeft;
  let dragging = false;
  const loopWidth = () => originals.length * (originals[0].getBoundingClientRect().width + parseFloat(getComputedStyle(track).gap));
  const move = (left) => {
    const width = loopWidth();
    position = ((left % width) + width) % width;
    track.scrollLeft = position;
  };
  const tick = (time) => {
    if (lastTime) {
      if (Math.abs(track.scrollLeft - position) > 2) position = track.scrollLeft;
      move(position + Math.min(time - lastTime, 50) * .032);
    }
    lastTime = time;
    animation = requestAnimationFrame(tick);
  };
  const sync = () => {
    cancelAnimationFrame(animation);
    lastTime = 0;
    pause.innerHTML = paused
      ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true"><path d="m9 6 9 6-9 6z"/></svg>'
      : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M8 5v14M16 5v14"/></svg>';
    pause.setAttribute('aria-label', paused ? 'Play photo slideshow' : 'Pause photo slideshow');
    pause.setAttribute('aria-pressed', String(paused));
    if (!paused && !dragging && !document.hidden) animation = requestAnimationFrame(tick);
  };
  const step = (direction) => move(track.scrollLeft + direction * (originals[0].getBoundingClientRect().width + parseFloat(getComputedStyle(track).gap)));
  gallery.querySelector('[data-gallery="prev"]').addEventListener('click', () => step(-1));
  gallery.querySelector('[data-gallery="next"]').addEventListener('click', () => step(1));
  pause.addEventListener('click', () => { paused = !paused; sync(); });
  track.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      step(event.key === 'ArrowRight' ? 1 : -1);
    }
  });
  track.addEventListener('pointerdown', () => { dragging = true; sync(); });
  const release = () => {
    if (dragging) {
      dragging = false;
      position = track.scrollLeft;
      sync();
    }
  };
  window.addEventListener('pointerup', release);
  window.addEventListener('pointercancel', release);
  document.addEventListener('visibilitychange', sync);
  reduced.addEventListener('change', () => {
    if (reduced.matches) paused = true;
    sync();
  });
  sync();
})();
