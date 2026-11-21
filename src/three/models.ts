import { createStudy } from './sculptures';
export type Exhibit = 'method' | 'skills';
export const buildModel = (kind: Exhibit) =>
  createStudy(kind === 'method' ? 'plotter' : 'multitool');
