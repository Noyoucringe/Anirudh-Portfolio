/* ====================================
   TERMINAL HACKER AESTHETIC - JS
   ==================================== */

// ====== TYPING ANIMATION ======
function typeText(element, text, speed = 40) {
  return new Promise((resolve) => {
    let index = 0;
    element.innerHTML = '';
    
    function type() {
      if (index < text.length) {
        element.innerHTML += text.charAt(index);
        index++;
        setTimeout(type, speed);
      } else {
        resolve();
      }
    }
    type();
  });
}

// ====== INIT HERO ANIMATIONS ======
async function initHeroAnimations() {
  const typedText = document.querySelector('.typed-text');
  const mainTitle = document.querySelector('.main-title');
  
  if (typedText) {
    await typeText(typedText, 'cat portfolio.md', 50);
  }
  
  if (mainTitle) {
    mainTitle.style.animation = 'none';
    await new Promise(r => setTimeout(r, 200));
    mainTitle.style.animation = 'glitch 3s infinite';
  }
}

// ====== SMOOTH SCROLL NAVIGATION ======
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ====== SCROLL ANIMATIONS ======
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Observe project boxes
document.querySelectorAll('.project-box').forEach((box, index) => {
  box.style.opacity = '0';
  box.style.transform = 'translateY(20px)';
  box.style.transition = `opacity 0.6s ease-out ${index * 0.1}s, transform 0.6s ease-out ${index * 0.1}s`;
  observer.observe(box);
});

// Observe skill modules
document.querySelectorAll('.module-box').forEach((module, index) => {
  module.style.opacity = '0';
  module.style.transform = 'translateY(20px)';
  module.style.transition = `opacity 0.6s ease-out ${index * 0.08}s, transform 0.6s ease-out ${index * 0.08}s`;
  observer.observe(module);
});

// ====== FORM HANDLING ======
const contactForm = document.querySelector('.contact-form');
const formStatus = document.querySelector('.form-status');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = '$ sending_message...';
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
          formStatus.textContent = '✓ Message transmitted successfully';
          formStatus.style.color = '#3a3a3a';
        }
        contactForm.reset();
        
        submitBtn.textContent = '$ Message sent!';
        
        setTimeout(() => {
          submitBtn.textContent = originalText;
          submitBtn.style.opacity = '1';
          submitBtn.disabled = false;
          if (formStatus) {
            formStatus.textContent = '';
          }
        }, 3000);
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      if (formStatus) {
        formStatus.textContent = '✗ Transmission failed. Please check connection.';
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
