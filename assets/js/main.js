const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach((item) => observer.observe(item));

const menuButton = document.querySelector('.menu-button');
const nav = document.querySelector('.nav');

if (menuButton && nav) {
  menuButton.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação');
  });

  nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    nav.classList.remove('is-open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Abrir menu de navegação');
  }));

  document.addEventListener('click', (e) => {
    if (nav.classList.contains('is-open') && !nav.contains(e.target) && !menuButton.contains(e.target)) {
      nav.classList.remove('is-open');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Abrir menu de navegação');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) {
      nav.classList.remove('is-open');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Abrir menu de navegação');
    }
  });
}

let currentScrollAnimation = null;
let cancelCurrentScroll = null;

const smoothScrollTo = (targetY, duration = 900) => {
  if (cancelCurrentScroll) cancelCurrentScroll();

  const startY = window.pageYOffset || document.documentElement.scrollTop;
  const maxY = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  const distance = Math.min(maxY, Math.max(0, targetY)) - startY;
  if (Math.abs(distance) < 2) return;

  let startTime = null;

  const easeInOutCubic = (t) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  const cleanupCancelListeners = () => {
    window.removeEventListener('wheel', cancelScroll);
    window.removeEventListener('touchstart', cancelScroll);
    window.removeEventListener('pointerdown', cancelScroll);
    window.removeEventListener('keydown', cancelOnScrollKey);
    currentScrollAnimation = null;
    cancelCurrentScroll = null;
  };

  const cancelScroll = () => {
    if (currentScrollAnimation !== null) cancelAnimationFrame(currentScrollAnimation);
    cleanupCancelListeners();
  };

  const cancelOnScrollKey = (event) => {
    if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(event.key)) {
      cancelScroll();
    }
  };

  window.addEventListener('wheel', cancelScroll, { passive: true });
  window.addEventListener('touchstart', cancelScroll, { passive: true });
  window.addEventListener('pointerdown', cancelScroll, { passive: true });
  window.addEventListener('keydown', cancelOnScrollKey);
  cancelCurrentScroll = cancelScroll;

  const step = (currentTime) => {
    if (startTime === null) startTime = currentTime;
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeProgress = easeInOutCubic(progress);

    window.scrollTo({ top: startY + distance * easeProgress, behavior: 'instant' });

    if (progress < 1) {
      currentScrollAnimation = requestAnimationFrame(step);
    } else {
      cleanupCancelListeners();
    }
  };

  currentScrollAnimation = requestAnimationFrame(step);
};

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (!href || href === '#') return;

    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();

      if (nav && nav.classList.contains('is-open')) {
        nav.classList.remove('is-open');
        if (menuButton) {
          menuButton.setAttribute('aria-expanded', 'false');
          menuButton.setAttribute('aria-label', 'Abrir menu de navegação');
        }
      }

      const header = document.querySelector('.header');
      const headerOffset = (header ? header.offsetHeight : 64) + 16;
      const targetTop = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;

      smoothScrollTo(targetTop);

      if (history.pushState && window.location.hash !== href) {
        history.pushState(null, null, href);
      }
    }
  });
});

const initProjectsCarousel = () => {
  const track = document.getElementById('carousel-track');
  const prevBtn = document.getElementById('carousel-prev-btn');
  const nextBtn = document.getElementById('carousel-next-btn');
  const counter = document.getElementById('carousel-counter');
  const viewport = document.getElementById('carousel-viewport');

  if (!track || !prevBtn || !nextBtn || !viewport) return;

  const slides = track.querySelectorAll('.carousel-slide');
  const totalSlides = slides.length;
  if (!totalSlides) return;
  let currentIndex = 0;

  const syncHeight = () => {
    viewport.style.height = `${Math.ceil(slides[currentIndex].getBoundingClientRect().height)}px`;
  };

  const updateCarousel = (index) => {
    currentIndex = (index + totalSlides) % totalSlides;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    if (counter) {
      counter.textContent = `Projeto ${currentIndex + 1} de ${totalSlides}`;
    }

    slides.forEach((slide, idx) => {
      slide.inert = idx !== currentIndex;
      slide.setAttribute('aria-hidden', String(idx !== currentIndex));
    });
    syncHeight();
  };

  prevBtn.addEventListener('click', () => updateCarousel(currentIndex - 1));
  nextBtn.addEventListener('click', () => updateCarousel(currentIndex + 1));

  viewport?.addEventListener('keydown', (e) => {
    if (e.target.closest('#proto-carousel')) return;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      updateCarousel(currentIndex + (e.key === 'ArrowLeft' ? -1 : 1));
    }
  });

  let startX = 0;
  let isDragging = false;

  viewport?.addEventListener('touchstart', (e) => {
    if (e.target.closest('#proto-carousel')) return;
    startX = e.touches[0].clientX;
    isDragging = true;
  }, { passive: true });

  viewport?.addEventListener('touchend', (e) => {
    if (!isDragging) return;
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;
    if (Math.abs(diff) > 45) {
      if (diff > 0) {
        updateCarousel(currentIndex + 1);
      } else {
        updateCarousel(currentIndex - 1);
      }
    }
    isDragging = false;
  }, { passive: true });

  const slidesResizeObserver = new ResizeObserver(syncHeight);
  slides.forEach((slide) => slidesResizeObserver.observe(slide));
  document.fonts.ready.then(syncHeight);
  updateCarousel(0);
};

