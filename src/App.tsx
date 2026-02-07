import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';

const featureCards = [
  { title: 'Intermediate Programming', description: 'Understanding logic, functions, and data structures.' },
  { title: 'Web Fundamentals', description: 'HTML, TailwindCSS, JavaScript, React for building clean interfaces.' },
  { title: 'Learning by Doing', description: 'Small projects to apply concepts and improve each time.' },
  { title: 'Debugging Practice', description: 'Reading errors, testing fixes, and learning from mistakes.' },
];

const processSteps = [
  { step: '01', title: 'Learn', description: 'Pick a topic and understand the basics.' },
  { step: '02', title: 'Practice', description: 'Build small projects to apply what I learned.' },
  { step: '03', title: 'Improve', description: 'Fix mistakes, clean up code, and keep moving forward.' },
  { step: '04', title: 'Reflect', description: 'Write down what worked and what to try next.' },
];

const projects = [
  {
    title: 'TriviaChamp – Quiz Application',
    description: 'OOP-based quiz application with modular classes for questions, scoring, and user interaction.',
    tags: ['Java', 'OOP'],
    link: 'https://triviachamp.onrender.com/',
    label: 'View Deployment',
  },
  {
    title: 'Personal Finance Analyzer',
    description: 'Analyzed messy bank statements using data cleaning and visualization to derive spending insights.',
    tags: ['Python', 'Pandas'],
    link: 'https://github.com/Noyoucringe/WhereIsMyMoneyGoing-.git',
    label: 'View Repository',
  },
  {
    title: 'Smart Campus Ecosystem',
    description: 'A web portal to streamline campus services, notices, and student interactions in one place.',
    tags: ['Web App', 'Full Stack'],
    link: 'https://github.com/Noyoucringe/Smart-Campus-Ecosystem-web',
    label: 'View Repository',
  },
  {
    title: 'PixelFlex',
    description: 'A Project for tracking the mental health of students in a college using this application.',
    tags: ['Web App'],
    link: 'https://github.com/Noyoucringe/pixelflex-app',
    label: 'View Repository',
  },
  {
    title: 'E-commerce Order Tracker',
    description: 'Real-time order tracking system using backend APIs and dynamic status updates.',
    tags: ['Node.js', 'REST API'],
    link: 'https://ecommerce-order-tracker-fedf.onrender.com/',
    label: 'View Deployment',
  },
  {
    title: 'Regression Model',
    description: 'Implemented a regression model with preprocessing, training, and evaluation for prediction tasks.',
    tags: ['Scikit-learn', 'NumPy'],
    link: 'Regression_Model_Notes.pdf',
    label: 'Model Notes',
  },
];

type FormStatus = 'idle' | 'sending' | 'success' | 'error';

function usePrefersReducedMotion(): boolean {
  const [prefers, setPrefers] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setPrefers(mediaQuery.matches);

    update();
    mediaQuery.addEventListener('change', update);
    return () => mediaQuery.removeEventListener('change', update);
  }, []);

  return prefers;
}

function useScrollVariables(prefersReducedMotion: boolean) {
  useEffect(() => {
    const root = document.documentElement;
    const header = document.querySelector('.site-header');

    const updateScrollVars = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const scrollHeight = root.scrollHeight - window.innerHeight;
      const progress = scrollHeight > 0 ? scrollY / scrollHeight : 0;

      root.style.setProperty('--scroll', `${scrollY}px`);
      root.style.setProperty('--progress', progress.toString());

      if (header) {
        header.classList.toggle('compact', scrollY > 20);
      }
    };

    updateScrollVars();

    const handler = prefersReducedMotion
      ? updateScrollVars
      : () => requestAnimationFrame(updateScrollVars);

    window.addEventListener('scroll', handler);
    window.addEventListener('resize', updateScrollVars);
    return () => {
      window.removeEventListener('scroll', handler);
      window.removeEventListener('resize', updateScrollVars);
    };
  }, [prefersReducedMotion]);
}

