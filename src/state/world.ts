import type { Bounds, World } from '../core/simulation/types';

export const world: World = {
  bounds: {
    minX: 0,
    minY: 0,
    maxX: 0,
    maxY: 0,
    width: 0,
    height: 0,
  } as Bounds,
  boids: [],
};
