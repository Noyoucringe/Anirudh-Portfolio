import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import Beams from './Beams';
import ClickSpark from './ClickSpark';
import GlareHover from './GlareHover';
import CircularText from './CircularText';
import PillNav from './PillNav';
import GradualBlur from './GradualBlur';
import StarBorder from './StarBorder';
import TiltedCard from './TiltedCard';
import TextPressure from './TextPressure';
import './ShinyText.css';

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

const skillGroups = [
  {
    title: 'Programming Languages',
    items: [
      { name: 'C', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg' },
      { name: 'C++', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg' },
      { name: 'Java', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg' },
      { name: 'Python', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
      { name: 'Go', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg' },
    ],
  },
  {
    title: 'Web Development',
    items: [
      { name: 'JavaScript', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
      { name: 'TypeScript', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
      { name: 'React', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
      { name: 'HTML5', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg' },
      { name: 'CSS3', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg' },
      { name: 'Tailwind', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg' },
      { name: 'Node.js', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' },
    ],
  },
  {
    title: 'Databases & Tools',
    items: [
      { name: 'MySQL', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg' },
      { name: 'Firebase', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg' },
      { name: 'Supabase', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/supabase/supabase-original.svg' },
      { name: 'Git', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' },
      { name: 'GitHub', logo: 'https://cdn.simpleicons.org/github/FFFFFF' },
      { name: 'VS Code', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg' },
      { name: 'Linux', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg' },
    ],
  },
  {
    title: 'Design & Content',
    items: [
      { name: 'Figma', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg' },
      { name: 'Canva', logo: '/canva-logo.svg' },
    ],
  },
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
    title: 'SentinelAI',
    description: 'Web-based analytics platform that detects suspicious login behavior and identity theft using behavioral anomaly detection',
    tags: ['Cybersecurity'],
    link: 'https://sentinel-ai-flax.vercel.app/',
    label: 'View Deployment',
  },
];

const navItems = [
  { label: 'FOCUS AREAS', href: '#work' },
  { label: 'WORKFLOW', href: '#process' },
  { label: 'SKILLS', href: '#skills' },
  { label: 'PROJECTS', href: '#projects' },
  { label: 'CONTACT', href: '#contact' },
];

const transparentPixel = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';

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
  const heroRef = useRef<HTMLElement>(null);

  useScrollVariables(prefersReducedMotion);
  useRevealAnimations(prefersReducedMotion);

  const [formStatus, setFormStatus] = useState<FormStatus>('idle');
  const [activeNavIndex, setActiveNavIndex] = useState(0);
  const [isUserScrolling, setIsUserScrolling] = useState(false);

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

  useEffect(() => {
    const sectionIds = navItems.map((item) => item.href.replace('#', ''));
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section));

    if (sections.length === 0) return;

    let rafId = 0;

    const updateActiveFromScroll = () => {
      const header = document.querySelector('.site-header') as HTMLElement | null;
      const headerHeight = header?.offsetHeight ?? 0;
      const triggerY = headerHeight + window.innerHeight * 0.22;

      let nextActiveIndex = 0;

      sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= triggerY) {
          nextActiveIndex = index;
        }
      });

      setActiveNavIndex((prev) => (prev === nextActiveIndex ? prev : nextActiveIndex));
    };

    const onScrollOrResize = () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      rafId = requestAnimationFrame(updateActiveFromScroll);
    };

    updateActiveFromScroll();
    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize);

    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
    };
  }, []);

  useEffect(() => {
    let stopTimer: number | null = null;

    const onScroll = () => {
      setIsUserScrolling(true);
      if (stopTimer) {
        window.clearTimeout(stopTimer);
      }
      stopTimer = window.setTimeout(() => {
        setIsUserScrolling(false);
      }, 180);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (stopTimer) {
        window.clearTimeout(stopTimer);
      }
    };
  }, []);

  const handlePillNavSelect = (index: number, href: string, event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setActiveNavIndex(index);

    const id = href.replace('#', '');
    const target = document.getElementById(id);
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
      <div className="darkveil-layer" aria-hidden="true">
        <Beams
          beamWidth={5}
          beamHeight={21}
          beamNumber={20}
          lightColor="#ffffff"
          speed={2}
          noiseIntensity={1.55}
          scale={0.2}
          rotation={30}
        />
      </div>
      <ClickSpark sparkColor="#8b5cf6" sparkSize={15} sparkRadius={25} sparkCount={8} duration={400}>
      <div className="app-shell">
        <GradualBlur
          target="page"
          position="bottom"
          height="7rem"
          strength={2}
          divCount={5}
          curve="bezier"
          exponential
          opacity={1}
          className="scroll-bottom-blur"
          style={{
            opacity: isUserScrolling ? 1 : 0,
            transition: 'opacity 220ms ease-out',
          }}
        />
        <div className="corner-circular-text" aria-hidden="true">
          <CircularText
            text="MEGHAMSH*ANIRUDH*PORTFOLIO*"
            onHover="speedUp"
            spinDuration={20}
            className="corner-circular-text-inner"
          />
        </div>
        <div className="scroll-progress" aria-hidden="true">
        <span />
      </div>

      <header className="site-header">
        <PillNav
          logo="/logo-mark.svg"
          logoAlt="Meghamsh Anirudh Logo"
          items={navItems}
          activeHref={navItems[activeNavIndex]?.href}
          className="custom-nav"
          ease="power2.easeOut"
          baseColor="#000000"
          pillColor="#ffffff"
          hoveredPillTextColor="#ffffff"
          pillTextColor="#000000"
          initialLoadAnimation={false}
          onItemSelect={handlePillNavSelect}
        />
      </header>

      <main>
        <section className="hero" id="top" ref={heroRef}>
          <div className="hero-content" data-reveal>
            <p className="eyebrow">Student Developer</p>
            <div className="hero-pressure-wrap" aria-label="Learning by building small, useful projects.">
              <div className="hero-pressure-line">
                <TextPressure
                  text="LEARNING BY"
                  flex={false}
                  alpha={false}
                  stroke={false}
                  width={false}
                  weight
                  italic
                  textColor="#ffffff"
                  strokeColor="#5227FF"
                  minFontSize={52}
                />
              </div>
              <div className="hero-pressure-line">
                <TextPressure
                  text="BUILDING SMALL, USEFUL PROJECTS."
                  flex={false}
                  alpha={false}
                  stroke={false}
                  width={false}
                  weight
                  italic
                  textColor="#ffffff"
                  strokeColor="#5227FF"
                  minFontSize={52}
                />
              </div>
            </div>
            <p className="hero-lead">
              I am a beginner who loves to explore software, solve problems, and improve with every project.
            </p>
            <div className="hero-cta">
              <StarBorder
                as="a"
                href="#projects"
                onClick={handleNavClick('projects')}
                className="hero-star-btn hero-star-btn--primary"
                color="#c084fc"
                speed="5s"
              >
                View Projects
              </StarBorder>
              <StarBorder
                as="a"
                href="#contact"
                onClick={handleNavClick('contact')}
                className="hero-star-btn hero-star-btn--ghost"
                color="#8b5cf6"
                speed="5s"
              >
                Let&apos;s Talk
              </StarBorder>
            </div>
            <div className="hero-stats">
              <div>
                <span className="stat-value shiny-text">2+</span>
                <span className="stat-label">Years Learning</span>
              </div>
              <div>
                <span className="stat-value shiny-text">5+</span>
                <span className="stat-label">Projects Built</span>
              </div>
              <div>
                <span className="stat-value shiny-text">Intermediate</span>
                <span className="stat-label">Always Improving</span>
              </div>
            </div>
          </div>
          <div className="hero-visual" aria-hidden="true">
            <GlareHover
              width="100%"
              height="100%"
              glareColor="#ffffff"
              glareOpacity={0.22}
              glareAngle={-30}
              glareSize={320}
              transitionDuration={900}
              className="visual-card top"
              data-reveal
              data-delay="150"
            >
              <p className="visual-title">Learning Basics</p>
              <p className="visual-desc">Core programming, logic, and data structures.</p>
            </GlareHover>
            <GlareHover
              width="100%"
              height="100%"
              glareColor="#ffffff"
              glareOpacity={0.22}
              glareAngle={-30}
              glareSize={320}
              transitionDuration={900}
              className="visual-card mid"
              data-reveal
              data-delay="300"
            >
              <p className="visual-title">FullStack Practice</p>
              <p className="visual-desc">Clean layouts, simple interactions, and UI polish.</p>
            </GlareHover>
            <GlareHover
              width="100%"
              height="100%"
              glareColor="#ffffff"
              glareOpacity={0.22}
              glareAngle={-30}
              glareSize={320}
              transitionDuration={900}
              className="visual-card bottom"
              data-reveal
              data-delay="450"
            >
              <p className="visual-title">Project Mindset</p>
              <p className="visual-desc">Build, review, learn, and repeat.</p>
            </GlareHover>
          </div>
        </section>

        <section className="feature-rail" id="work">
          <div className="section-header" data-reveal>
            <div className="text-pressure-wrap work-title-pressure" aria-label="Focus Areas">
              <TextPressure
                text="FOCUS AREAS"
                flex={false}
                alpha={false}
                stroke={false}
                width={false}
                weight
                italic
                textColor="#ffffff"
                strokeColor="#5227FF"
                minFontSize={36}
                uppercase={false}
              />
            </div>
            <p className="work-subtitle">What I&apos;m practicing right now.</p>
          </div>
          <div className="feature-grid">
            {featureCards.map((card, index) => (
              <GlareHover
                key={card.title}
                width="100%"
                height="100%"
                glareColor="#ffffff"
                glareOpacity={0.2}
                glareAngle={-28}
                glareSize={300}
                transitionDuration={850}
                className="feature-card"
                data-reveal
                data-delay={(index + 1) * 100}
              >
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </GlareHover>
            ))}
          </div>
        </section>

        <section className="process" id="process">
          <div className="section-header" data-reveal>
            <div className="text-pressure-wrap work-title-pressure" aria-label="Workflow">
              <TextPressure
                text="WORKFLOW"
                flex={false}
                alpha={false}
                stroke={false}
                width={false}
                weight
                italic
                textColor="#ffffff"
                strokeColor="#5227FF"
                minFontSize={36}
                uppercase={false}
              />
            </div>
            <p className="work-subtitle">Simple steps I follow while learning.</p>
          </div>
          <div className="process-grid">
            {processSteps.map((step, index) => (
              <GlareHover
                key={step.title}
                width="100%"
                height="100%"
                glareColor="#ffffff"
                glareOpacity={0.2}
                glareAngle={-28}
                glareSize={300}
                transitionDuration={850}
                className="process-step"
                data-reveal
                data-delay={index * 150}
              >
                <span className="step-number">{step.step}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </GlareHover>
            ))}
          </div>
        </section>

        <section className="skills-section" id="skills">
          <div className="section-header skills-header" data-reveal>
            <p className="eyebrow">Skills</p>
            <div className="text-pressure-wrap skills-title-pressure" aria-label="Skills">
              <TextPressure
                text="SKILLS"
                flex={false}
                alpha={false}
                stroke={false}
                width={false}
                weight
                italic
                textColor="#ffffff"
                strokeColor="#5227FF"
                minFontSize={36}
                uppercase={false}
              />
            </div>
            <p className="skills-subtitle">The weapons I wield to build, ship, and solve.</p>
          </div>

          {skillGroups.map((group, groupIndex) => (
            <div className="skills-group" key={group.title} data-reveal data-delay={groupIndex * 80}>
              <h3 className="skills-group-title">{group.title}</h3>
              <div className="skills-grid">
                {group.items.map((item) => (
                  <article className="skill-card" key={item.name}>
                    <img src={item.logo} alt={item.name} loading="lazy" width={28} height={28} />
                    <span>{item.name}</span>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </section>

        <section className="projects" id="projects">
          <div className="section-header" data-reveal>
            <div className="text-pressure-wrap work-title-pressure" aria-label="Projects">
              <TextPressure
                text="PROJECTS"
                flex={false}
                alpha={false}
                stroke={false}
                width={false}
                weight
                italic
                textColor="#ffffff"
                strokeColor="#5227FF"
                minFontSize={36}
                uppercase={false}
              />
            </div>
            <p className="work-subtitle">Small builds that helped me learn.</p>
          </div>
          <div className="projects-grid">
            {projects.map((project, index) => (
              <div key={project.title} className="tilted-project-wrap" data-reveal data-delay={index * 100}>
                <TiltedCard
                  imageSrc={transparentPixel}
                  altText={project.title}
                  captionText={project.title}
                  containerHeight="100%"
                  containerWidth="100%"
                  imageHeight="100%"
                  imageWidth="100%"
                  rotateAmplitude={16}
                  scaleOnHover={1.06}
                  showMobileWarning={false}
                  showTooltip={false}
                  displayOverlayContent
                  overlayContent={
                    <article className="project-card tilted-project-content">
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
                  }
                />
              </div>
            ))}
          </div>
        </section>

        <section className="contact" id="contact">
          <div className="section-header" data-reveal>
            <div className="text-pressure-wrap work-title-pressure" aria-label="Contact">
              <TextPressure
                text="CONTACT"
                flex={false}
                alpha={false}
                stroke={false}
                width={false}
                weight
                italic
                textColor="#ffffff"
                strokeColor="#5227FF"
                minFontSize={36}
                uppercase={false}
              />
            </div>
            <p className="work-subtitle">Let&apos;s build something simple together.</p>
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
    </div>
    </ClickSpark>
    </>
  );
}

export default App;
