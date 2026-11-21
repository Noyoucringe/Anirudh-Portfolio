import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

export function useExhibitionMotion() {
  useEffect(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.utils.toArray<HTMLElement>('.chapter-title h2').forEach((title) => {
        gsap.from(title, {
          xPercent: -3,
          letterSpacing: '-.045em',
          ease: 'none',
          scrollTrigger: {
            trigger: title,
            start: 'top 95%',
            end: 'center 52%',
            scrub: true,
          },
        });
      });
      gsap.utils
        .toArray<HTMLElement>('.credential-grid details')
        .forEach((card) =>
          gsap.from(card, {
            rotationX: 13,
            transformPerspective: 600,
            y: 8,
            scrollTrigger: {
              trigger: card,
              start: 'top 95%',
              end: 'top 62%',
              scrub: true,
            },
          }),
        );
      gsap.utils.toArray<HTMLElement>('.timeline article').forEach((row) => {
        gsap.from(row, {
          rotationX: 9,
          x: 14,
          transformPerspective: 650,
          opacity: 0.55,
          scrollTrigger: {
            trigger: row,
            start: 'top 95%',
            end: 'center 70%',
            scrub: true,
          },
        });
      });
      gsap.fromTo(
        '.timeline',
        { '--journey': 0 },
        {
          '--journey': 1,
          ease: 'none',
          scrollTrigger: {
            trigger: '.timeline',
            start: 'top 75%',
            end: 'bottom 65%',
            scrub: true,
          },
        },
      );
      gsap.from('.contact h2', {
        clipPath: 'inset(0 0 65% 0)',
        scrollTrigger: {
          trigger: '.contact',
          start: 'top 95%',
          end: 'top 55%',
          scrub: true,
        },
      });
      const controls = new AbortController();
      gsap.utils.toArray<HTMLElement>('.scene-slot').forEach((slot) => {
        const kind = slot.dataset.scene;
        const steps = kind === 'skills' ? 6 : kind === 'method' ? 4 : 0;
        if (!steps) return;
        let last = -1,
          manual = false;
        const panel = slot.closest('.process-bench, .tool-explorer');
        panel?.addEventListener(
          'click',
          (event) => {
            if ((event.target as Element).closest('button,canvas'))
              manual = true;
          },
          { capture: true, signal: controls.signal },
        );
        const resume = () => {
          manual = false;
          last = -1;
        };
        ScrollTrigger.create({
          trigger: slot,
          start: 'top 76%',
          end: 'bottom 36%',
          onLeave: resume,
          onLeaveBack: resume,
          onUpdate: (self) => {
            if (manual) return;
            const step = Math.min(steps - 1, Math.floor(self.progress * steps));
            if (step !== last) {
              last = step;
              slot.dispatchEvent(new CustomEvent('change', { detail: step }));
            }
          },
        });
      });
      const grid = document.querySelector('.archive .disclosure-body');
      if (!grid) return () => controls.abort();
      const archiveMotion = gsap.fromTo(
        '.archive-card',
        { rotationX: 8, y: 14 },
        {
          rotationX: 0,
          y: 0,
          stagger: 0.045,
          duration: 0.38,
          paused: true,
          immediateRender: false,
        },
      );
      const observer = new MutationObserver(() => {
        if (grid.getAttribute('aria-hidden') === 'false')
          archiveMotion.restart();
      });
      observer.observe(grid, {
        attributes: true,
        attributeFilter: ['aria-hidden'],
      });
      return () => {
        observer.disconnect();
        controls.abort();
      };
    });
    return () => media.revert();
  }, []);
}