function useRevealAnimations(prefersReducedMotion: boolean) {
  useEffect(() => {
    const revealItems = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    if (prefersReducedMotion || revealItems.length === 0) {
      revealItems.forEach((item) => item.classList.add('is-visible'));
      return;
    }

    let lastScrollY = window.scrollY || window.pageYOffset;
    let initialRevealDone = false;

    const observer = new IntersectionObserver(
      (entries) => {
        const currentScrollY = window.scrollY || window.pageYOffset;
        const scrollingDown = currentScrollY > lastScrollY;

        entries.forEach((entry) => {
          if (!entry.isIntersecting || entry.target.classList.contains('is-visible')) {
            return;
          }

          const target = entry.target as HTMLElement;
          if (scrollingDown || !initialRevealDone) {
            target.classList.add('is-visible');
          } else {
            target.style.transition = 'none';
            target.classList.add('is-visible');
            requestAnimationFrame(() => {
              target.style.transition = '';
            });
          }
        });

        lastScrollY = currentScrollY;
        initialRevealDone = true;
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
    );

    revealItems.forEach((item) => {
      const delay = Number(item.dataset.delay || 0);
      if (delay) {
        item.style.transitionDelay = `${delay}ms`;
      }
      observer.observe(item);
    });

    revealItems.forEach((item) => {
      const rect = item.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        item.classList.add('is-visible');
      }
    });

    return () => observer.disconnect();
  }, [prefersReducedMotion]);
}

function useCursorGlow(prefersReducedMotion: boolean) {
  const glowRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const glow = glowRef.current;
    if (!glow) return;
    if (prefersReducedMotion) {
      glow.style.display = 'none';
      return;
    }

    let isTouch = false;

    const moveGlow = (x: number, y: number) => {
      glow.style.left = `${x}px`;
      glow.style.top = `${y}px`;
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (isTouch) return;
      glow.classList.remove('touch');
      glow.style.opacity = '0.35';
      moveGlow(event.clientX, event.clientY);
    };

    const handleMouseLeave = () => {
      if (!isTouch) {
        glow.style.opacity = '0';
      }
    };

    const handleTouchStart = (event: TouchEvent) => {
      isTouch = true;
      const touch = event.touches[0];
      if (!touch) return;
      glow.classList.add('touch');
      glow.style.opacity = '0.45';
      moveGlow(touch.clientX, touch.clientY);
    };

    const handleTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!touch) return;
      moveGlow(touch.clientX, touch.clientY);
    };

    const handleTouchEnd = () => {
      glow.style.opacity = '0';
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [prefersReducedMotion]);

  return glowRef;
}

