import { world } from '../../state/world';
import type { Boid } from './types';

// TODO: have a restulf faux api to edit the bounds
export function setupSimulation(
  height: number,
  width: number,
  minX: number = 0,
  minY: number = 0,
) {
  world.bounds.minX = minX;
  world.bounds.minY = minY;
  world.bounds.height = height;
  world.bounds.width = width;
  world.bounds.maxX = minX + width;
  world.bounds.maxY = minY + height;
}

export function updateSimulation(deltaTime: number) {
  for (const boid of world.boids) {
    boid.x += boid.xv;
    boid.y += boid.yv;
    borderAvoidance(deltaTime, boid);
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function cohesion(boid: Boid) {
  return boid;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function separation(boid: Boid) {
  return boid;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function alignment(boid: Boid) {
  return boid;
}

function borderAvoidance(deltaTime: number, boid: Boid) {
  // Improvement: Do the calculations before the pass the borders rather than after they pass them.
  const bounds = world.bounds;
  let dirX: number = 0;
  let dirY: number = 0;

  if (boid.x < bounds.minX) {
    dirX = bounds.minX - boid.x;
  } else if (boid.x > bounds.maxX) {
    dirX = bounds.maxX - boid.x;
  }

  if (boid.y < bounds.minY) {
    dirY = bounds.minY - boid.y;
  } else if (boid.y > bounds.maxY) {
    dirY = bounds.maxY - boid.y;
  }

  const dirNormalised = normaliseVector(dirX, dirY);
  boid.xv += dirNormalised.x * deltaTime;
  boid.yv += dirNormalised.y * deltaTime;
}

function normaliseVector(x: number, y: number): { x: number; y: number } {
  if (x === 0 && y === 0) return { x, y };

  const magnitude: number = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
  const normalX = x / magnitude;
  const normalY = y / magnitude;

  return { x: normalX, y: normalY };
}
