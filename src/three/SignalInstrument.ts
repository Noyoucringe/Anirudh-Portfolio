import * as T from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import gsap from 'gsap';
import { createStudy } from './sculptures';

const ids = ['home', 'sentinelai', 'winfix', 'qwen'];
const names = [
  'Knowledge Atlas',
  'Signal shield',
  'Modular system',
  'Attention study',
];
const kinds = ['atlas', 'sentinel', 'architecture', 'layers'] as const;
export function mountInstrument(host: HTMLElement) {
  const narrative = host.closest<HTMLElement>('.story')!;
  const surface = host.querySelector<HTMLElement>('.optics-surface')!;
  const caption = host.querySelector<HTMLElement>('figcaption strong')!;
  const readout = host.querySelector<HTMLElement>('.instrument-readout')!;
  const sections = ids.map((id) => document.getElementById(id)!);
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const abort = new AbortController(),
    opts = { signal: abort.signal };
  const poster = host.querySelector<HTMLImageElement>('.optics-plate')!;
  function showPoster() {
    const line = innerHeight * 0.34;
    let stage = 0;
    sections.forEach((section, i) => {
      if (section.getBoundingClientRect().top <= line) stage = i;
    });
    const url = '/art/' + kinds[stage] + '.webp';
    if (poster.getAttribute('src') !== url) poster.src = url;
    caption.textContent = names[stage];
    surface.setAttribute('aria-label', names[stage] + ' sculpture.');
  }
  function followWithPoster() {
    delete host.dataset.ready;
    showPoster();
    window.addEventListener('scroll', showPoster, { ...opts, passive: true });
    window.addEventListener('resize', showPoster, opts);
  }
  let renderer: T.WebGLRenderer;
  try {
    renderer = new T.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'low-power',
    });
  } catch {
    followWithPoster();
    return () => abort.abort();
  }
  const scene = new T.Scene(),
    camera = new T.PerspectiveCamera(35, 1, 0.1, 50);
  const studio = new RoomEnvironment(),
    baker = new T.PMREMGenerator(renderer),
    env = baker.fromScene(studio, 0.025);
  scene.environment = env.texture;
  scene.environmentIntensity = 0.78;
  studio.dispose();
  baker.dispose();
  renderer.setClearColor(0, 0);
  renderer.toneMapping = T.ACESFilmicToneMapping;
  const group = new T.Group();
  scene.add(group);
  const studies = {
    atlas: createStudy('atlas'),
    sentinel: createStudy('sentinel'),
    layers: createStudy('layers'),
    architecture: createStudy('architecture'),
  };
  Object.values(studies).forEach((study) => group.add(study.model));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = T.PCFSoftShadowMap;
  const key = new T.DirectionalLight('#fff0d9', 1.85),
    rim = new T.DirectionalLight('#8bb6ff', 1.05);
  key.position.set(-2, 5, 3);
  key.castShadow = true;
  key.shadow.mapSize.set(512, 512);
  Object.assign(key.shadow.camera, {
    left: -3,
    right: 3,
    top: 3,
    bottom: -3,
    near: 0.1,
    far: 13,
  });
  key.shadow.normalBias = 0.015;
  key.shadow.bias = -0.00025;
  key.shadow.camera.updateProjectionMatrix();
  rim.position.set(3, 2, -3);
  scene.add(key, rim);
  let px = 0,
    py = 0,
    ax = 0,
    ay = 0,
    orbit = 0,
    pitch = 0,
    lastFrame = -1;
  let extent: number[] = [],
    phase = 0,
    selection = 0,
    yaw = 0,
    tilt = 0,
    lastX = 0,
    lastY = 0,
    pointer: number | null = null,
    dirty = true,
    visible = true,
    lastLabel = -1,
    lost = false;
  surface.append(renderer.domElement);
  host.dataset.ready = 'true';
  let measuredWidth = 0,
    measuredHeight = 0,
    measuredDpr = 0;
  function measure() {
    const { width, height } = surface.getBoundingClientRect();
    const dpr = Math.min(devicePixelRatio, width < 500 ? 1.25 : 1.6);
    if (
      width !== measuredWidth ||
      height !== measuredHeight ||
      dpr !== measuredDpr
    ) {
      measuredWidth = width;
      measuredHeight = height;
      measuredDpr = dpr;
      renderer.setDrawingBufferSize(width, height, dpr);
      camera.aspect = width / Math.max(1, height);
      camera.updateProjectionMatrix();
    }
    extent = sections.map((el, i) =>
      i ? el.getBoundingClientRect().top + scrollY - innerHeight * 0.34 : 0,
    );
    dirty = true;
  }
  function draw(time = 0) {
    if (!visible || lost || document.hidden) return;
    let chapter = 0;
    while (chapter < 3 && scrollY >= extent[chapter + 1]) chapter++;
    const distance = chapter < 3 ? extent[chapter + 1] - scrollY : Infinity;
    const t = T.MathUtils.clamp(1 - distance / (innerHeight * 0.62), 0, 1);
    const next = chapter + (motion.matches ? 0 : t * t * (3 - 2 * t));
    if (
      !dirty &&
      next === phase &&
      (motion.matches || time - lastFrame < 1 / 30)
    )
      return;
    const smoothing = motion.matches
      ? 1
      : 1 - Math.exp(-Math.min(0.12, Math.max(0.012, time - lastFrame)) * 13);
    lastFrame = time;
    orbit += (yaw - orbit) * smoothing;
    pitch += (tilt - pitch) * smoothing;
    ax += (px - ax) * smoothing;
    ay += (py - ay) * smoothing;
    if (phase !== next) {
      phase = next;
      narrative.style.setProperty(
        '--bench-cross',
        String(T.MathUtils.smoothstep(phase, 2.05, 2.95)),
      );
    }
    dirty = false;
    const story = Math.round(phase);
    if (lastLabel !== story) {
      caption.textContent = names[story];
      surface.setAttribute(
        'aria-label',
        names[story] + '. Drag to rotate, or use the rotation buttons.',
      );
      lastLabel = story;
      selection = Number(
        sections[story]
          .querySelector('[data-selection]')
          ?.getAttribute('data-selection') || 0,
      );
    }
    const lo = Math.floor(phase),
      hi = Math.min(3, lo + 1),
      f = phase - lo;
    const idle = motion.matches ? 0 : time;
    for (const [kind, study] of Object.entries(studies)) {
      const weight =
        (kind === kinds[lo] ? 1 - f : 0) + (kind === kinds[hi] ? f : 0);
      study.model.visible = weight > 0.001;
      if (!study.model.visible) continue;
      study.model.scale.setScalar(weight * (kind === 'atlas' ? 1 : 1.04));
      study.model.position.set(
        (1 - weight) * (kind === kinds[lo] ? -0.8 : 0.8),
        -0.32 * (1 - weight),
        0,
      );
      study.animate(idle, selection, Math.min(1, phase));
    }
    group.position.y = Math.sin(idle * 0.72) * 0.025;
    group.rotation.set(
      pitch + ay * 0.05,
      -0.35 + orbit + ax * 0.08 + Math.sin(idle * 0.32) * 0.07,
      -0.025,
    );
    const d = Math.max(1.1, 1.38 / camera.aspect);
    camera.position.set(
      0.55 * d,
      (3.3 - 0.66 * Math.min(phase, 1)) * d,
      5.05 * d,
    );
    camera.lookAt(0, -0.53 + 0.57 * Math.min(phase, 1), 0);
    rim.position.x = 3 + ax * 0.65;
    renderer.render(scene, camera);
    const angle = Math.round(((yaw * 180) / Math.PI) % 360) + '°';
    if (readout.textContent !== angle) readout.textContent = angle;
  }
  surface.addEventListener(
    'pointerdown',
    (e) => {
      if (e.button !== 0) return;
      pointer = e.pointerId;
      lastX = e.clientX;
      lastY = e.clientY;
      surface.setPointerCapture(pointer);
    },
    opts,
  );
  surface.addEventListener(
    'pointermove',
    (e) => {
      if (pointer !== e.pointerId) {
        if (e.pointerType === 'mouse' && !motion.matches) {
          const r = surface.getBoundingClientRect();
          px = (2 * (e.clientX - r.left)) / r.width - 1;
          py = (2 * (e.clientY - r.top)) / r.height - 1;
          dirty = true;
        }
        return;
      }
      yaw += (e.clientX - lastX) * 0.012;
      tilt = T.MathUtils.clamp(tilt + (e.clientY - lastY) * 0.009, -1.1, 1.1);
      lastX = e.clientX;
      lastY = e.clientY;
      dirty = true;
    },
    opts,
  );
  surface.addEventListener(
    'lostpointercapture',
    () => {
      pointer = null;
    },
    opts,
  );
  surface.addEventListener(
    'pointerleave',
    () => {
      px = py = 0;
      dirty = true;
    },
    opts,
  );
  host.querySelectorAll<HTMLButtonElement>('button').forEach((b) =>
    b.addEventListener(
      'click',
      () => {
        yaw += (Number(b.value) * Math.PI) / 8;
        dirty = true;
      },
      opts,
    ),
  );
  document.addEventListener(
    'instrument-select',
    (e) => {
      selection = (e as CustomEvent<number>).detail;
      dirty = true;
    },
    opts,
  );
  motion.addEventListener(
    'change',
    () => {
      dirty = true;
    },
    opts,
  );
  renderer.domElement.addEventListener(
    'webglcontextlost',
    () => {
      lost = true;
      narrative.style.removeProperty('--bench-cross');
      caption.textContent = names[0];
      surface.setAttribute(
        'aria-label',
        'Open research notebook with an emerging neural network.',
      );
      followWithPoster();
    },
    opts,
  );
  const observer = new ResizeObserver(measure);
  observer.observe(surface);
  observer.observe(document.body);
  const intersect = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    dirty = true;
  });
  intersect.observe(host);
  measure();
  draw();
  gsap.ticker.add(draw);
  return () => {
    abort.abort();
    observer.disconnect();
    intersect.disconnect();
    gsap.ticker.remove(draw);
    Object.values(studies).forEach((study) => study.dispose());
    key.shadow.dispose();
    env.dispose();
    renderer.dispose();
    renderer.domElement.remove();
    delete host.dataset.ready;
    narrative.style.removeProperty('--bench-cross');
  };
}
