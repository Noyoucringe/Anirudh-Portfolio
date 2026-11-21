import { useExhibitionMotion } from './useExhibitionMotion';
import {
  Component,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei/core/PerspectiveCamera';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import * as T from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { buildModel, type Exhibit } from './models';

gsap.registerPlugin(ScrollTrigger);
class Guard extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}
function ObjectView({ slot }: { slot: HTMLElement }) {
  const kind = slot.dataset.scene as Exhibit;
  const { model, parts, dispose } = useMemo(() => buildModel(kind), [kind]);
  const { invalidate, gl, scene, camera, setDpr } = useThree();
  const keyLight = useRef<T.DirectionalLight>(null);
  const slowFrames = useRef(0);
  const pose = useRef({ progress: 0, yaw: 0, tilt: 0, entrance: 0 });
  useEffect(() => {
    const pmrem = new T.PMREMGenerator(gl),
      room = new RoomEnvironment(),
      texture = pmrem.fromScene(room, 0.035);
    scene.environment = texture.texture;
    scene.environmentIntensity = 0.58;
    room.dispose();
    pmrem.dispose();
    return () => {
      scene.environment = null;
      texture.dispose();
    };
  }, [gl, scene]);
  useEffect(() => dispose, [dispose]);
  useEffect(() => {
    const state = pose.current;
    Object.assign(state, { progress: 0, yaw: 0, tilt: 0, entrance: 1 });
    const media = gsap.matchMedia();
    media.add(
      {
        desktop: '(min-width: 800px)',
        mobile: '(max-width: 799px)',
        reduce: '(prefers-reduced-motion: reduce)',
      },
      (context) => {
        if (context.conditions?.reduce) {
          state.entrance = 1;
          invalidate();
          return;
        }
        gsap.to(state, {
          progress: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: slot,
            start: kind === 'core' ? 'top top' : 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
          onUpdate: invalidate,
        });
      },
    );
    let lastX: number | null = null;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const down = (e: PointerEvent) => {
      if ((e.target as HTMLElement).closest('button')) return;
      lastX = e.clientX;
      (e.target as Element).setPointerCapture(e.pointerId);
    };
    const move = (e: PointerEvent) => {
      if (lastX !== null) {
        state.yaw += (e.clientX - lastX) * 0.012;
        lastX = e.clientX;
      } else if (e.pointerType === 'mouse' && !reduced.matches) {
        state.tilt = (e.offsetX / slot.clientWidth - 0.5) * 0.15;
      }
      invalidate();
    };
    const up = () => {
      lastX = null;
    };
    const orbit = (e: Event) => {
      state.yaw += (e as CustomEvent).detail * 0.35;
      invalidate();
    };
    const observer = new MutationObserver(() => invalidate());
    observer.observe(slot, {
      attributes: true,
      attributeFilter: ['data-stage'],
    });
    slot.addEventListener('pointerdown', down);
    slot.addEventListener('pointermove', move);
    slot.addEventListener('lostpointercapture', up);
    slot.addEventListener('pointerup', up);
    slot.addEventListener('pointercancel', up);
    slot.addEventListener('orbit', orbit);
    invalidate();
    return () => {
      media.revert();
      observer.disconnect();
      slot.removeEventListener('pointerdown', down);
      slot.removeEventListener('pointermove', move);
      slot.removeEventListener('lostpointercapture', up);
      slot.removeEventListener('pointerup', up);
      slot.removeEventListener('pointercancel', up);
      slot.removeEventListener('orbit', orbit);
    };
  }, [slot, invalidate, kind]);
  useFrame((_, delta) => {
    // Ignore the long intervals between demand-rendered frames.
    if (delta > 0.038 && delta < 0.15) slowFrames.current++;
    else slowFrames.current = 0;
    if (slowFrames.current === 8 && gl.getPixelRatio() > 1) setDpr(1);
    const { progress, yaw, tilt, entrance } = pose.current,
      stage = Number(slot.dataset.stage);
    if (keyLight.current)
      keyLight.current.position.x = 2 + progress * 2 + tilt * 5;
    model.rotation.set(
      0.16 + progress * 0.12,
      -0.48 + yaw + tilt + progress * 0.95,
      kind === 'core' ? -0.23 : kind === 'contact' ? 0.29 : 0,
    );
    model.scale.setScalar(
      kind === 'qwen'
        ? 1 - 0.22 * progress
        : 0.94 + 0.06 * Math.sin(progress * Math.PI),
    );
    parts.forEach((part, i) => {
      const origin = part.userData.origin as T.Vector3;
      part.position.copy(origin);
      if (kind === 'core' || kind === 'contact')
        part.position.y +=
          Math.sign(origin.y) *
          ((1 - entrance) * 0.6 + (kind === 'core' ? progress * 0.6 : 0));
      else if (kind === 'qwen') {
        part.position.y +=
          origin.y * (progress * 0.45) + (i === stage ? 0.17 : 0);
        if (stage === 5) {
          part.scale.setScalar(0.68);
          part.position.set(i < 3 ? -0.86 : 0.86, ((i % 3) - 1) * 0.28, 0);
        } else {
          part.scale.setScalar(1);
          part.position.x = i === stage ? 0.27 : 0;
        }
      } else {
        part.scale.setScalar(i === stage ? 1.25 : 1);
        part.position.y += i === stage ? 0.18 : 0;
      }
    });
    camera.position.set(
      progress * 0.55,
      2.45 + progress * 0.22,
      5.1 - progress * 0.42,
    );
    const selected = parts[stage];
    if (kind === 'sentinel' && selected) {
      const point = selected.getWorldPosition(new T.Vector3());
      camera.lookAt(point.multiplyScalar(progress * 0.3));
    } else camera.lookAt(0, 0, 0);
  });
  return (
    <>
      <PerspectiveCamera makeDefault fov={38} position={[0, 2.45, 5.1]} />
      <ambientLight intensity={0.45} />
      <directionalLight ref={keyLight} position={[3, 6, 4]} intensity={2.15} />
      <directionalLight
        color="#79adff"
        position={[-4, 1, -2]}
        intensity={3.5}
      />
      <primitive
        object={model}
        dispose={null}
        onClick={(event: { object: T.Object3D }) => {
          const pick = event.object.parent?.userData.pick;
          if (typeof pick === 'number')
            slot.dispatchEvent(
              new CustomEvent('change', { detail: pick, bubbles: true }),
            );
        }}
      />
    </>
  );
}

