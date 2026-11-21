import * as T from 'three';

export type Exhibit = 'method' | 'skills';
type Point = [number, number, number];
const tau = Math.PI * 2;
export function buildModel(kind: Exhibit) {
  const model = new T.Group();
  const parts: T.Object3D[] = [];
  const metal = (color: string, metalness = 0.72, roughness = 0.28) =>
    new T.MeshStandardMaterial({ color, metalness, roughness });
  const silver = metal('#afbdd1'),
    graphite = metal('#293951'),
    cobalt = metal('#446bff');
  const lamp = new T.MeshStandardMaterial({
    color: '#b4edff',
    emissive: '#46c8ff',
    emissiveIntensity: 1.2,
  });
  const alarm = metal('#ff9370', 0.28);
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
  if (kind === 'skills') {
    const count = 6;
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
  } else {
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
      [silver, graphite, cobalt, lamp, alarm].forEach((m) => m.dispose());
    },
  };
}
