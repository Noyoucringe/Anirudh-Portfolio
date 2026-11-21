import * as T from 'three';

type Point = [number, number, number];
type Finish = 'graphite' | 'silver' | 'blue' | 'accent' | 'paper' | 'ink';
interface Bench {
  model: T.Group;
  palette: Record<Finish, T.Material>;
  assembly: (p: Point) => T.Group;
  remember: <G extends T.BufferGeometry>(g: G) => G;
  mesh: (
    parent: T.Object3D,
    g: T.BufferGeometry,
    m: T.Material,
    p: Point,
    size?: Point,
  ) => T.Mesh;
  rod: (
    parent: T.Object3D,
    a: Point,
    b: Point,
    r: number,
    m: T.Material,
  ) => void;
  cube: T.BufferGeometry;
}

export function buildInstrument(
  kind: 'sentinel' | 'plotter' | 'multitool',
  kit: Bench,
) {
  const { model, assembly, remember, mesh, rod, cube, palette: m } = kit;
  const box = (owner: T.Object3D, p: Point, s: Point, finish: Finish) =>
    mesh(owner, cube, m[finish], p, s);
  const cylinder = remember(new T.CylinderGeometry(1, 1, 1, 32));
  const disc = (
    owner: T.Object3D,
    p: Point,
    r: number,
    h: number,
    finish: Finish,
  ) => mesh(owner, cylinder, m[finish], p, [r, h, r]);
  if (kind === 'sentinel') {
    // Layered ballistic-profile enclosure around a physical signal-inspection lens.
    const outline = new T.Shape();
    outline.moveTo(0, 1.3);
    outline.quadraticCurveTo(0.5, 1.1, 1.05, 1.01);
    outline.lineTo(0.98, -0.11);
    outline.quadraticCurveTo(0.84, -0.8, 0, -1.4);
    outline.quadraticCurveTo(-0.84, -0.8, -0.98, -0.11);
    outline.lineTo(-1.05, 1.01);
    outline.quadraticCurveTo(-0.5, 1.1, 0, 1.3);
    const plate = remember(
      new T.ExtrudeGeometry(outline, {
        depth: 0.095,
        bevelThickness: 0.04,
        bevelSize: 0.04,
        bevelSegments: 2,
        curveSegments: 12,
      }),
    );
    mesh(model, plate, m.graphite, [0, 0, -0.22]);
    mesh(model, plate, m.silver, [0, 0, -0.05], [0.96, 0.96, 0.72]);
    mesh(model, plate, m.blue, [0, 0, 0.09], [0.91, 0.91, 0.52]);
    mesh(model, plate, m.graphite, [0, 0, 0.17], [0.84, 0.84, 0.4]);
    const ring = remember(new T.TorusGeometry(0.47, 0.061, 8, 48));
    mesh(model, ring, m.silver, [0, 0.3, 0.3]);
    const lens = remember(new T.SphereGeometry(1, 24, 12));
    mesh(model, lens, m.blue, [0, 0.3, 0.33], [0.404, 0.404, 0.17]);
    mesh(model, ring, m.accent, [0, 0.3, 0.474], [0.38, 0.38, 0.25]);
    for (let i = 0; i < 3; i++) {
      const x = (i - 1) * 0.46;
      const g = assembly([x, -0.57 + Math.abs(x) * 0.48, 0.26]);
      for (const dx of [-0.06, 0, 0.06]) {
        const end = -0.24 + Math.abs(x) * 0.12;
        rod(g, [dx, 0, 0], [dx, end, 0], 0.012, m.silver);
        rod(
          g,
          [dx, end, 0],
          [dx * 0.5 - x * 0.27, end - 0.14, 0],
          0.012,
          m.silver,
        );
      }
      box(g, [0, 0, 0], [0.24, 0.17, 0.09], 'ink');
      box(g, [0, 0.02, 0.061], [0.15, 0.038, 0.022], 'accent');
    }
    for (const side of [-1, 1]) {
      for (let i = 0; i < 4; i++) {
        const x = side * (0.57 + i * 0.058);
        rod(
          model,
          [x, 0.18, 0.245],
          [x, 0.6 + i * 0.05, 0.245],
          0.013,
          m.silver,
        );
        rod(
          model,
          [x, 0.6 + i * 0.05, 0.245],
          [x - side * 0.13, 0.73 + i * 0.05, 0.245],
          0.013,
          m.silver,
        );
      }
      for (const y of [0.84, -0.18]) {
        const bolt = disc(
          model,
          [side * (y > 0 ? 0.68 : 0.61), y, 0.245],
          0.048,
          0.038,
          'silver',
        );
        bolt.rotation.x = Math.PI / 2;
      }
    }
    const sweep = new T.Group();
    sweep.position.set(0, 0.3, 0.49);
    model.add(sweep);
    rod(sweep, [0, 0, 0], [0.27, 0.14, 0], 0.014, m.accent);
    model.rotation.x = -0.12;
    return (time: number, stage: number) => {
      sweep.rotation.z = stage * 1.75 + 0.17 * Math.sin(time * 0.8);
    };
  }
  if (kind === 'plotter') {
    // Each workflow step selects a physical station on the same marking bed.
    box(model, [0, -0.35, 0], [3.28, 0.19, 1.84], 'graphite');
    box(model, [0, -0.22, 0], [3.05, 0.05, 1.63], 'silver');
    box(model, [0, -0.16, 0], [2.83, 0.035, 1.39], 'paper');
    for (let i = 0; i < 4; i++) {
      const g = assembly([(i - 1.5) * 0.69, -0.13, 0]);
      for (let j = 0; j < 10; j++) {
        const z = (j - 4.5) * 0.119;
        const x = 0.2 * Math.sin(j * 0.75 + i * 0.63);
        rod(
          g,
          [x, 0.015, z],
          [0.2 * Math.sin((j + 1) * 0.75 + i * 0.63), 0.015, z + 0.119],
          0.012,
          m.blue,
        );
      }
      box(g, [0, -0.068, 0.83], [0.15, 0.056, 0.075], 'blue');
    }
    for (const z of [-0.83, 0.83]) {
      rod(model, [-1.45, 0.06, z], [1.45, 0.06, z], 0.044, m.silver);
      for (const x of [-1.48, 1.48])
        box(model, [x, -0.06, z], [0.16, 0.32, 0.19], 'graphite');
    }
    const carriage = new T.Group();
    model.add(carriage);
    for (const z of [-0.83, 0.83])
      box(carriage, [0, 0.14, z], [0.28, 0.27, 0.23], 'blue');
    for (const x of [-0.06, 0.06])
      rod(carriage, [x, 0.245, -0.83], [x, 0.245, 0.83], 0.032, m.silver);
    const nib = new T.Group();
    carriage.add(nib);
    box(nib, [0, 0.25, 0], [0.36, 0.19, 0.27], 'graphite');
    disc(nib, [0, 0.43, 0], 0.089, 0.28, 'silver');
    disc(nib, [0, 0.1, 0], 0.061, 0.22, 'blue');
    mesh(
      nib,
      remember(new T.ConeGeometry(0.048, 0.116, 16)),
      m.silver,
      [0, -0.067, 0],
    ).rotation.z = Math.PI;
    return (time: number, stage: number) => {
      carriage.position.x = (stage - 1.5) * 0.69;
      nib.position.z = 0.45 * Math.sin(time * 0.6);
      carriage.position.x += 0.17 * Math.sin(nib.position.z * 6 + stage * 0.63);
    };
  }
  // Six fold-out blades have different silhouettes and share one pivot.
  const pivot: Point = [0, -0.08, 0.83];

  const angles = [-1.03, -0.62, -0.21, 0.21, 0.62, 1.03];
  const blades = angles.map((angle, i) => {
    const group = assembly([pivot[0], pivot[1] + i * 0.039, pivot[2]]);
    group.rotation.y = angle;
    box(group, [0, 0, -0.77], [0.14, 0.065, 1.55], 'silver');
    box(group, [0, 0.038, -0.41], [0.078, 0.024, 0.48], 'blue');
    switch (i) {
      case 0:
        for (let j = -1; j <= 1; j++) {
          rod(group, [0, 0, -1.47], [j * 0.12, 0, -1.7], 0.027, m.silver);
          disc(group, [j * 0.12, 0, -1.71], 0.05, 0.07, 'blue');
        }
        break;
      case 1:
        box(group, [0, 0, -1.61], [0.29, 0.15, 0.3], 'graphite');
        for (const x of [-0.08, 0, 0.08])
          box(group, [x, 0, -1.82], [0.033, 0.077, 0.17], 'silver');
        break;
      case 2:
        mesh(
          group,
          remember(new T.ConeGeometry(0.103, 0.5, 6)),
          m.ink,
          [0, 0, -1.65],
        ).rotation.x = -Math.PI / 2;
        break;
      case 3:
        for (let j = 0; j < 4; j++)
          box(
            group,
            [0, 0, -1.47 - j * 0.1],
            [0.24 - j * 0.028, 0.11, 0.078],
            j % 2 ? 'blue' : 'silver',
          );
        break;
      case 4:
        for (const side of [-1, 1]) {
          rod(group, [0, 0, -1.38], [side * 0.14, 0, -1.56], 0.071, m.silver);
          rod(
            group,
            [side * 0.14, 0, -1.56],
            [side * 0.12, 0, -1.76],
            0.063,
            m.silver,
          );
        }
        break;
      case 5:
        box(group, [-0.07, 0, -1.57], [0.29, 0.1, 0.1], 'graphite');
        box(group, [-0.18, 0, -1.68], [0.06, 0.08, 0.22], 'silver');
        box(group, [0.04, 0, -1.7], [0.06, 0.08, 0.26], 'silver');
        break;
    }
    return group;
  });
  box(model, [0, -0.16, 0.52], [0.57, 0.15, 0.96], 'graphite');
  disc(model, [0, 0.18, 0.83], 0.19, 0.11, 'graphite');
  disc(model, [0, 0.25, 0.83], 0.13, 0.04, 'silver');
  box(model, [0, 0.281, 0.83], [0.13, 0.015, 0.028], 'ink');
  return (_time: number, stage: number) => {
    blades.forEach((blade, i) => {
      blade.rotation.x = i === stage ? 0.46 : 0.13;
    });
  };
}
