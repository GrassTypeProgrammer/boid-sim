import type { Bounds, World } from '../core/simulation/types';

export const world: World = {
  bounds: {
    min: { x: 0, y: 0 },
    max: { x: 0, y: 0 },
    width: 0,
    height: 0,
  } as Bounds,
  boids: [],
};

export const worldValues = {
  turnFactor: 0.2,
  borderMargin: 100,
  boidAvoidanceStrength: 0.05,
  alignmentStrength: 0.05,
  cohesionStrength: 0.0005,
  separationDistance: 16,
  neighbourDistance: 40,
};

export const debugValues = {
  showNeighbours: true,
  pause: false,
  neighbourRadius: true,
};
