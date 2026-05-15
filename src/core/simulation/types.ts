import type { Vector } from '../math/vector';

export type World = {
  bounds: Bounds;
  boids: Boid[];
};

export type Boid = {
  position: Vector;
  velocity: Vector;
  direction: Vector;
  speed: number;
  isNeighbour: boolean;
};

export type Bounds = {
  min: Vector;
  max: Vector;
  width: number;
  height: number;
};