initProjectsCarousel();

const initProtoCarousel = () => {
  const container = document.getElementById('proto-carousel');
  if (!container) return;

  const track = document.getElementById('proto-carousel-track');
  const prevBtn = document.getElementById('proto-prev-btn');
  const nextBtn = document.getElementById('proto-next-btn');
  const counter = document.getElementById('proto-counter');
  const items = track ? track.querySelectorAll('.proto-carousel-item') : [];
  const totalItems = items.length;

  if (!track || totalItems === 0) return;

  let currentIdx = 0;

  const updateProtoCarousel = (newIdx) => {
    currentIdx = (newIdx + totalItems) % totalItems;
    items.forEach((item, index) => {
      const active = index === currentIdx;
      item.classList.toggle('active', active);
      item.inert = !active;
      item.setAttribute('aria-hidden', String(!active));
    });

    if (counter) {
      counter.textContent = `Foto ${currentIdx + 1} de ${totalItems}`;
    }

  };

  prevBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    updateProtoCarousel(currentIdx - 1);
  });

  nextBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    updateProtoCarousel(currentIdx + 1);
  });

  container.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      e.stopPropagation();
      updateProtoCarousel(currentIdx + (e.key === 'ArrowLeft' ? -1 : 1));
    }
  });

  let protoStartX = 0;
  let isProtoDragging = false;

  container.addEventListener('touchstart', (e) => {
    e.stopPropagation();
    protoStartX = e.touches[0].clientX;
    isProtoDragging = true;
  }, { passive: true });

  container.addEventListener('touchend', (e) => {
    e.stopPropagation();
    if (!isProtoDragging) return;
    const endX = e.changedTouches[0].clientX;
    const diff = protoStartX - endX;
    if (Math.abs(diff) > 35) {
      if (diff > 0) {
        updateProtoCarousel(currentIdx + 1);
      } else {
        updateProtoCarousel(currentIdx - 1);
      }
    }
    isProtoDragging = false;
  }, { passive: true });

  updateProtoCarousel(0);
};

initProtoCarousel();

const initProtoLightbox = () => {
  const lightbox = document.getElementById('proto-lightbox');
  const lightboxImg = document.getElementById('proto-lightbox-img');
  const lightboxTitle = document.getElementById('proto-lightbox-title');
  const lightboxCaption = document.getElementById('proto-lightbox-caption');
  const lightboxBadge = document.getElementById('proto-lightbox-badge');
  const closeBtn = document.getElementById('proto-lightbox-close');
  const backdrop = document.getElementById('proto-lightbox-backdrop');

  if (!lightbox || !lightboxImg) return;

  const openLightbox = (item) => {
    const img = item.querySelector('.proto-img');
    if (!img || img.naturalWidth === 0) return;

    lightboxImg.src = img.currentSrc || img.src;
    lightboxImg.alt = img.alt || 'Foto do projeto LABIO';
    if (lightboxTitle) lightboxTitle.textContent = item.dataset.title || 'Protótipo LABIO';
    if (lightboxCaption) lightboxCaption.textContent = item.dataset.caption || '';
    if (lightboxBadge) {
      lightboxBadge.textContent = 'LABIO · Registro de Projeto';
    }

    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  document.querySelectorAll('.proto-carousel-item').forEach((item) => {
    const container = item.querySelector('.proto-img-container');
    const zoomBtn = item.querySelector('.proto-zoom-trigger');

    container?.addEventListener('click', () => {
      openLightbox(item);
    });

    zoomBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      openLightbox(item);
    });
  });

  closeBtn?.addEventListener('click', closeLightbox);
  backdrop?.addEventListener('click', closeLightbox);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('is-open')) {
      closeLightbox();
    }
  });
};

initProtoLightbox();

// COMPATIBILIDADE DE DOWNLOAD DO EDITAL (file:// vs http/https)
if (window.location.protocol === 'file:') {
  const downloadLink = document.querySelector('.download-link');
  if (downloadLink) {
    downloadLink.removeAttribute('download');
    downloadLink.setAttribute('title', 'Clique para abrir o edital (em modo local file://)');
  }
}

document.querySelectorAll('.member-social-link.is-disabled').forEach((el) => {
  el.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  });
});
