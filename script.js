/* ===================================================
   PORTFOLIO — script.js
   Interactions, Animations & Logic
=================================================== */

'use strict';

/* =============================================
   1. LOADER
============================================= */
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    document.body.classList.remove('loading');
    loader.classList.add('hidden');
    initAOS();
  }, 1200);
});

document.body.classList.add('loading');

/* =============================================
   2. CUSTOM CURSOR
============================================= */
/* Custom cursor disabled — normal pointer used
const cursor = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursorFollower');
let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top = mouseY + 'px';
});

function animateCursor() {
  followerX += (mouseX - followerX) * 0.12;
  followerY += (mouseY - followerY) * 0.12;
  cursorFollower.style.left = followerX + 'px';
  cursorFollower.style.top = followerY + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

// Scale cursor on hoverable elements
document.querySelectorAll('a, button, .filter-btn, .skill-pill, .project-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform = 'translate(-50%, -50%) scale(2)';
    cursorFollower.style.transform = 'translate(-50%, -50%) scale(1.5)';
    cursorFollower.style.opacity = '0.3';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.transform = 'translate(-50%, -50%) scale(1)';
    cursorFollower.style.transform = 'translate(-50%, -50%) scale(1)';
    cursorFollower.style.opacity = '0.5';
  });
});
*/

/* =============================================
   3. NAVBAR — scroll & highlight
============================================= */
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  // Sticky shadow
  if (window.scrollY > 20) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Active link highlight
  const scrollPos = window.scrollY + 120;
  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    if (scrollPos >= top && scrollPos < top + height) {
      navLinks.forEach(link => link.classList.remove('active'));
      const activeLink = document.querySelector(`.nav-link[href="#${section.id}"]`);
      if (activeLink) activeLink.classList.add('active');
    }
  });
});

/* =============================================
   4. HAMBURGER MENU
============================================= */
const hamburger = document.getElementById('hamburger');
const navLinksContainer = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinksContainer.classList.toggle('open');
});

navLinksContainer.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinksContainer.classList.remove('open');
  });
});

/* =============================================
   5. PARTICLE CANVAS
============================================= */
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
let animFrameId;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.4;
    this.speedY = (Math.random() - 0.5) * 0.4;
    this.opacity = Math.random() * 0.5 + 0.1;
    this.color = Math.random() > 0.5 ? '0, 212, 255' : '124, 58, 237';
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
      this.reset();
    }
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
    ctx.fill();
  }
}

function initParticles() {
  particles = [];
  const count = Math.min(Math.floor((canvas.width * canvas.height) / 15000), 80);
  for (let i = 0; i < count; i++) {
    particles.push(new Particle());
  }
}
initParticles();
window.addEventListener('resize', initParticles);

function drawConnections() {
  const maxDist = 120;
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < maxDist) {
        const opacity = (1 - dist / maxDist) * 0.15;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(0, 212, 255, ${opacity})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawConnections();
  particles.forEach(p => { p.update(); p.draw(); });
  animFrameId = requestAnimationFrame(animateParticles);
}
animateParticles();

// Pause animation when hero is out of view (performance)
const heroObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) {
    if (!animFrameId) animateParticles();
  } else {
    cancelAnimationFrame(animFrameId);
    animFrameId = null;
  }
}, { threshold: 0 });
heroObserver.observe(document.getElementById('home'));

/* =============================================
   6. TYPED TEXT EFFECT
============================================= */
const phrases = [
  'Next.js applications.',
  'Laravel REST APIs.',
  'React.js interfaces.',
  'full-stack solutions.',
  'scalable web systems.',
];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typedEl = document.getElementById('typedText');
const typeSpeed = 80;
const deleteSpeed = 45;
const pauseTime = 2000;

function typeEffect() {
  const current = phrases[phraseIndex];
  if (isDeleting) {
    typedEl.textContent = current.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typedEl.textContent = current.substring(0, charIndex + 1);
    charIndex++;
  }
  let delay = isDeleting ? deleteSpeed : typeSpeed;
  if (!isDeleting && charIndex === current.length) {
    delay = pauseTime;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    delay = 400;
  }
  setTimeout(typeEffect, delay);
}
setTimeout(typeEffect, 1500);

