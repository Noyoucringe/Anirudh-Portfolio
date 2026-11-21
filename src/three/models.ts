import * as T from 'three';

export type Exhibit =
  | 'core'
  | 'sentinel'
  | 'winfix'
  | 'qwen'
  | 'method'
  | 'skills'
  | 'contact';
type Point = [number, number, number];
const tau = Math.PI * 2;
export function buildModel(kind: Exhibit) {
  const model = new T.Group();
  const parts: T.Object3D[] = [];
  const metal = (color: string, metalness = 0.72, roughness = 0.28) =>
    new T.MeshStandardMaterial({ color, metalness, roughness });
  const silver = metal('#afbdd1'),
    graphite = metal('#293951'),
    cobalt = metal('#446bff'),
    gold = metal('#cfad83');
  const lamp = new T.MeshStandardMaterial({
    color: '#b4edff',
    emissive: '#46c8ff',
    emissiveIntensity: 1.2,
  });
  const alarm = metal('#ff9370', 0.28),
    lavender = metal('#bc9bff', 0.45);
  const box = new T.BoxGeometry(),
    ball = new T.SphereGeometry(1, 16, 12),
    hex = new T.CylinderGeometry(1, 1, 1, 6),
    cylinder = new T.CylinderGeometry(1, 1, 1, 48);
  function mesh(
    parent: T.Object3D,
    geo: T.BufferGeometry,
    mat: T.Material,
    pos: Point,
    size: Point,
  ) {
    const obj = new T.Mesh(geo, mat);
    obj.position.set(...pos);
    obj.scale.set(...size);
    parent.add(obj);
    return obj;
  }
  function layer(pos: Point) {
    const group = new T.Group();
    group.position.set(...pos);
    group.userData.origin = group.position.clone();
    model.add(group);
    parts.push(group);
    return group;
  }
  function rod(
    parent: T.Object3D,
    a: Point,
    b: Point,
    r: number,
    mat: T.Material,
  ) {
    const start = new T.Vector3(...a),
      end = new T.Vector3(...b),
      delta = end.clone().sub(start);
    const obj = mesh(
      parent,
      cylinder,
      mat,
      start.lerp(end, 0.5).toArray() as Point,
      [r, delta.length(), r],
    );
    obj.quaternion.setFromUnitVectors(
      new T.Vector3(0, 1, 0),
      delta.normalize(),
    );
  }
  if (kind === 'core' || kind === 'contact') {
    // Cross-section of a six-jaw containment assembly, with an exposed optical core.
    mesh(
      model,
      new T.IcosahedronGeometry(1, 1),
      lamp,
      [0, 0.05, 0],
      [0.58, 0.78, 0.58],
    );
    for (const side of [-1, 1]) {
      const cap = layer([0, side * 0.94, 0]);
      mesh(cap, hex, graphite, [0, 0, 0], [1.35, 0.15, 1.35]);
      mesh(cap, hex, cobalt, [0, side * 0.11, 0], [1.24, 0.075, 1.24]);
      mesh(cap, hex, silver, [0, side * 0.19, 0], [1.32, 0.1, 1.32]);
      mesh(cap, hex, graphite, [0, side * 0.29, 0], [0.88, 0.14, 0.88]);
      mesh(cap, cylinder, lamp, [0, side * 0.38, 0], [0.39, 0.04, 0.39]);
      for (let i = 0; i < 6; i++) {
        const a = (tau * i) / 6;
        const x = 1.06 * Math.sin(a),
          z = 1.06 * Math.cos(a);
        mesh(cap, cylinder, gold, [x, side * 0.23, z], [0.087, 0.12, 0.087]);
        const jaw = mesh(
          cap,
          box,
          silver,
          [x, -side * 0.19, z],
          [0.25, 0.45, 0.34],
        );
        jaw.rotation.y = a;
      }
    }
    for (let i = 0; i < 6; i++) {
      const a = (tau * i) / 6,
        x = Math.sin(a) * 1.06,
        z = Math.cos(a) * 1.06;
      rod(model, [x, -0.83, z], [x, 0.83, z], 0.054, silver);
      mesh(model, cylinder, cobalt, [x, 0, z], [0.09, 0.44, 0.09]);
    }
    for (let i = 0; i < 4; i++) {
      const ring = mesh(
        model,
        new T.TorusGeometry(0.76, 0.021, 8, 64),
        i === 2 ? lamp : gold,
        [0, i * 0.18 - 0.25, 0],
        [1, 1, 1],
      );
      ring.rotation.x = Math.PI / 2;
    }
  } else if (kind === 'sentinel' || kind === 'skills') {
    const count = kind === 'skills' ? 6 : 9;
    mesh(model, hex, cobalt, [0, 0, 0], [0.45, 0.48, 0.45]);
    for (let i = 0; i < count; i++) {
      const a = (i * tau) / count;
      const p: Point = [
        1.65 * Math.cos(a),
        Math.sin(a * 2) * 0.48,
        1.3 * Math.sin(a),
      ];
      rod(model, [0, 0, 0], p, 0.024, silver);
      const group = layer(p);
      group.userData.pick = i;
      mesh(group, hex, graphite, [0, 0, 0], [0.26, 0.18, 0.26]);
      mesh(
        group,
        ball,
        i === 0 ? alarm : cobalt,
        [0, 0.15, 0],
        [0.13, 0.13, 0.13],
      );
      for (let j = 0; j < 3; j++) {
        const end: Point = [
          Math.cos(a + j * 0.55) * 0.46,
          0.25 + j * 0.12,
          Math.sin(a + j * 0.55) * 0.46,
        ];
        rod(group, [0, 0.1, 0], end, 0.013, silver);
        mesh(group, ball, lamp, end, [0.052, 0.052, 0.052]);
      }
    }
  } else if (kind === 'winfix') {
    mesh(model, box, graphite, [0, -0.45, 0], [3.2, 0.13, 1.85]);
    for (let i = 0; i < 5; i++) {
      const x = ((i % 3) - 1) * 0.96,
        z = i < 3 ? -0.38 : 0.45;
      const group = layer([x, -0.22, z]);
      group.userData.pick = i;
      mesh(group, box, cobalt, [0, 0, 0], [0.78, 0.18, 0.63]);
      for (let j = 0; j < 7; j++)
        mesh(
          group,
          box,
          silver,
          [(j - 3) * 0.098, 0.18, 0],
          [0.044, 0.32, 0.55],
        );
      rod(model, [x, -0.36, z], [x, -0.36, 0.82], 0.023, gold);
      mesh(group, ball, lamp, [0.34, 0.12, 0.28], [0.05, 0.05, 0.05]);
    }
  } else if (kind === 'method') {
    const corners: Point[] = [
      [-1.15, 0, -0.55],
      [0.95, 0.45, -0.7],
      [1.05, 0, 0.63],
      [-0.88, -0.28, 0.76],
    ];
    corners.forEach((pos, i) => {
      rod(model, pos, corners[(i + 1) % 4], 0.05, silver);
      const station = layer(pos);
      station.userData.pick = i;
      mesh(station, hex, graphite, [0, 0, 0], [0.38, 0.18, 0.38]);
      mesh(
        station,
        i === 0 ? ball : i === 1 ? hex : box,
        i === 3 ? lamp : cobalt,
        [0, 0.25, 0],
        [0.26, 0.3, 0.26],
      );
    });
  } else {
    const count = 6;
    for (let i = 0; i < count; i++) {
      const group = layer([0, (i - (count - 1) / 2) * 0.32, 0]);
      group.userData.pick = i;
      mesh(
        group,
        box,
        i === 3 ? lavender : graphite,
        [0, 0, 0],
        [2.25, 0.15, 1.45],
      );
      mesh(
        group,
        box,
        i === 3 ? lamp : cobalt,
        [0, 0.09, 0],
        [2.16, 0.035, 1.36],
      );
      for (let j = 0; j < 6; j++)
        mesh(
          group,
          box,
          silver,
          [((j % 3) - 1) * 0.55, 0.13, j < 3 ? -0.28 : 0.28],
          [0.36, 0.055, 0.29],
        );
    }
  }
  const geometries = new Set<T.BufferGeometry>([box, ball, hex, cylinder]);
  model.traverse((o) => {
    if (o instanceof T.Mesh) geometries.add(o.geometry);
  });
  return {
    model,
    parts,
    dispose() {
      geometries.forEach((g) => g.dispose());
      [silver, graphite, cobalt, gold, lamp, alarm, lavender].forEach((m) =>
        m.dispose(),
      );
    },
  };
}
