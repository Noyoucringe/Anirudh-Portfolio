import * as T from 'three';
import { buildInstrument } from './instruments';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import {
  mergeGeometries,
  mergeVertices,
} from 'three/examples/jsm/utils/BufferGeometryUtils.js';

export type Study =
  | 'atlas'
  | 'layers'
  | 'architecture'
  | 'sentinel'
  | 'plotter'
  | 'multitool';
type XYZ = [number, number, number];
const v = (p: XYZ) => new T.Vector3(...p);
const steel = (color: string, metalness: number, roughness: number) =>
  new T.MeshStandardMaterial({ color, metalness, roughness });
function pagePrint(left: boolean) {
  const sheet = document.createElement('canvas');
  sheet.width = 512;
  sheet.height = 768;
  const c = sheet.getContext('2d')!;
  const paper = c.createLinearGradient(0, 0, 512, 0);
  paper.addColorStop(0, left ? '#f2efe3' : '#978e7b');
  paper.addColorStop(0.12, '#f1eddd');
  paper.addColorStop(0.88, '#f3efe2');
  paper.addColorStop(1, left ? '#a39a85' : '#ece5d5');
  c.fillStyle = paper;
  c.fillRect(0, 0, 512, 768);
  c.fillStyle = '#31485d';
  c.font = '16px monospace';
  c.fillText(
    left ? 'FIELD NOTES   /   01' : 'REPRESENTATIONS   /   02',
    40,
    60,
  );
  c.fillRect(40, 76, 432, 2);
  c.font = 'italic 42px Georgia';
  c.fillText(left ? 'Learning in layers' : 'Hidden states', 40, 148);
  c.lineWidth = 1;
  c.strokeStyle = '#cbd0c6';
  for (let x = 44; x <= 470; x += 24) {
    c.beginPath();
    c.moveTo(x, 208);
    c.lineTo(x, 525);
    c.stroke();
  }
  for (let y = 208; y <= 525; y += 24) {
    c.beginPath();
    c.moveTo(44, y);
    c.lineTo(470, y);
    c.stroke();
  }
  c.strokeStyle = '#41619a';
  c.lineWidth = 3;
  if (left) {
    c.beginPath();
    c.moveTo(79, 376);
    c.lineTo(438, 376);
    c.moveTo(257, 493);
    c.lineTo(257, 244);
    c.stroke();
    c.lineWidth = 5;
    c.beginPath();
    for (let i = 0; i <= 320; i++) {
      const x = (i - 160) / 40;
      const y = 376 - 82 * Math.tanh(x);
      if (!i) c.moveTo(97 + i, y);
      else c.lineTo(97 + i, y);
    }
    c.stroke();
  } else {
    const cols = [2, 4, 3];
    let prev: number[][] = [];
    cols.forEach((n, i) => {
      const pts = Array.from({ length: n }, (_, j) => [
        85 + 155 * i,
        367 + (j - (n - 1) / 2) * 58,
      ]);
      for (const [x, y] of pts) {
        for (const [a, b] of prev) {
          c.beginPath();
          c.moveTo(a, b);
          c.lineTo(x, y);
          c.stroke();
        }
      }
      for (const [x, y] of pts) {
        c.fillStyle = '#365782';
        c.beginPath();
        c.arc(x, y, 8, 0, Math.PI * 2);
        c.fill();
      }
      prev = pts;
    });
  }
  c.fillStyle = '#31485d';
  c.font = 'italic 28px Georgia';
  c.fillText(left ? 'y = tanh(x)' : 'h = σ(Wx + b)', 48, 583);
  c.fillStyle = '#74818a';
  c.font = '15px monospace';
  c.fillText(
    left ? '01   Activation function' : '02   Dense connections',
    48,
    635,
  );
  c.fillRect(40, 696, 432, 1);
  c.fillText(left ? '01' : '02', 440, 728);
  const texture = new T.CanvasTexture(sheet);
  texture.colorSpace = T.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}
