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
  borderAvoidanceStrength: 0.5,
  boidAvoidanceStrength: 0.5,
  alignmentStrength: 0.01,
  cohesionStrength: 0.01,
  separationDistance: 50,
  cohesionDistance: 100,
  alignmentDistance: 100,
};
