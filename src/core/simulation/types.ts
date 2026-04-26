export type World = {
  bounds: Bounds;
  boids: Boid[];
};

export type Boid = {
  x: number;
  y: number;
  xv: number;
  yv: number;
};

export type Bounds = {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  width: number;
  height: number;
};
