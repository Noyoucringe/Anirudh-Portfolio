import * as T from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import gsap from 'gsap';

const ids = ['home', 'sentinelai', 'winfix', 'qwen'];
const names = [
  'Optical encoder',
  'Event perimeter',
  'Diagnostic channels',
  'Adapter layers',
];
const count = 36;
const tau = 2 * Math.PI;

// Each machined vane survives all four configurations.
function layout(stage: number, i: number, selection: number) {
  const a = (i * tau) / count,
    bank = Math.floor(i / 6),
    n = i % 6;
  switch (stage) {
    case 0:
      return [
        1.32 * Math.cos(a),
        1.32 * Math.sin(a),
        0.17 * Math.sin(2 * a),
        0.24,
        0.5,
        a - 0.33,
        1,
      ];
    case 1:
      return [
        1.65 * Math.cos(a),
        1.65 * Math.sin(a),
        0.16 * Math.cos(a * 3),
        0.55,
        0.12,
        a + (i % 12 === (selection % 3) * 4 ? 0.5 : 0.06),
        0.69,
      ];
    case 2:
      return [
        (n - 2.5) * 0.53,
        (bank - 2.5) * 0.37,
        bank === selection ? 0.38 : 0,
        0.15,
        0.08,
        Math.PI / 2,
        0.54,
      ];
    default:
      return [
        ((n % 3) - 1) * 0.82 + (selection === 5 ? (n < 3 ? -0.43 : 0.43) : 0),
        (bank - 2.5) * 0.4,
        (n < 3 ? -0.34 : 0.34) + (bank === selection ? 0.16 : 0),
        1.3,
        0.07,
        0,
        0.74,
      ];
  }
}

