import type { Boid } from '../core/simulation/types';

export const world = {
  boids: [
    {
      x: 100,
      y: 100,
      xv: 2,
      yv: 1,
    } satisfies Boid,
  ],
};
