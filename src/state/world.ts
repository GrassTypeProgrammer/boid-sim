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
  turnFactor: 463,
  borderMargin: 100,
  boidAvoidanceStrength: 47,
  alignmentStrength: 30,
  cohesionStrength: 5,
  separationDistance: 16,
  neighbourDistance: 50,
  maxSpeed: 160,
  minSpeed: 120,
  maxForce: 110,
};

export const debugValues = {
  showNeighbours: true,
  pause: false,
  neighbourRadius: true,
};