function App() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const glowRef = useCursorGlow(prefersReducedMotion);

  useScrollVariables(prefersReducedMotion);
  useRevealAnimations(prefersReducedMotion);

  const [formStatus, setFormStatus] = useState<FormStatus>('idle');

  const scrollBehavior: ScrollBehavior = useMemo(
    () => (prefersReducedMotion ? 'auto' : 'smooth'),
    [prefersReducedMotion]
  );

  const handleNavClick = (targetId: string) => (event: React.MouseEvent) => {
    event.preventDefault();
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: scrollBehavior });
    }
  };

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    setFormStatus('sending');

    try {
      const response = await fetch('https://formspree.io/f/mdkwbgln', {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Submission failed');
      }

      setFormStatus('success');
      form.reset();
      setTimeout(() => setFormStatus('idle'), 2500);
    } catch (error) {
      console.error(error);
      setFormStatus('error');
      setTimeout(() => setFormStatus('idle'), 2500);
    }
  };

  const statusMessage = useMemo(() => {
    if (formStatus === 'sending') return 'Sending...';
    if (formStatus === 'success') return 'Message sent successfully.';
    if (formStatus === 'error') return 'Message failed. Please try again.';
    return '';
  }, [formStatus]);

  return (
    <>
      <div className="scroll-progress" aria-hidden="true">
        <span />
      </div>
      <div className="cursor-glow" aria-hidden="true" ref={glowRef} />

      <header className="site-header">
        <div className="brand">MEGHAMSH ANIRUDH</div>
        <nav className="site-nav">
          <a href="#work" onClick={handleNavClick('work')}>
            Work
          </a>
          <a href="#process" onClick={handleNavClick('process')}>
            Process
          </a>
          <a href="#projects" onClick={handleNavClick('projects')}>
            Projects
          </a>
          <a href="#contact" onClick={handleNavClick('contact')}>
            Contact
          </a>
        </nav>
        <a className="header-cta" href="/Anirudh_Resume.pdf" download>
          Download Resume
        </a>
      </header>

      <main>
        <section className="hero" id="top">
          <div className="hero-content" data-reveal>
            <p className="eyebrow">Student Developer</p>
            <h1 className="hero-title">Learning by building small, useful projects.</h1>
            <p className="hero-lead">
              I am a beginner who loves to explore software, solve problems, and improve with every project.
            </p>
            <div className="hero-cta">
              <a className="btn primary" href="#projects" onClick={handleNavClick('projects')}>
                View Projects
              </a>
              <a className="btn ghost" href="#contact" onClick={handleNavClick('contact')}>
                Let&apos;s Talk
              </a>
            </div>
            <div className="hero-stats">
              <div>
                <span className="stat-value">2+</span>
                <span className="stat-label">Years Learning</span>
              </div>
              <div>
                <span className="stat-value">5+</span>
                <span className="stat-label">Projects Built</span>
              </div>
              <div>
                <span className="stat-value">Intermediate</span>
                <span className="stat-label">Always Improving</span>
              </div>
            </div>
          </div>
          <div className="hero-visual" aria-hidden="true">
            <div className="visual-card top" data-reveal data-delay="150">
              <p className="visual-title">Learning Basics</p>
              <p className="visual-desc">Core programming, logic, and data structures.</p>
            </div>
            <div className="visual-card mid" data-reveal data-delay="300">
              <p className="visual-title">FullStack Practice</p>
              <p className="visual-desc">Clean layouts, simple interactions, and UI polish.</p>
            </div>
            <div className="visual-card bottom" data-reveal data-delay="450">
              <p className="visual-title">Project Mindset</p>
              <p className="visual-desc">Build, review, learn, and repeat.</p>
            </div>
          </div>
        </section>

        <section className="feature-rail" id="work">
          <div className="section-header" data-reveal>
            <p className="eyebrow">Focus Areas</p>
            <h2>What I&apos;m practicing right now.</h2>
          </div>
          <div className="feature-grid">
            {featureCards.map((card, index) => (
              <article key={card.title} className="feature-card" data-reveal data-delay={(index + 1) * 100}>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="process" id="process">
          <div className="section-header" data-reveal>
            <p className="eyebrow">Workflow</p>
            <h2>Simple steps I follow while learning.</h2>
          </div>
          <div className="process-grid">
            {processSteps.map((step, index) => (
              <div key={step.title} className="process-step" data-reveal data-delay={index * 150}>
                <span className="step-number">{step.step}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="projects" id="projects">
          <div className="section-header" data-reveal>
            <p className="eyebrow">Projects</p>
            <h2>Small builds that helped me learn.</h2>
          </div>
          <div className="projects-grid">
            {projects.map((project, index) => (
              <article key={project.title} className="project-card" data-reveal data-delay={index * 100}>
                <div className="project-meta">
                  {project.tags.map((tag) => (
                    <span className="project-tag" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <a className="project-link" href={project.link} target="_blank" rel="noopener noreferrer">
                  {project.label}
                </a>
              </article>
            ))}
          </div>
        </section>

        <section className="contact" id="contact">
          <div className="section-header" data-reveal>
            <p className="eyebrow">Contact</p>
            <h2>Let&apos;s build something simple together.</h2>
          </div>
          <div className="contact-grid">
            <div className="contact-card" data-reveal>
              <p className="contact-lead">I am available for internships and beginner-friendly collaborations.</p>
              <div className="contact-links">
                <a href="mailto:anirudhbittu77@gmail.com">anirudhbittu77@gmail.com</a>
                <a href="tel:+918639206379">+91 8639206379</a>
                <a href="https://github.com/Noyoucringe" target="_blank" rel="noopener noreferrer">
                  GitHub Profile
                </a>
                <a
                  href="https://www.linkedin.com/in/meghamsh-anirudh-pulivendala-02b371276/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn Profile
                </a>
                <a href="/Anirudh_Resume.pdf" download>
                  Download Resume
                </a>
              </div>
            </div>
            <form className="contact-form" data-reveal data-delay={150} onSubmit={handleFormSubmit}>
              <div className="form-row">
                <label htmlFor="name">Name</label>
                <input id="name" type="text" name="name" placeholder="Enter your name" required />
              </div>
              <div className="form-row">
                <label htmlFor="email">Email</label>
                <input id="email" type="email" name="email" placeholder="Enter your email" required />
              </div>
              <div className="form-row">
                <label htmlFor="message">Message</label>
                <textarea id="message" name="message" placeholder="Tell me about your project" rows={5} required />
              </div>
              <button type="submit" className="btn primary" disabled={formStatus === 'sending'}>
                {formStatus === 'sending' ? 'Sending...' : 'Send Message'}
              </button>
              <div className="form-status">{statusMessage}</div>
            </form>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <p>
          More projects on{' '}
          <a href="https://github.com/Noyoucringe" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          .
        </p>
        <p>© 2026, Designed and built by ANIRUDH</p>
      </footer>
    </>
  );
}

export default App;