/* =============================================
   7. SCROLL REVEAL (AOS-like)
============================================= */
function initAOS() {
  const elements = document.querySelectorAll('[data-aos]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = parseInt(el.dataset.delay || 0);
        setTimeout(() => {
          el.classList.add('aos-animate');
        }, delay);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.1 });
  elements.forEach(el => observer.observe(el));
}

/* =============================================
   8. SKILL BARS
============================================= */
function animateSkillBars() {
  const bars = document.querySelectorAll('.skill-bar-fill');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const width = bar.dataset.width;
        bar.style.width = width + '%';
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.5 });
  bars.forEach(bar => observer.observe(bar));
}
animateSkillBars();

/* =============================================
   9. PROJECT FILTER
============================================= */
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;

    projectCards.forEach(card => {
      if (filter === 'all' || card.dataset.category === filter) {
        card.classList.remove('hidden');
        card.style.animation = 'fadeInUp 0.4s ease both';
      } else {
        card.classList.add('hidden');
      }
    });

    // Adjust featured card when filter is not 'all'
    const featured = document.querySelector('.project-card.featured');
    if (featured) {
      if (filter !== 'all' && filter !== 'fullstack') {
        featured.style.gridColumn = 'span 1';
        featured.style.flexDirection = 'column';
      } else {
        featured.style.gridColumn = '';
        featured.style.flexDirection = '';
      }
    }
  });
});

/* =============================================
   10. CONTACT FORM VALIDATION
============================================= */
const contactForm = document.getElementById('contactForm');

function validateField(input, errorEl) {
  const val = input.value.trim();
  let valid = true;
  if (!val) {
    valid = false;
  } else if (input.type === 'email') {
    valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  }
  input.classList.toggle('error', !valid);
  errorEl.classList.toggle('show', !valid);
  return valid;
}

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const nameInput = document.getElementById('formName');
  const emailInput = document.getElementById('formEmail');
  const subjectInput = document.getElementById('formSubject');
  const msgInput = document.getElementById('formMessage');
  const nameErr = document.getElementById('nameError');
  const emailErr = document.getElementById('emailError');
  const subjectErr = document.getElementById('subjectError');
  const msgErr = document.getElementById('messageError');

  const v1 = validateField(nameInput, nameErr);
  const v2 = validateField(emailInput, emailErr);
  const v3 = validateField(subjectInput, subjectErr);
  const v4 = validateField(msgInput, msgErr);

  if (v1 && v2 && v3 && v4) {
    const btn = document.getElementById('submitBtn');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    btn.disabled = true;

    // Simulate async send (replace with real EmailJS/Formspree call)
    setTimeout(() => {
      contactForm.reset();
      btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
      btn.disabled = false;
      document.getElementById('formSuccess').classList.add('show');
      setTimeout(() => {
        document.getElementById('formSuccess').classList.remove('show');
      }, 5000);
    }, 1800);
  }
});

// Real-time validation
['formName', 'formEmail', 'formSubject', 'formMessage'].forEach(id => {
  const el = document.getElementById(id);
  const errEl = document.getElementById(id.replace('form', '').toLowerCase() + 'Error');
  if (el && errEl) {
    el.addEventListener('blur', () => validateField(el, errEl));
    el.addEventListener('input', () => {
      if (el.classList.contains('error')) validateField(el, errEl);
    });
  }
});

/* =============================================
   11. FOOTER YEAR
============================================= */
document.getElementById('year').textContent = new Date().getFullYear();

/* =============================================
   12. SMOOTH SCROLL for anchor links
============================================= */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* =============================================
   13. PARALLAX subtle effect on hero
============================================= */
const heroContent = document.querySelector('.hero-content');
const heroVisual = document.querySelector('.hero-visual');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  if (scrollY < window.innerHeight) {
    const offset = scrollY * 0.15;
    if (heroContent) heroContent.style.transform = `translateY(${offset}px)`;
    if (heroVisual) heroVisual.style.transform = `translateY(${offset * 0.6}px)`;
  }
});

/* =============================================
   14. SKILL PILLS hover tooltip (proficiency)
============================================= */
document.querySelectorAll('.skill-pill[data-level]').forEach(pill => {
  pill.title = `Proficiency: ${pill.dataset.level}%`;
});
