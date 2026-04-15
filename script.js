(() => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* MOBILE NAV*/
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.site-nav');
  const navLinks = document.querySelectorAll('.site-nav a');

  function setNav(open) {
    nav?.classList.toggle('active', open);
    toggle?.classList.toggle('active', open);
    toggle?.setAttribute('aria-expanded', open);
    
    // Add haptic feedback if available
    if (navigator.vibrate) {
      navigator.vibrate(open ? [10, 5, 10] : 10);
    }
  }

  toggle?.addEventListener('click', (e) => {
    e.preventDefault();
    setNav(!nav.classList.contains('active'));
  });
  
  // Support keyboard activation
  toggle?.addEventListener('keydown', (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      setNav(!nav.classList.contains('active'));
    }
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => setNav(false));
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setNav(false);
  });

  /* SMOOTH SCROLL*/
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;

      e.preventDefault();
      
      // Set active link immediately on click
      const href = this.getAttribute('href').substring(1);
      setActive(href);
      
      target.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth'
      });
      
      // Close mobile menu after clicking
      setNav(false);
    });
  });

  /* SCROLL REVEAL*/
  const revealEls = document.querySelectorAll('.section, .card');

  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    revealEls.forEach(el => el.classList.add('reveal'));

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('reveal-in');
        io.unobserve(entry.target);
      });
    }, { threshold: 0.15 });

    revealEls.forEach(el => io.observe(el));
  }

  /*SCROLL SPY*/
  const sections = document.querySelectorAll('section[id]');
  const navMap = {};

  sections.forEach(section => {
    const id = section.id;
    const link = document.querySelector(`.site-nav a[href="#${id}"]`);
    if (link) navMap[id] = link;
  });

  function setActive(id) {
    Object.values(navMap).forEach(l => l.classList.remove('active-link'));
    navMap[id]?.classList.add('active-link');
  }

  if ('IntersectionObserver' in window) {
    const spy = new IntersectionObserver((entries) => {
      const visible = entries
        .filter(e => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visible) setActive(visible.target.id);
    }, {
      rootMargin: '-40% 0px -50% 0px',
      threshold: [0.1, 0.3, 0.6]
    });

    sections.forEach(sec => spy.observe(sec));
  }

  // Fallback: Update active link on scroll if IntersectionObserver not available
  window.addEventListener('scroll', () => {
    if ('IntersectionObserver' in window) return; // Skip if using observer
    
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      if (scrollY >= sectionTop - 200) {
        current = section.getAttribute('id');
      }
    });
    if (current) setActive(current);
  });

  /*NEON HOVER BOOST*/
  document.querySelectorAll('.btn, .card, .site-nav a').forEach(el => {
    el.addEventListener('mouseenter', () => {
      el.style.filter = "brightness(1.25)";
    });
    el.addEventListener('mouseleave', () => {
      el.style.filter = "brightness(1)";
    });
  });

  /*CURSOR GLOW EFFECT*/
  const cursorGlow = document.createElement('div');
  cursorGlow.style.position = 'fixed';
  cursorGlow.style.width = '120px';
  cursorGlow.style.height = '120px';
  cursorGlow.style.borderRadius = '50%';
  cursorGlow.style.pointerEvents = 'none';
  cursorGlow.style.background = 'radial-gradient(circle, rgba(138,43,226,0.4), transparent 70%)';
  cursorGlow.style.filter = 'blur(20px)';
  cursorGlow.style.zIndex = '9999';
  document.body.appendChild(cursorGlow);

  document.addEventListener('mousemove', (e) => {
    cursorGlow.style.left = e.clientX - 60 + 'px';
    cursorGlow.style.top = e.clientY - 60 + 'px';
  });

  /*PARTICLE BACKGROUND*/
  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = 0;
  canvas.style.left = 0;
  canvas.style.zIndex = '-1';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let particles = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  function createParticles() {
    particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2,
      speedY: Math.random() * 0.5 + 0.2
    }));
  }

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      ctx.fillStyle = "rgba(138,43,226,0.6)";
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();

      p.y += p.speedY;
      if (p.y > canvas.height) p.y = 0;
    });

    requestAnimationFrame(drawParticles);
  }

  createParticles();
  drawParticles();

  /* PAGE FADE TRANSITION*/
  document.body.style.opacity = 0;

  window.addEventListener('load', () => {
    document.body.style.transition = "opacity 0.8s ease";
    document.body.style.opacity = 1;
  });

})();