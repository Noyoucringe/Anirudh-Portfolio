import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

export function useExhibitionMotion() {
  useEffect(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
      intro
        .from('.core-copy .instrument-label', {
          y: 8,
          opacity: 0.55,
          duration: 0.35,
        })
        .from(
          '.core-copy h1',
          { clipPath: 'inset(0 0 90% 0)', y: 12, duration: 0.65 },
          0.12,
        )
        .from('.core-actions', { y: 9, opacity: 0.45, duration: 0.4 }, 0.46);
      gsap.utils.toArray<SVGSVGElement>('.chapter-seam').forEach((seam) => {
        seam.querySelectorAll('path').forEach((path) =>
          gsap.to(path, {
            attr: { d: path.dataset.next ?? path.getAttribute('d') ?? '' },
            ease: 'none',
            scrollTrigger: {
              trigger: seam,
              start: 'top 95%',
              end: 'bottom 30%',
              scrub: true,
            },
          }),
        );
      });
      gsap.to('.core-copy h1', {
        scale: 0.43,
        y: -28,
        transformOrigin: 'left top',
        ease: 'none',
        scrollTrigger: {
          trigger: '#home',
          start: 'top top',
          end: '75% top',
          scrub: true,
        },
      });
      gsap.fromTo(
        '.site-header .wordmark span',
        { opacity: 0.25 },
        {
          opacity: 1,
          scrollTrigger: {
            trigger: '#home',
            start: 'top top',
            end: '40% top',
            scrub: true,
          },
        },
      );
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
      gsap.utils.toArray<HTMLElement>('.scene-slot').forEach((slot) => {
        const kind = slot.dataset.scene;
        const steps =
          kind === 'skills'
            ? 6
            : kind === 'method'
              ? 4
              : kind === 'winfix'
                ? 5
                : kind === 'qwen'
                  ? 6
                  : kind === 'sentinel'
                    ? 3
                    : 0;
        if (!steps) return;
        let last = -1;
        ScrollTrigger.create({
          trigger: slot,
          start: 'top 76%',
          end: 'bottom 36%',
          onUpdate: (self) => {
            const step = Math.min(steps - 1, Math.floor(self.progress * steps));
            if (step !== last) {
              last = step;
              slot.dispatchEvent(new CustomEvent('change', { detail: step }));
            }
          },
        });
      });
      const grid = document.querySelector('.archive .disclosure-body');
      if (!grid) return;
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
      return () => observer.disconnect();
    });
    return () => media.revert();
  }, []);
}