export function mountInstrument(host: HTMLElement) {
  const narrative = host.closest<HTMLElement>('.story')!;
  const surface = host.querySelector<HTMLElement>('.optics-surface')!;
  const caption = host.querySelector<HTMLElement>('figcaption strong')!;
  const readout = host.querySelector<HTMLElement>('.instrument-readout')!;
  const sections = ids.map((id) => document.getElementById(id)!);
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const abort = new AbortController(),
    opts = { signal: abort.signal };
  let renderer: T.WebGLRenderer;
  try {
    renderer = new T.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'low-power',
    });
  } catch {
    return;
  }
  const scene = new T.Scene(),
    camera = new T.PerspectiveCamera(35, 1, 0.1, 50);
  const studio = new RoomEnvironment(),
    baker = new T.PMREMGenerator(renderer),
    env = baker.fromScene(studio, 0.025);
  scene.environment = env.texture;
  scene.environmentIntensity = 1.25;
  studio.dispose();
  baker.dispose();
  renderer.setClearColor(0, 0);
  renderer.toneMapping = T.ACESFilmicToneMapping;
  const group = new T.Group();
  scene.add(group);
  const blade = new T.Shape();
  blade.moveTo(-0.53, -0.055);
  blade.bezierCurveTo(-0.35, -0.29, 0.17, -0.26, 0.58, -0.11);
  blade.lineTo(0.69, 0.016);
  blade.bezierCurveTo(0.23, -0.02, -0.1, 0.07, -0.44, 0.16);
  blade.lineTo(-0.53, -0.055);
  const geo = new T.ExtrudeGeometry(blade, {
    depth: 0.11,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 1,
    bevelThickness: 0.034,
    bevelSize: 0.024,
    curveSegments: 8,
  });
  // Unroll the curved perimeter into a flat contact pad, preserving bevel topology.
  const positions = geo.getAttribute('position'),
    pad = positions.clone();
  for (let i = 0; i < pad.count; i++) {
    const x = positions.getX(i) - 0.055,
      y = positions.getY(i) + 0.065,
      z = positions.getZ(i);
    const angle = Math.atan2(y / 0.2, x / 0.63);
    const edge = z < 0 || z > 0.11 ? 0.96 : 1;
    pad.setXYZ(
      i,
      0.59 * edge * Math.sign(x) * Math.pow(Math.abs(Math.cos(angle)), 0.22),
      0.35 * edge * Math.sign(y) * Math.pow(Math.abs(Math.sin(angle)), 0.22),
      z,
    );
  }
  geo.morphAttributes.position = [pad];
  const mat = new T.MeshStandardMaterial({ metalness: 0.92, roughness: 0.23 });
  const vanes = new T.InstancedMesh(geo, mat, count);
  vanes.frustumCulled = false;
  group.add(vanes);
  const morph = new T.Mesh(geo, mat);
  const collarGeo = new T.TorusGeometry(0.88, 0.028, 8, 96);
  const collarMat = new T.MeshStandardMaterial({
    color: '#91a4bf',
    metalness: 0.88,
    roughness: 0.32,
  });
  const collar = new T.Mesh(collarGeo, collarMat);
  group.add(collar);
  const key = new T.DirectionalLight('#d8edff', 3.2),
    rim = new T.PointLight('#376dff', 29);
  key.position.set(-3, 4, 5);
  rim.position.set(2, -1, 2.4);
  scene.add(key, rim);
  const dummy = new T.Object3D(),
    color = new T.Color();
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
  function measure() {
    const { width, height } = surface.getBoundingClientRect();
    renderer.setPixelRatio(
      Math.min(devicePixelRatio, width < 500 ? 1.25 : 1.6),
    );
    renderer.setSize(width, height, false);
    camera.aspect = width / Math.max(1, height);
    camera.updateProjectionMatrix();
    extent = sections.map((el, i) =>
      i ? el.getBoundingClientRect().top + scrollY - innerHeight * 0.34 : 0,
    );
    dirty = true;
  }
  function draw() {
    if (!visible || lost) return;
    let chapter = 0;
    while (chapter < 3 && scrollY >= extent[chapter + 1]) chapter++;
    const distance = chapter < 3 ? extent[chapter + 1] - scrollY : Infinity;
    const t = T.MathUtils.clamp(1 - distance / (innerHeight * 0.62), 0, 1);
    const next = chapter + (motion.matches ? 0 : t * t * (3 - 2 * t));
    if (!dirty && next === phase) return;
    phase = next;
    // Cross the bench as the diagnostic channels settle into the model stack.
    narrative.style.setProperty(
      '--bench-cross',
      String(T.MathUtils.smoothstep(phase, 2.05, 2.95)),
    );

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
    for (let i = 0; i < count; i++) {
      const from = layout(lo, i, selection),
        to = layout(hi, i, selection);
      const v = from.map((x, k) => T.MathUtils.lerp(x, to[k], f));
      dummy.position.set(v[0], v[1], v[2]);
      dummy.rotation.set(v[3], v[4], v[5]);
      dummy.scale.setScalar(v[6]);
      dummy.updateMatrix();
      vanes.setMatrixAt(i, dummy.matrix);
      morph.morphTargetInfluences![0] = T.MathUtils.clamp(phase - 1, 0, 1);
      vanes.setMorphAt(i, morph);
      const selected =
        story === 1
          ? Math.floor(i / 12) === selection
          : story > 1
            ? Math.floor(i / 6) === selection
            : i % 12 < 3;
      color.set(selected ? '#4074ff' : i % 4 === 0 ? '#687c9c' : '#dde6f4');
      vanes.setColorAt(i, color);
    }
    if (vanes.morphTexture) vanes.morphTexture.needsUpdate = true;
    vanes.instanceMatrix.needsUpdate = true;
    if (vanes.instanceColor) vanes.instanceColor.needsUpdate = true;
    collar.scale.setScalar(Math.max(0.001, 1 - phase));
    collar.visible = phase < 1;
    group.rotation.set(
      -0.34 + tilt + 0.11 * phase,
      -0.47 + yaw + 0.19 * phase,
      0.22 - 0.11 * phase,
    );
    camera.position.set(
      0.28 * Math.sin(phase),
      0.22 * phase,
      Math.max(7.2, 6.3 / camera.aspect),
    );
    camera.lookAt(0, 0, 0);
    rim.position.x = 2 * Math.cos(phase);
    renderer.render(scene, camera);
    readout.textContent = Math.round(((yaw * 180) / Math.PI) % 360) + '°';
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
      if (pointer !== e.pointerId) return;
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
        'Optical encoder with 36 machined vanes.',
      );
      delete host.dataset.ready;
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
    geo.dispose();
    mat.dispose();
    collarGeo.dispose();
    collarMat.dispose();
    vanes.dispose();
    env.dispose();
    renderer.dispose();
    renderer.domElement.remove();
    delete host.dataset.ready;
    narrative.style.removeProperty('--bench-cross');
  };
}
