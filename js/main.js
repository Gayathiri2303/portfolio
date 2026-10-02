/* ===== Safe GSAP init ===== */
const hasGSAP = typeof gsap !== 'undefined';
if (hasGSAP) {
  gsap.registerPlugin(ScrollTrigger);
}

/* ===== Loader with percent ===== */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  const progress = document.querySelector('.loader-progress');
  const percentEl = document.getElementById('loader-percent');
  let pct = 0;

  const interval = setInterval(() => {
    pct += Math.random() * 15 + 5;
    if (pct >= 100) {
      pct = 100;
      clearInterval(interval);
      if (progress) progress.style.width = '100%';
      if (percentEl) percentEl.textContent = '100';
      setTimeout(() => {
        if (loader) loader.classList.add('hidden');
        if (hasGSAP) initAnimations();
        else makeAllVisible();
      }, 250);
    } else {
      if (progress) progress.style.width = pct + '%';
      if (percentEl) percentEl.textContent = Math.floor(pct);
    }
  }, 60);
});

/* Fallback if GSAP fails (file:// or CDN blocked) */
function makeAllVisible() {
  document.querySelectorAll(
    '.hero-badge, .hero-greeting, .hero-name, .hero-title, .hero-desc, .hero-btns, .hero-socials a, .scroll-indicator, .section-header, .about-text, .stat-card, .skill-category, .skill-tags span, .project-card, .timeline-item, .edu-card, .contact-card'
  ).forEach(el => {
    el.style.opacity = '1';
    el.style.transform = 'none';
  });
}

