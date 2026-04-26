import type { Boid, Bounds, World } from '../core/simulation/types';

export const world: World = {
  bounds: {
    minX: 0,
    minY: 0,
    maxX: 0,
    maxY: 0,
    width: 0,
    height: 0,
  } as Bounds,
  boids: [
    {
      x: 100,
      y: 100,
      xv: 2,
      yv: 1,
    } satisfies Boid,
  ],
};
