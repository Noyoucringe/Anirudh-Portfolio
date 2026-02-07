/* ====================================
   MODERN SCROLL-FIRST PORTFOLIO - JS
   ==================================== */

const root = document.documentElement;
const header = document.querySelector('.site-header');
const cursorGlow = document.querySelector('.cursor-glow');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function updateScrollVars() {
  const scrollY = window.scrollY || window.pageYOffset;
  const scrollHeight = root.scrollHeight - window.innerHeight;
  const progress = scrollHeight > 0 ? scrollY / scrollHeight : 0;

  root.style.setProperty('--scroll', `${scrollY}px`);
  root.style.setProperty('--progress', progress.toString());

  if (header) {
    header.classList.toggle('compact', scrollY > 20);
  }
}

if (!prefersReducedMotion) {
  window.addEventListener('scroll', () => requestAnimationFrame(updateScrollVars));
  window.addEventListener('resize', updateScrollVars);
  updateScrollVars();
}

// ====== CURSOR GLOW ======
if (cursorGlow && !prefersReducedMotion) {
  let isTouch = false;

  const moveGlow = (x, y) => {
    cursorGlow.style.left = `${x}px`;
    cursorGlow.style.top = `${y}px`;
  };

  window.addEventListener('mousemove', (event) => {
    if (isTouch) return;
    cursorGlow.classList.remove('touch');
    cursorGlow.style.opacity = '0.35';
    moveGlow(event.clientX, event.clientY);
  });

  window.addEventListener('mouseleave', () => {
    if (!isTouch) {
      cursorGlow.style.opacity = '0';
    }
  });

  window.addEventListener('touchstart', (event) => {
    isTouch = true;
    const touch = event.touches[0];
    if (!touch) return;
    cursorGlow.classList.add('touch');
    cursorGlow.style.opacity = '0.45';
    moveGlow(touch.clientX, touch.clientY);
  }, { passive: true });

  window.addEventListener('touchmove', (event) => {
    const touch = event.touches[0];
    if (!touch) return;
    moveGlow(touch.clientX, touch.clientY);
  }, { passive: true });

  window.addEventListener('touchend', () => {
    cursorGlow.style.opacity = '0';
  }, { passive: true });
}

// ====== SMOOTH SCROLL NAVIGATION ======
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (event) => {
    const href = anchor.getAttribute('href');
    if (!href || href === '#') return;

    event.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    }
  });
});

// ====== REVEAL ANIMATIONS ======
const revealItems = document.querySelectorAll('[data-reveal]');
let lastScrollY = window.scrollY || window.pageYOffset;
let initialRevealDone = false;

const revealObserver = new IntersectionObserver((entries) => {
  const currentScrollY = window.scrollY || window.pageYOffset;
  const scrollingDown = currentScrollY > lastScrollY;

  entries.forEach(entry => {
    if (!entry.isIntersecting || entry.target.classList.contains('is-visible')) {
      return;
    }

    if (scrollingDown || !initialRevealDone) {
      entry.target.classList.add('is-visible');
    } else {
      entry.target.style.transition = 'none';
      entry.target.classList.add('is-visible');
      requestAnimationFrame(() => {
        entry.target.style.transition = '';
      });
    }
  });

  lastScrollY = currentScrollY;
  initialRevealDone = true;
}, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });

revealItems.forEach(item => {
  const delay = Number(item.dataset.delay || 0);
  if (delay) {
    item.style.transitionDelay = `${delay}ms`;
  }
  revealObserver.observe(item);
});

revealItems.forEach(item => {
  const rect = item.getBoundingClientRect();
  if (rect.top < window.innerHeight && rect.bottom > 0) {
    item.classList.add('is-visible');
  }
});

// ====== FORM HANDLING ======
const contactForm = document.querySelector('.contact-form');
const formStatus = document.querySelector('.form-status');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = 'Sending...';
    submitBtn.style.opacity = '0.7';
    submitBtn.disabled = true;
    
    const formData = new FormData(contactForm);
    
    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        if (formStatus) {
          formStatus.textContent = 'Message sent successfully.';
          formStatus.style.color = '#3a3a3a';
        }
        contactForm.reset();
        
        submitBtn.textContent = 'Sent!';
        
        setTimeout(() => {
          submitBtn.textContent = originalText;
          submitBtn.style.opacity = '1';
          submitBtn.disabled = false;
          if (formStatus) {
            formStatus.textContent = '';
          }
        }, 2500);
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      if (formStatus) {
        formStatus.textContent = 'Message failed. Please try again.';
        formStatus.style.color = '#555555';
      }
      submitBtn.textContent = originalText;
      submitBtn.style.opacity = '1';
      submitBtn.disabled = false;
    }
  });
}

// ====== SKILL TAG INTERACTIONS ======
document.querySelectorAll('.tag').forEach(tag => {
  tag.addEventListener('click', function() {
    this.style.animation = 'pulse-tag 0.5s ease-out';
    setTimeout(() => {
      this.style.animation = '';
    }, 500);
  });
});