// A closed, curved leaf with a printed top, underside and ivory fore-edge.
function leaf(
  side: number,
  spread: number,
  width: number,
  length: number,
  thickness: number,
) {
  const pos: number[] = [],
    uv: number[] = [],
    idx: number[] = [];
  const segments = 24;
  for (let face = 0; face < 2; face++)
    for (let j = 0; j <= segments; j++) {
      const u = j / segments,
        arch = 0.2 * Math.sin(Math.PI * u) ** 0.85 + 0.1 * u + spread * u;
      for (const z of [-1, 1]) {
        pos.push(
          side * (0.011 + u * width),
          arch - face * thickness,
          (z * length) / 2,
        );
        uv.push(side < 0 ? 1 - u : u, z < 0 ? 1 : 0);
      }
    }
  const offset = (segments + 1) * 2;
  function quad(a: number, b: number, c: number, d: number) {
    if (side > 0) idx.push(a, b, c, a, c, d);
    else idx.push(a, c, b, a, d, c);
  }
  for (let j = 0; j < segments; j++) {
    const k = j * 2;
    quad(k, k + 1, k + 3, k + 2);
    quad(k + offset, k + 2 + offset, k + 3 + offset, k + 1 + offset);
    quad(k, k + 2, k + 2 + offset, k + offset);
    quad(k + 1, k + 1 + offset, k + 3 + offset, k + 3);
  }
  quad(0, offset, offset + 1, 1);
  quad(offset - 2, offset - 1, 2 * offset - 1, 2 * offset - 2);
  const g = new T.BufferGeometry();
  g.setAttribute('position', new T.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new T.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

export function createStudy(kind: Study) {
  const model = new T.Group();
  model.name = {
    atlas: 'Knowledge Atlas',
    sentinel: 'Signal shield',
    plotter: 'Verification plotter',
    multitool: 'Engineering multitool',
    layers: 'Attention study',
    architecture: 'Modular system',
  }[kind];
  let drive: ((time: number, stage: number) => void) | void;
  let sketch: T.Group | undefined;
  const parts: T.Group[] = [],
    routes: T.Curve<T.Vector3>[] = [],
    pulses: T.Mesh[] = [];
  const graphite = steel('#283341', 0.6, 0.34),
    silver = steel('#aab7bd', 0.8, 0.27),
    blue = steel('#214ec0', 0.5, 0.29),
    paper = steel('#eaddc5', 0.01, 0.86),
    ink = steel('#596e93', 0.55, 0.43);
  const accent = new T.MeshStandardMaterial({
    color: '#91c8ff',
    metalness: 0.35,
    roughness: 0.26,
    emissive: '#387bd4',
    emissiveIntensity: 0.53,
  });
  const glass = new T.MeshStandardMaterial({
    color: '#90b4d8',
    transparent: true,
    opacity: 0.15,
    depthWrite: false,
    roughness: 0.27,
    metalness: 0.1,
    side: T.DoubleSide,
  });
  const materials: T.Material[] = [
      graphite,
      silver,
      blue,
      paper,
      ink,
      accent,
      glass,
    ],
    textures: T.Texture[] = [];
  const geometries = new Set<T.BufferGeometry>();
  const remember = <G extends T.BufferGeometry>(g: G) => {
    geometries.add(g);
    return g;
  };
  const contact = remember(new T.BoxGeometry());
  const dot = remember(new T.SphereGeometry(1, 12, 8)),
    pin = remember(new T.CylinderGeometry(1, 1, 1, 8)),
    cube = remember(new RoundedBoxGeometry(1, 1, 1, 2, 0.07));
  function mesh(
    parent: T.Object3D,
    g: T.BufferGeometry,
    m: T.Material,
    pos: XYZ,
    size: XYZ = [1, 1, 1],
  ) {
    const o = new T.Mesh(g, m);
    o.position.set(...pos);
    o.scale.set(...size);
    o.castShadow = !m.transparent;
    o.receiveShadow = true;
    parent.add(o);
    return o;
  }
  function rod(parent: T.Object3D, a: XYZ, b: XYZ, r: number, m: T.Material) {
    const d = v(b).sub(v(a));
    const o = mesh(parent, pin, m, v(a).lerp(v(b), 0.5).toArray() as XYZ, [
      r,
      d.length(),
      r,
    ]);
    o.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), d.normalize());
  }
  function node(parent: T.Object3D, pos: XYZ, r: number, m: T.Material) {
    return mesh(parent, dot, m, pos, [r, r, r]);
  }
  function assembly(pos: XYZ) {
    const group = new T.Group();
    group.position.set(...pos);
    group.userData.pick = parts.length;
    group.userData.origin = group.position.clone();
    parts.push(group);
    model.add(group);
    return group;
  }
  function path(points: XYZ[], width: number, m: T.Material, active = false) {
    const curve = new T.CatmullRomCurve3(points.map(v), false, 'centripetal');
    mesh(
      model,
      remember(new T.TubeGeometry(curve, 24, width, 5, false)),
      m,
      [0, 0, 0],
    );
    if (active) {
      routes.push(curve);
      pulses.push(node(model, points[0], 0.035, accent));
    }
  }
  if (kind === 'sentinel' || kind === 'plotter' || kind === 'multitool') {
    drive = buildInstrument(kind, {
      model,
      assembly,
      mesh,
      remember,
      rod,
      cube,
      palette: { blue, silver, ink, graphite, accent, paper },
    });
  } else if (kind === 'atlas') {
    const base = -0.75;
    for (const side of [-1, 1]) {
      const cover = mesh(
        model,
        cube,
        graphite,
        [side * 0.94, base - 0.11, 0],
        [1.95, 0.13, 2.58],
      );
      cover.rotation.z = side * 0.045;
      const lining = mesh(
        model,
        cube,
        blue,
        [side * 0.94, base - 0.035, 0],
        [1.91, 0.034, 2.55],
      );
      lining.rotation.z = side * 0.045;
      for (let i = 0; i < 6; i++) {
        const top = i === 5;
        let mat = paper;
        if (top) {
          const tex = pagePrint(side < 0);
          textures.push(tex);
          mat = new T.MeshStandardMaterial({
            map: tex,
            color: '#e1d5c2',
            roughness: 0.95,
          });
          materials.push(mat);
        }
        mesh(
          model,
          remember(
            leaf(
              side,
              i * 0.018,
              1.84 - i * 0.004,
              2.43 - i * 0.004,
              top ? 0.012 : 0.026,
            ),
          ),
          mat,
          [0, base + i * 0.027, 0],
        );
      }
    }
    mesh(model, cube, graphite, [0, base - 0.08, 0], [0.18, 0.18, 2.58]);
    const ribbon = mesh(
      model,
      cube,
      blue,
      [-0.2, base + 0.052, 1.31],
      [0.13, 0.018, 0.48],
    );
    ribbon.rotation.x = 0.36;
    // A 3–4–2 feed-forward sketch rises off its printed projection.
    sketch = new T.Group();
    model.add(sketch);
    const drawing = sketch;
    let prev: XYZ[] = [];
    [3, 4, 2].forEach((n, i) => {
      const pts: XYZ[] = Array.from({ length: n }, (_, j) => [
        0.24 + i * 0.55,
        0.02 + i * 0.34 + 0.14 * Math.cos(j * 1.4),
        (j - (n - 1) / 2) * 0.47,
      ]);
      for (const point of pts) {
        rod(drawing, [point[0], -0.43, point[2]], point, 0.006, ink);
        node(drawing, point, i === 1 ? 0.073 : 0.059, i === 1 ? blue : silver);
        for (const before of prev) rod(drawing, before, point, 0.011, accent);
      }
      prev = pts;
    });
  } else if (kind === 'layers') {
    const layers: XYZ[][] = [];
    for (let i = 0; i < 6; i++) {
      const x = (i - 2.5) * 0.59,
        group = assembly([x, 0, 0]);
      mesh(group, cube, glass, [0, 0, 0], [0.035, 1.52, 1.4]);
      for (const y of [-0.79, 0.79])
        rod(group, [0, y, -0.73], [0, y, 0.73], 0.018, silver);
      for (const z of [-0.73, 0.73])
        rod(group, [0, -0.79, z], [0, 0.79, z], 0.018, silver);
      const ports: XYZ[] = [];
      for (let j = 0; j < 4; j++) {
        const q = (j - 1.5) * 0.32;
        rod(group, [0, q, -0.65], [0, q, 0.65], 0.004, ink);
        rod(group, [0, -0.68, q], [0, 0.68, q], 0.004, ink);
        for (let k = 0; k < 4; k++) {
          const z = (k - 1.5) * 0.32;
          const focused = k === (i + j) % 4;
          mesh(
            group,
            contact,
            focused ? blue : silver,
            [0.028, q, z],
            [0.045, focused ? 0.115 : 0.052, focused ? 0.115 : 0.052],
          );
          if (focused) ports.push([x, q, z]);
        }
      }
      layers.push(ports);
    }
    for (let i = 0; i < 5; i++)
      for (let j = 0; j < 4; j++) {
        const a = layers[i][j],
          b = layers[i + 1][(j + i) % 4];
        rod(model, a, b, 0.009, j === 1 ? accent : ink);
        if (j === 1) {
          const curve = new T.LineCurve3(v(a), v(b));
          routes.push(curve);
          pulses.push(node(model, a, 0.04, accent));
        }
      }
  } else {
    // A gateway fans out to two workers; both route back to a shared store.
    const sites: XYZ[] = [
      [-1.25, 0.03, 0.57],
      [-0.39, 0.51, -0.57],
      [0.73, 0.12, 0.62],
      [1.25, 0.59, -0.6],
    ];
    for (let i = 0; i < 4; i++) {
      const g = assembly(sites[i]);
      mesh(g, cube, graphite, [0, -0.14, 0], [0.87, 0.13, 0.72]);
      mesh(g, cube, silver, [0, -0.06, 0], [0.82, 0.038, 0.67]);
      if (i === 3) {
        for (let j = 0; j < 3; j++)
          mesh(
            g,
            pin,
            j === 2 ? blue : graphite,
            [0, 0.04 + j * 0.115, 0],
            [0.295, 0.087, 0.295],
          );
      } else if (i === 0) {
        for (const x of [-0.22, 0.22])
          mesh(g, cube, blue, [x, 0.15, 0], [0.13, 0.42, 0.42]);
        mesh(g, cube, silver, [0, 0.36, 0], [0.56, 0.08, 0.42]);
      } else {
        mesh(
          g,
          cube,
          i === 1 ? blue : graphite,
          [0, 0.11, 0],
          [0.61, 0.26, 0.46],
        );
        for (let j = 0; j < 5; j++)
          mesh(g, cube, silver, [(j - 2) * 0.1, 0.28, 0], [0.037, 0.11, 0.42]);
      }
      mesh(g, cube, accent, [-0.26, -0.126, 0.363], [0.2, 0.022, 0.009]);
      for (const x of [-0.36, 0.36])
        for (const z of [-0.27, 0.27])
          mesh(g, pin, silver, [x, -0.029, z], [0.026, 0.02, 0.026]);
      mesh(g, pin, blue, [0, -0.214, 0], [0.12, 0.05, 0.12]);
    }
    for (const [source, target] of [
      [0, 1],
      [0, 2],
      [1, 3],
      [2, 3],
    ]) {
      const a = sites[source],
        b = sites[target];
      const mid = (a[0] + b[0]) / 2;
      path(
        [
          [a[0], a[1] - 0.23, a[2]],
          [a[0], a[1] - 0.39, a[2]],
          [mid, a[1] - 0.4, a[2]],
          [mid, b[1] - 0.4, b[2]],
          [b[0], b[1] - 0.39, b[2]],
          [b[0], b[1] - 0.23, b[2]],
        ],
        0.021,
        silver,
        true,
      );
    }
  }
  // Batch static pieces by assembly and material; keep selectable units and moving signals separate.
  for (const parent of [model, ...parts, ...(sketch ? [sketch] : [])]) {
    const batches = new Map<T.Material, T.Mesh[]>();
    for (const item of parent.children)
      if (
        item instanceof T.Mesh &&
        !pulses.includes(item) &&
        !item.material.transparent
      ) {
        const set = batches.get(item.material) ?? [];
        set.push(item);
        batches.set(item.material, set);
      }
    for (const [material, items] of batches) {
      if (items.length < 2) continue;
      const copies = items.map((item) => {
        item.updateMatrix();
        const g = item.geometry.index
          ? item.geometry.toNonIndexed()
          : item.geometry.clone();
        return g.applyMatrix4(item.matrix);
      });
      const combined = mergeGeometries(copies);
      copies.forEach((g) => g.dispose());
      if (combined) {
        items.forEach((item) => parent.remove(item));
        mesh(parent, remember(mergeVertices(combined)), material, [0, 0, 0]);
        combined.dispose();
      }
    }
  }
  return {
    model,
    parts,
    animate(time: number, selection: number, unfold = 0) {
      drive?.(time, selection);
      if (sketch) {
        sketch.scale.y = 1 + 0.55 * unfold;
        sketch.position.y = 0.43 * (sketch.scale.y - 1);
      }
      pulses.forEach((p, i) => {
        routes[i].getPointAt((time * 0.3 + i * 0.21) % 1, p.position);
      });
      parts.forEach((part, i) => {
        const chosen = i === selection % parts.length;
        part.scale.setScalar(chosen ? 1.045 : 1);
        part.position.y = part.userData.origin.y + (chosen ? 0.045 : 0);
      });
    },
    dispose() {
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      textures.forEach((t) => t.dispose());
    },
  };
}
