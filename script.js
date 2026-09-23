// Reveal Animations on Scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((item) => observer.observe(item));

// Mobile Menu Toggle
const menuButton = document.querySelector('.menu-button');
const nav = document.querySelector('.nav');
if (menuButton && nav) {
  menuButton.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
  });

  nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    nav.classList.remove('is-open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Abrir menu');
  }));

  document.addEventListener('click', (e) => {
    if (nav.classList.contains('is-open') && !nav.contains(e.target) && !menuButton.contains(e.target)) {
      nav.classList.remove('is-open');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Abrir menu');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) {
      nav.classList.remove('is-open');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Abrir menu');
    }
  });
}

// -------------------------------------------------------------
// SMOOTH SCROLL PARA SEÇÕES (Rolagem macia e fluida)
// -------------------------------------------------------------
let currentScrollAnimation = null;

const smoothScrollTo = (targetY, duration = 750) => {
  if (currentScrollAnimation) {
    cancelAnimationFrame(currentScrollAnimation);
    currentScrollAnimation = null;
  }

  const startY = window.pageYOffset || document.documentElement.scrollTop;
  const distance = targetY - startY;
  if (Math.abs(distance) < 2) return;

  let startTime = null;

  // Curva de desaceleração fluida inspirada em design de transições (easeInOutCubic)
  const easeInOutCubic = (t) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  // Permite ao usuário interromper a rolagem se girar a roda do mouse ou tocar na tela
  const cancelScroll = () => {
    if (currentScrollAnimation) {
      cancelAnimationFrame(currentScrollAnimation);
      currentScrollAnimation = null;
      cleanupCancelListeners();
    }
  };

  const cleanupCancelListeners = () => {
    window.removeEventListener('wheel', cancelScroll);
    window.removeEventListener('touchstart', cancelScroll);
  };

  window.addEventListener('wheel', cancelScroll, { passive: true });
  window.addEventListener('touchstart', cancelScroll, { passive: true });

  const step = (currentTime) => {
    if (!startTime) startTime = currentTime;
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeProgress = easeInOutCubic(progress);

    window.scrollTo(0, startY + distance * easeProgress);

    if (progress < 1) {
      currentScrollAnimation = requestAnimationFrame(step);
    } else {
      currentScrollAnimation = null;
      cleanupCancelListeners();
    }
  };

  currentScrollAnimation = requestAnimationFrame(step);
};