document.querySelectorAll('.tech-tag').forEach(tag => {
  tag.addEventListener('click', function() {
    this.style.animation = 'pulse-tag 0.5s ease-out';
    setTimeout(() => {
      this.style.animation = '';
    }, 500);
  });
});

// ====== DYNAMIC MODULE STATUS ======
function animateModuleStatus() {
  const modules = document.querySelectorAll('.module-loading');
  const messages = ['Initializing...', 'Compiling...', 'Building...', 'Processing...'];
  
  modules.forEach((module, index) => {
    let msgIndex = index % messages.length;
    
    setInterval(() => {
      msgIndex = (msgIndex + 1) % messages.length;
      const loader = module.querySelector('.loader');
      
      module.style.opacity = '0';
      setTimeout(() => {
        module.innerHTML = `<span class="loader">▌</span> ${messages[msgIndex]}`;
        module.style.opacity = '1';
      }, 200);
    }, 2000 + (index * 500));
    
    module.style.transition = 'opacity 0.3s ease';
  });
}

// ====== DYNAMIC LOG MESSAGES ======
function updateLogMessages() {
  const logMessages = document.querySelectorAll('.log-message');
  const messages = [
    '[LOG] System online...',
    '[LOG] All modules loaded...',
    '[LOG] Ready for deployment...',
    '[LOG] Awaiting commands...'
  ];
  
  logMessages.forEach((log, index) => {
    let msgIndex = 0;
    
    setInterval(() => {
      if (msgIndex === 0) {
        msgIndex = (msgIndex + 1) % messages.length;
        log.style.opacity = '0';
        
        setTimeout(() => {
          const prefix = log.querySelector('.prefix');
          const badge = log.querySelector('.badge');
          const message = messages[msgIndex];
          
          if (prefix) {
            log.innerHTML = message + (badge ? ` <span class="badge">${badge.textContent}</span>` : '');
          }
          log.style.opacity = '1';
        }, 300);
      }
    }, 5000 + (index * 1000));
    
    log.style.transition = 'opacity 0.3s ease';
  });
}

// ====== CODE ANIMATION ======
function animateCodeBlock() {
  const codeContent = document.querySelector('.code-content');
  if (!codeContent) return;
  
  const originalHTML = codeContent.innerHTML;
  codeContent.innerHTML = '';
  
  let charIndex = 0;
  const speed = 25;
  
  function typeCode() {
    if (charIndex < originalHTML.length) {
      codeContent.innerHTML = originalHTML.substring(0, charIndex + 1);
      charIndex++;
      setTimeout(typeCode, speed);
    }
  }
  
  const codeSection = document.querySelector('.section-code');
  if (codeSection) {
    const codeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && charIndex === 0) {
          typeCode();
          codeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    
    codeObserver.observe(codeSection);
  }
}

// ====== PULSE ANIMATION ======
const pulseStyle = document.createElement('style');
pulseStyle.innerHTML = `
  @keyframes pulse-tag {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
  }
`;
document.head.appendChild(pulseStyle);

// ====== PAGE LOAD INIT ======
document.addEventListener('DOMContentLoaded', async () => {
  await new Promise(r => setTimeout(r, 200));
  
  await initHeroAnimations();
  
  setTimeout(() => {
    animateModuleStatus();
    updateLogMessages();
    animateCodeBlock();
  }, 500);
});

// ====== RANDOM GLITCH EFFECT ======
function randomGlitch() {
  const titleLine = document.querySelector('.title-line');
  if (titleLine) {
    setInterval(() => {
      const randomDelay = Math.random() * 5000 + 5000;
      setTimeout(() => {
        titleLine.style.animation = 'none';
        setTimeout(() => {
          titleLine.style.animation = 'glitch 3s infinite';
        }, 50);
      }, randomDelay);
    }, 8000);
  }
}

setTimeout(() => {
  randomGlitch();
}, 3000);

// ====== TERMINAL CURSOR ======
function addTerminalCursor() {
  const userHost = document.querySelector('.bar-user');
  if (userHost) {
    setInterval(() => {
      const isShadow = userHost.style.textShadow === '0 0 20px rgba(58, 58, 58, 1)';
      userHost.style.textShadow = isShadow 
        ? '0 0 10px rgba(58, 58, 58, 0.5)' 
        : '0 0 20px rgba(58, 58, 58, 1)';
    }, 500);
  }
}

setTimeout(() => {
  addTerminalCursor();
}, 500);

// ====== STATUS DOT ANIMATION ======
document.querySelectorAll('.status-dot').forEach(dot => {
  dot.style.animation = 'pulse 1.5s infinite';
});

console.log('%c[SYSTEM] Portfolio loaded successfully! 🚀', 'color: #3a3a3a; font-weight: bold; text-shadow: 0 0 10px rgba(58, 58, 58, 0.5);');
