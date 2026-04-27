export type World = {
  bounds: Bounds;
  boids: Boid[];
};

export type Boid = {
  position: Vector;
  velocity: Vector;
  direction: Vector;
  speed: number;
};

export type Bounds = {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  width: number;
  height: number;
};

export type Vector = {
  x: number;
  y: number;
};