// Vincula todos os links âncora internos
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (!href || href === '#') return;

    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();

      // Fecha o menu mobile se estiver aberto
      if (nav && nav.classList.contains('is-open')) {
        nav.classList.remove('is-open');
        if (menuButton) {
          menuButton.setAttribute('aria-expanded', 'false');
          menuButton.setAttribute('aria-label', 'Abrir menu');
        }
      }

      // Calcula o topo do elemento com respiro
      const header = document.querySelector('.header');
      const headerOffset = header ? header.offsetHeight * 0.35 : 24;
      const targetTop = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;

      smoothScrollTo(Math.max(0, targetTop), 800);

      if (history.pushState) {
        history.pushState(null, null, href);
      }
    }
  });
});
const initAetherFlow = () => {
  const canvas = document.getElementById('aether-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let animationFrameId;
  let particles = [];
  const mouse = { x: null, y: null, radius: 190 };
  let isHeroVisible = true;

  // Particle Class
  class Particle {
    constructor(x, y, directionX, directionY, size, color) {
      this.x = x;
      this.y = y;
      this.directionX = directionX;
      this.directionY = directionY;
      this.size = size;
      this.color = color;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
      ctx.fillStyle = this.color;
      ctx.fill();
    }

    update() {
      if (this.x > canvas.width || this.x < 0) {
        this.directionX = -this.directionX;
      }
      if (this.y > canvas.height || this.y < 0) {
        this.directionY = -this.directionY;
      }

      // Mouse collision and repulsion
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius + this.size) {
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          const force = (mouse.radius - distance) / mouse.radius;
          this.x -= forceDirectionX * force * 4.5;
          this.y -= forceDirectionY * force * 4.5;
        }
      }

      this.x += this.directionX;
      this.y += this.directionY;
      this.draw();
    }
  }

  function initParticles() {
    particles = [];
    const count = Math.min(Math.floor((canvas.height * canvas.width) / 9500), 85);
    for (let i = 0; i < count; i++) {
      const size = Math.random() * 2.2 + 1.2;
      const x = Math.random() * (canvas.width - size * 4) + size * 2;
      const y = Math.random() * (canvas.height - size * 4) + size * 2;
      const directionX = Math.random() * 0.4 - 0.2;
      const directionY = Math.random() * 0.4 - 0.2;

      // Paleta LABIO: 80% azul elétrico, 20% vermelho pulso
      const isPulseRed = Math.random() < 0.22;
      const color = isPulseRed
        ? 'rgba(255, 57, 62, 0.78)'
        : 'rgba(48, 174, 250, 0.75)';

      particles.push(new Particle(x, y, directionX, directionY, size, color));
    }
  }

  const resizeCanvas = () => {
    const parent = canvas.parentElement;
    canvas.width = parent ? parent.clientWidth : window.innerWidth;
    canvas.height = parent ? parent.clientHeight : window.innerHeight;
    initParticles();
  };

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  // Draw connecting flow lines between nearby particles
  const connectParticles = () => {
    const maxDist = (canvas.width / 7) * (canvas.height / 7);
    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        const dx = particles[a].x - particles[b].x;
        const dy = particles[a].y - particles[b].y;
        const distSq = dx * dx + dy * dy;

        if (distSq < maxDist && distSq < 18000) {
          const opacityValue = 1 - Math.sqrt(distSq) / 135;
          if (opacityValue <= 0) continue;

          let isNearMouse = false;
          if (mouse.x !== null && mouse.y !== null) {
            const dxMouse = particles[a].x - mouse.x;
            const dyMouse = particles[a].y - mouse.y;
            isNearMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse) < mouse.radius;
          }

          if (isNearMouse) {
            ctx.strokeStyle = `rgba(48, 174, 250, ${Math.min(opacityValue * 1.3, 0.75)})`;
            ctx.lineWidth = 1.3;
          } else {
            ctx.strokeStyle = `rgba(16, 43, 49, ${Math.min(opacityValue * 0.16, 0.22)})`;
            ctx.lineWidth = 0.75;
          }

          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    }
  };

  const animate = () => {
    if (isHeroVisible) {
      // Clear canvas preserving the CSS paper background color
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
      }
      connectParticles();
    }
    animationFrameId = requestAnimationFrame(animate);
  };

  // Mouse and Touch interaction over hero area
  const heroSection = canvas.closest('.hero') || window;
  heroSection.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  heroSection.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  heroSection.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches[0]) {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.touches[0].clientX - rect.left;
      mouse.y = e.touches[0].clientY - rect.top;
    }
  }, { passive: true });

  heroSection.addEventListener('touchend', () => {
    mouse.x = null;
    mouse.y = null;
  }, { passive: true });

  // Pause when hero is scrolled out of view for performance
  const heroObserver = new IntersectionObserver(([entry]) => {
    isHeroVisible = entry.isIntersecting;
  }, { threshold: 0.05 });
  heroObserver.observe(canvas.parentElement || canvas);

  initParticles();
  animate();
};

initAetherFlow();