export default function Exhibition() {
  useExhibitionMotion();
  const [host] = useState(() => document.createElement('div'));
  const [slot, setSlot] = useState<HTMLElement | null>(null);
  const [lost, setLost] = useState(false);
  useEffect(() => {
    host.className = 'webgl-host';
    const slots = Array.from(
      document.querySelectorAll<HTMLElement>('[data-scene]'),
    );
    let current: HTMLElement | null = null;
    let lastScroll = NaN;
    let geometry: { candidate: HTMLElement; top: number; height: number }[] =
      [];
    function measure() {
      geometry = slots.map((candidate) => {
        const rect = candidate.getBoundingClientRect();
        return { candidate, top: rect.top + scrollY, height: rect.height };
      });
      lastScroll = NaN;
    }
    // Probe once so unsupported browsers retain the blueprint and DOM controls.
    const probe = document.createElement('canvas').getContext('webgl2');
    if (!probe) return;
    probe.getExtension('WEBGL_lose_context')?.loseContext();
    function choose() {
      if (lastScroll === scrollY) return;
      lastScroll = scrollY;
      let best: HTMLElement | null = null,
        score = 0;
      for (const { candidate, top, height } of geometry) {
        const r = { top: top - lastScroll, bottom: top + height - lastScroll };
        const visible = Math.max(
          0,
          Math.min(innerHeight, r.bottom) - Math.max(0, r.top),
        );
        const weight =
          visible /
          (1 + Math.abs((r.top + r.bottom - innerHeight) / 2) / innerHeight);
        if (weight > score) {
          score = weight;
          best = candidate;
        }
      }
      if (best !== current) {
        current?.removeAttribute('data-rendering');
        current = best;
        if (best) {
          best.prepend(host);
          best.dataset.rendering = 'true';
        } else host.remove();
        setSlot(best);
      }
    }
    const resize = new ResizeObserver(measure);
    resize.observe(document.body);
    ScrollTrigger.addEventListener('refresh', measure);
    gsap.ticker.add(choose);
    measure();
    choose();
    return () => {
      current?.removeAttribute('data-rendering');
      host.remove();
      gsap.ticker.remove(choose);
      resize.disconnect();
      ScrollTrigger.removeEventListener('refresh', measure);
    };
  }, [host]);
  const [started, setStarted] = useState(false);
  useEffect(() => {
    if (slot) setStarted(true);
  }, [slot]);
  return started && !lost
    ? createPortal(
        <Guard>
          <Canvas
            frameloop="demand"
            dpr={[
              1,
              Math.min(window.devicePixelRatio, innerWidth < 800 ? 1.25 : 1.7),
            ]}
            gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
            onCreated={({ gl }) =>
              gl.domElement.addEventListener(
                'webglcontextlost',
                () => setLost(true),
                { once: true },
              )
            }
          >
            {slot && <ObjectView slot={slot} />}
          </Canvas>
        </Guard>,
        host,
      )
    : null;
}