/* ===== Particles (pure canvas, no GSAP) ===== */
(function initParticles() {
  const canvas = document.getElementById('particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  let mouse = { x: null, y: null, radius: 120 };

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createParticles() {
    particles = [];
    const count = Math.min(Math.floor((canvas.width * canvas.height) / 14000), 80);
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 1.5 + 0.4,
        opacity: Math.random() * 0.3 + 0.08
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      if (mouse.x !== null) {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          p.vx -= (dx / dist) * force * 0.015;
          p.vy -= (dy / dist) * force * 0.015;
        }
      }
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(34, 211, 238, ${p.opacity})`;
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(34, 211, 238, ${0.06 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { resize(); createParticles(); });
  window.addEventListener('mousemove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
  window.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });

  resize();
  createParticles();
  draw();
})();

/* ===== Magnetic (only if GSAP) ===== */
if (hasGSAP) {
  document.querySelectorAll('.magnetic').forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(el, { x: x * 0.2, y: y * 0.2, duration: 0.3, ease: 'power2.out' });
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
    });
  });
}

/* ===== Navbar ===== */
const navbar = document.getElementById('navbar');
const navToggle = document.querySelector('.nav-toggle');
const mobileMenu = document.querySelector('.mobile-menu');

window.addEventListener('scroll', () => {
  if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 50);
});

if (navToggle) {
  navToggle.addEventListener('click', () => {
    if (mobileMenu) mobileMenu.classList.toggle('active');
  });
}

document.querySelectorAll('.mobile-menu a').forEach(link => {
  link.addEventListener('click', () => {
    if (mobileMenu) mobileMenu.classList.remove('active');
  });
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ===== Animations (only when GSAP available) ===== */
function initAnimations() {
  // Hero
  const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  heroTl
    .from('.hero-badge', { y: 20, opacity: 0, duration: 0.5 })
    .from('.hero-greeting', { y: 30, opacity: 0, duration: 0.5 }, '-=0.2')
    .from('.hero-name', { y: 40, opacity: 0, duration: 0.7 }, '-=0.25')
    .from('.hero-title', { y: 30, opacity: 0, duration: 0.5 }, '-=0.3')
    .from('.hero-desc', { y: 30, opacity: 0, duration: 0.5 }, '-=0.25')
    .from('.hero-btns', { y: 30, opacity: 0, duration: 0.5 }, '-=0.2')
    .from('.hero-socials a', { y: 20, opacity: 0, duration: 0.4, stagger: 0.08 }, '-=0.2')
    .from('.scroll-indicator', { opacity: 0, duration: 0.4 }, '-=0.1');

  // Section headers
  gsap.utils.toArray('.section-header').forEach(header => {
    gsap.from(header, {
      scrollTrigger: { trigger: header, start: 'top 90%', toggleActions: 'play none none none' },
      y: 30, opacity: 0, duration: 0.6, ease: 'power3.out'
    });
  });

  // About
  gsap.from('.about-text', {
    scrollTrigger: { trigger: '.about-grid', start: 'top 85%', toggleActions: 'play none none none' },
    x: -30, opacity: 0, duration: 0.7, ease: 'power3.out'
  });

  gsap.from('.stat-card', {
    scrollTrigger: { trigger: '.about-cards', start: 'top 85%', toggleActions: 'play none none none' },
    y: 30, opacity: 0, duration: 0.5, stagger: 0.1, ease: 'power3.out',
    onComplete: animateCounters
  });

  // Skills – important: use toggleActions so they don't stay hidden
  gsap.from('.skill-category', {
    scrollTrigger: { trigger: '.skills-grid', start: 'top 85%', toggleActions: 'play none none none' },
    y: 40, opacity: 0, duration: 0.55, stagger: 0.08, ease: 'power3.out'
  });

  gsap.utils.toArray('.skill-category').forEach(cat => {
    const tags = cat.querySelectorAll('.skill-tags span');
    gsap.from(tags, {
      scrollTrigger: { trigger: cat, start: 'top 90%', toggleActions: 'play none none none' },
      scale: 0.85, opacity: 0, duration: 0.25, stagger: 0.025, ease: 'back.out(1.4)', delay: 0.15
    });
  });

  // Projects
  gsap.from('.project-card', {
    scrollTrigger: { trigger: '.projects-grid', start: 'top 85%', toggleActions: 'play none none none' },
    y: 40, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out'
  });

  // Timeline
  gsap.from('.timeline-item', {
    scrollTrigger: { trigger: '.timeline', start: 'top 85%', toggleActions: 'play none none none' },
    x: -30, opacity: 0, duration: 0.6, stagger: 0.15, ease: 'power3.out'
  });

  // Education
  gsap.from('.edu-card', {
    scrollTrigger: { trigger: '.edu-grid', start: 'top 85%', toggleActions: 'play none none none' },
    y: 30, opacity: 0, duration: 0.5, stagger: 0.08, ease: 'power3.out'
  });

  // Contact
  gsap.from('.contact-card', {
    scrollTrigger: { trigger: '.contact-info', start: 'top 85%', toggleActions: 'play none none none' },
    x: -20, opacity: 0, duration: 0.45, stagger: 0.07, ease: 'power3.out'
  });

  // Refresh ScrollTrigger after images load
  window.addEventListener('load', () => {
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  });
}

function animateCounters() {
  if (!hasGSAP) return;
  document.querySelectorAll('.stat-number').forEach(el => {
    const target = parseInt(el.getAttribute('data-count'), 10);
    gsap.to(el, {
      innerText: target,
      duration: 1.4,
      ease: 'power2.out',
      snap: { innerText: 1 },
      onUpdate: function () {
        el.innerText = Math.round(this.targets()[0].innerText);
      }
    });
  });
}

/* Active nav */
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY + 120;
  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    const link = document.querySelector(`.nav-links a[href="#${id}"]`);
    if (link && scrollY >= top && scrollY < top + height) {
      document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
      link.classList.add('active');
    }
  });
});

/* Extra safety: if after 3.5s content is still invisible, force show */
setTimeout(() => {
  const test = document.querySelector('.skill-category');
  if (test && getComputedStyle(test).opacity === '0') {
    makeAllVisible();
  }
}, 3500);