// -------------------------------------------------------------
// PROJETOS - Carousel Interativo
// -------------------------------------------------------------
const initProjectsCarousel = () => {
  const track = document.getElementById('carousel-track');
  const prevBtn = document.getElementById('carousel-prev-btn');
  const nextBtn = document.getElementById('carousel-next-btn');
  const counter = document.getElementById('carousel-counter');
  const dots = document.querySelectorAll('#carousel-dots .dot-btn');
  const viewport = document.getElementById('carousel-viewport');

  if (!track || !prevBtn || !nextBtn) return;

  const slides = track.querySelectorAll('.carousel-slide');
  const totalSlides = slides.length;
  let currentIndex = 0;

  const updateCarousel = (index) => {
    currentIndex = (index + totalSlides) % totalSlides;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    if (counter) {
      counter.textContent = `0${currentIndex + 1} / 0${totalSlides}`;
    }

    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentIndex);
      dot.setAttribute('aria-current', String(idx === currentIndex));
    });
  };

  prevBtn.addEventListener('click', () => updateCarousel(currentIndex - 1));
  nextBtn.addEventListener('click', () => updateCarousel(currentIndex + 1));

  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => updateCarousel(idx));
  });

  // Keyboard navigation when focused on carousel
  viewport?.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') updateCarousel(currentIndex - 1);
    if (e.key === 'ArrowRight') updateCarousel(currentIndex + 1);
  });

  // Touch Swipe Support (Mobile-native fluid gestures)
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

  // Mouse Drag Support
  let mouseStartX = 0;
  let isMouseDown = false;

  viewport?.addEventListener('mousedown', (e) => {
    if (e.target.closest('#proto-carousel')) return;
    mouseStartX = e.clientX;
    isMouseDown = true;
  });

  window.addEventListener('mouseup', (e) => {
    if (!isMouseDown) return;
    const diff = mouseStartX - e.clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        updateCarousel(currentIndex + 1);
      } else {
        updateCarousel(currentIndex - 1);
      }
    }
    isMouseDown = false;
  });
};

initProjectsCarousel();

// -------------------------------------------------------------
// CARROSSEL DE FOTOS DO PROTÓTIPO (Pulseira LABIO)
// -------------------------------------------------------------
const initProtoCarousel = () => {
  const container = document.getElementById('proto-carousel');
  if (!container) return;

  const track = document.getElementById('proto-carousel-track');
  const prevBtn = document.getElementById('proto-prev-btn');
  const nextBtn = document.getElementById('proto-next-btn');
  const counter = document.getElementById('proto-counter');
  const dotsContainer = document.getElementById('proto-dots');
  const items = track ? track.querySelectorAll('.proto-carousel-item') : [];
  const totalItems = items.length;

  if (!track || totalItems === 0) return;

  let currentIdx = 0;

  const updateProtoCarousel = (newIdx) => {
    currentIdx = (newIdx + totalItems) % totalItems;
    track.style.transform = `translateX(-${currentIdx * 100}%)`;

    if (counter) {
      counter.textContent = `Foto 0${currentIdx + 1} / 0${totalItems}`;
    }

    if (dotsContainer) {
      const dots = dotsContainer.querySelectorAll('.proto-dot');
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIdx);
        dot.setAttribute('aria-current', String(i === currentIdx));
      });
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

  if (dotsContainer) {
    const dots = dotsContainer.querySelectorAll('.proto-dot');
    dots.forEach((dot, idx) => {
      dot.addEventListener('click', (e) => {
        e.stopPropagation();
        updateProtoCarousel(idx);
      });
    });
  }

  // Touch Swipe para fotos no mobile
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
};

initProtoCarousel();

// -------------------------------------------------------------
// COMPATIBILIDADE DE DOWNLOAD DO EDITAL (file:// vs http/https)
// -------------------------------------------------------------
// O Google Chrome/Edge bloqueia por segurança o download direto via atributo
// 'download' em páginas abertas direto pelo disco (file://), gerando falso 'erro de rede'.
// Se o usuário estiver testando via file://, abrimos o PDF em nova aba sem erro.
// Em servidores locais (Live Server) ou em produção (GitHub Pages), o download direto é executado.
if (window.location.protocol === 'file:') {
  const downloadLink = document.querySelector('.download-link');
  if (downloadLink) {
    downloadLink.removeAttribute('download');
    downloadLink.setAttribute('title', 'Clique para abrir o edital (em modo local file://)');
  }
}


