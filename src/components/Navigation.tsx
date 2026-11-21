import { useEffect, useRef, useState } from 'react';
import { navigation, profile } from '../data/profile';
import { Arrow, Mark } from './Primitives';

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const header = useRef<HTMLElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const top = document.getElementById('top-marker');
    if (!top) return;
    const observer = new IntersectionObserver(([entry]) =>
      setScrolled(!entry.isIntersecting),
    );
    const sections = navigation
      .map((item) => document.getElementById(item.id))
      .filter((node): node is HTMLElement => Boolean(node));
    const sectionObserver = new IntersectionObserver(
      () => {
        const position = window.innerHeight * 0.33;
        const current = sections.find((section) => {
          const bounds = section.getBoundingClientRect();
          return bounds.top <= position && bounds.bottom > position;
        });
        setActiveSection(current?.id ?? '');
      },
      { rootMargin: '-32% 0px -66% 0px' },
    );
    sections.forEach((section) => sectionObserver.observe(section));
    observer.observe(top);
    return () => {
      observer.disconnect();
      sectionObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      if (!header.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    const desktop = window.matchMedia('(min-width: 741px)');
    const onWidth = () => {
      if (desktop.matches) setOpen(false);
    };
    desktop.addEventListener('change', onWidth);
    document.addEventListener('pointerdown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      desktop.removeEventListener('change', onWidth);
      document.removeEventListener('pointerdown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <header
      ref={header}
      className={'site-header' + (scrolled || open ? ' solid' : '')}
      onBlur={(event) => {
        if (
          event.relatedTarget &&
          !header.current?.contains(event.relatedTarget as Node)
        )
          setOpen(false);
      }}
    >
      <div className="container nav-bar">
        <a
          className="wordmark"
          href="#home"
          onClick={() => setOpen(false)}
          aria-label="Meghamsh Anirudh, home"
        >
          <Mark />
          <span>Meghamsh Anirudh</span>
        </a>
        <button
          className="menu-toggle"
          ref={toggle}
          aria-expanded={open}
          aria-controls="site-navigation"
          onClick={() => setOpen(!open)}
        >
          {open ? 'Close' : 'Menu'}
          <span aria-hidden="true">{open ? '×' : '☰'}</span>
        </button>
        <nav
          id="site-navigation"
          aria-label="Main navigation"
          className={'nav-links' + (open ? ' is-open' : '')}
        >
          {navigation.map((item) => (
            <a
              key={item.id}
              aria-current={activeSection === item.id ? 'location' : undefined}
              href={'#' + item.id}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <a
            className="nav-resume"
            href={profile.resume}
            target="_blank"
            rel="noreferrer"
            onClick={() => setOpen(false)}
          >
            Résumé <Arrow direction="up-right" />
          </a>
        </nav>
      </div>
    </header>
  );
}
