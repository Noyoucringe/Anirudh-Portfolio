import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { chapters, clamp } from './chapters';

gsap.registerPlugin(ScrollTrigger);
export function installRuler(rail: HTMLElement) {
  const scale = rail.querySelector<HTMLElement>('.scale-area')!;
  const words = Array.from(
    rail.querySelectorAll<HTMLAnchorElement>('.rail-words a'),
  );
  const ticks = Array.from(scale.querySelectorAll<HTMLElement>('.tick'));
  const readout = rail.querySelector('output')!;
  const destinations = chapters.map(([id]) => document.getElementById(id)!);
  const mode = matchMedia(
    '(min-width:1024px) and (pointer:fine) and (min-height:440px) and (prefers-reduced-motion:no-preference)',
  );
  let engine: Lenis | null = null,
    extent = 0,
    height = 0,
    top = 0,
    anchors: number[] = [],
    velocity = 0,
    lastY = scrollY,
    zoom = 0,
    overview = false,
    drag = false,
    lastProgress = -1,
    dirty = true,
    hoverTimer = 0,
    refreshTimer = 0;
  const abort = new AbortController(),
    opts = { signal: abort.signal };
  function measure() {
    extent = Math.max(0, document.documentElement.scrollHeight - innerHeight);
    const bounds = scale.getBoundingClientRect();
    height = bounds.height;
    top = bounds.top;
    anchors = destinations.map((el) =>
      clamp(
        (el.getBoundingClientRect().top + scrollY - 80) / Math.max(1, extent),
      ),
    );
    dirty = true;
  }
  function configure() {
    engine?.destroy();
    engine = null;
    if (mode.matches) {
      engine = new Lenis({ lerp: 0.12, autoRaf: false, syncTouch: false });
      engine.on('scroll', ScrollTrigger.update);
    }
    document.documentElement.classList.toggle('instrument-ready', mode.matches);
    rail.dataset.mode = mode.matches ? 'full' : 'compact';
    measure();
  }
  function seek(y: number, immediate = false) {
    if (engine) engine.scrollTo(y, { immediate });
    else window.scrollTo({ top: y, behavior: 'instant' });
  }
  function tick(time: number, delta: number) {
    engine?.raf(time * 1000);
    const y = scrollY,
      p = extent ? clamp(y / extent) : 0,
      dt = clamp(delta, 1, 64),
      weight = 1 - Math.exp(-dt / 70);
    const speed = Math.abs(y - lastY) / dt;
    lastY = y;
    const moving = Math.abs(speed - velocity) > 0.003;
    velocity += (speed - velocity) * weight;
    const goal = overview || drag ? 1 : 0;
    const morph = Math.abs(goal - zoom) > 0.001;
    zoom = morph ? zoom + (goal - zoom) * weight : goal;
    if (!dirty && !moving && !morph && p === lastProgress) return;
    dirty = false;
    lastProgress = p;
    const value = Math.round(100 * p);
    readout.textContent = String(value).padStart(3, '0') + '%';
    rail.style.setProperty('--progress', String(p));
    scale.setAttribute('aria-valuenow', String(value));
    if (!mode.matches) return;
    const span = height + (1 - zoom) * extent;
    for (let i = 0; i < ticks.length; i++) {
      const pos = p * height + (i / 100 - p) * span;
      const nearby =
        Math.max(0, 1 - Math.abs(pos - p * height) / 55) *
        Math.min(velocity * 0.18, 0.7);
      ticks[i].style.transform =
        'translateY(' + pos + 'px) scaleX(' + (1 + nearby) + ')';
      ticks[i].style.opacity = String(0.56 + Math.min(0.44, nearby));
    }
    rail.style.setProperty('--needle', p * height + 'px');
    const viewH = (innerHeight / (innerHeight + extent)) * height;
    rail.style.setProperty('--view-height', viewH + 'px');
    rail.style.setProperty('--view-top', (height - viewH) * p + 'px');
    let active = 0;
    anchors.forEach((a, i) => {
      if (p + 0.0004 >= a) active = i;
    });
    const gap = Math.min(26, height / (words.length + 5));
    const inset = 22;
    let prev = inset - gap;
    words.forEach((link, i) => {
      const upper = inset + i * gap;
      const lower = height - inset - (words.length - i) * gap;
      const riding = i === active;
      const position = riding
        ? clamp(p * height - gap, upper + (i > 0 ? gap * 0.72 : 0), lower)
        : i < active
          ? upper
          : lower;
      const map = clamp(anchors[i] * height, prev + gap, lower);
      prev = map;
      link.style.transform =
        'translateY(' +
        (position + (map - position) * zoom) +
        'px) scale(' +
        (riding ? 1.85 - 0.85 * zoom : 1) +
        ')';
      link.dataset.state =
        i < active ? 'stacked' : i === active ? 'riding' : 'queued';
      if (i === active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }
  function setOverview(on: boolean) {
    overview = on;
    rail.classList.toggle('overview', on);
    dirty = true;
  }
  function enter() {
    clearTimeout(hoverTimer);
    hoverTimer = window.setTimeout(() => setOverview(true), 150);
  }
  function leave() {
    clearTimeout(hoverTimer);
    if (!drag) setOverview(false);
  }
  function pointer(e: PointerEvent) {
    return clamp((e.clientY - top) / Math.max(1, height));
  }
  function move(e: PointerEvent) {
    const p = pointer(e);
    rail.style.setProperty('--ghost', p * height + 'px');
    if (drag) seek(p * extent, true);
  }
  scale.addEventListener(
    'pointerdown',
    (e) => {
      if (e.button !== 0) return;
      drag = true;
      scale.setPointerCapture(e.pointerId);
      seek(pointer(e) * extent, true);
      move(e);
    },
    opts,
  );
  scale.addEventListener('pointermove', move, opts);
  scale.addEventListener(
    'lostpointercapture',
    () => {
      drag = false;
      if (!rail.matches(':hover')) leave();
    },
    opts,
  );
  scale.addEventListener(
    'seek',
    (e) => seek((e as CustomEvent<number>).detail, true),
    opts,
  );
  rail.addEventListener('pointerenter', enter, opts);
  rail.addEventListener('pointerleave', leave, opts);
  function anchorClick(e: MouseEvent) {
    const a = (e.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
    if (
      !engine ||
      !a ||
      e.defaultPrevented ||
      e.button !== 0 ||
      e.ctrlKey ||
      e.metaKey ||
      e.altKey ||
      e.shiftKey
    )
      return;
    const el = document.getElementById(a.hash.slice(1));
    if (!el) return;
    e.preventDefault();
    if (location.hash !== a.hash) history.pushState(null, '', a.hash);
    const destination = () =>
      Math.max(
        0,
        el.getBoundingClientRect().top +
          scrollY -
          (a.hash === '#home' ? 0 : 80),
      );
    engine.scrollTo(destination(), {
      onComplete: () => seek(destination(), true),
    });
    if (!el.hasAttribute('tabindex')) el.tabIndex = -1;
    el.focus({ preventScroll: true });
  }
  document.addEventListener('click', anchorClick, opts);
  window.addEventListener(
    'popstate',
    () => {
      engine?.scrollTo(scrollY, { immediate: true });
    },
    opts,
  );
  mode.addEventListener('change', configure, opts);
  window.addEventListener('resize', measure, opts);
  const resize = new ResizeObserver(() => {
    measure();
    clearTimeout(refreshTimer);
    refreshTimer = window.setTimeout(() => {
      engine?.resize();
      ScrollTrigger.refresh();
      measure();
    }, 120);
  });
  resize.observe(document.body);
  configure();
  gsap.ticker.add(tick);
  return () => {
    abort.abort();
    resize.disconnect();
    clearTimeout(hoverTimer);
    clearTimeout(refreshTimer);
    gsap.ticker.remove(tick);
    engine?.destroy();
    document.documentElement.classList.remove('instrument-ready');
  };
}
