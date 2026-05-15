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
  // turnFactor: 0.1,
  // borderMargin: 100,
  // boidAvoidanceStrength: 0.06,
  // alignmentStrength: 0.0265,
  // cohesionStrength: 0.033,
  // separationDistance: 15,
  // cohesionDistance: 100,
  // alignmentDistance: 100,
  turnFactor: 0.1,
  borderMargin: 100,
  boidAvoidanceStrength: 0.06,
  alignmentStrength: 0.265,
  cohesionStrength: 0.33,
  separationDistance: 15,
  cohesionDistance: 50,
  alignmentDistance: 50,
};
