import { world } from '../../state/world';
import type { Boid, Vector } from './types';

// TODO: Get in a better way.
const MIN_DISTANCE: number = 50;

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

  if (world.boids.length === 0) {
    // TODO: Set these up better
    for (let index = 0; index < 20; index++) {
      world.boids.push({
        position: { x: 100, y: 100 },
        velocity: { x: 0, y: 0 },
        direction: { x: 2 + index * 100, y: 1 },
        speed: 100,
      });
    }
  }
}

export function updateSimulation(deltaTime: number) {
  for (const boid of world.boids) {
    borderAvoidance(boid);
    separation(boid);
    boid.velocity = scalarMultiplication(
      boid.direction,
      boid.speed * deltaTime,
    );

    boid.position = vectorAddition(boid.position, boid.velocity);
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function cohesion(boid: Boid) {
  return boid;
}

function separation(boid: Boid) {
  // for the given boid, loop through the others to find the neighbours (if within x radius).
  // if closer than min distance, move away using a - b.
  let steering: Vector = { x: 0, y: 0 };

  for (let index = 0; index < world.boids.length; index++) {
    const neighbour = world.boids[index];
    if (neighbour === boid) continue;

    const distance = vectorDistance(boid.position, neighbour.position);

    if (distance <= MIN_DISTANCE) {
      const away = normaliseVector(
        vectorSubtraction(boid.position, neighbour.position),
      );

      // wieght by distance
      const weight = 1 / distance;
      steering = vectorAddition(steering, scalarMultiplication(away, weight));
    }
  }

  if (vectorMagnitude(steering) > 0) {
    boid.direction = normaliseVector(vectorAddition(boid.direction, steering));
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function alignment(boid: Boid) {
  return boid;
}

function borderAvoidance(boid: Boid) {
  // Improvement: Do the calculations before the pass the borders rather than after they pass them.
  const bounds = world.bounds;
  let dirX: number = 0;
  let dirY: number = 0;

  if (boid.position.x < bounds.minX) {
    dirX = bounds.minX - boid.position.x;
  } else if (boid.position.x > bounds.maxX) {
    dirX = bounds.maxX - boid.position.x;
  }

  if (boid.position.y < bounds.minY) {
    dirY = bounds.minY - boid.position.y;
  } else if (boid.position.y > bounds.maxY) {
    dirY = bounds.maxY - boid.position.y;
  }

  const dirNormalised = normaliseVector({ x: dirX, y: dirY });
  boid.direction = normaliseVector(
    vectorAddition(boid.direction, dirNormalised),
  );
}

function normaliseVector(vector: Vector): Vector {
  if (vector.x === 0 && vector.y === 0) return vector;

  const magnitude: number = vectorMagnitude(vector);
  const normalX = vector.x / magnitude;
  const normalY = vector.y / magnitude;

  return { x: normalX, y: normalY };
}

function vectorDistance(A: Vector, B: Vector): number {
  // sqr((A.x - B.x)^2 + (A.y - B.y)^2)
  const partA = Math.pow(A.x - B.x, 2);
  const partB = Math.pow(A.y - B.y, 2);
  const distance = Math.sqrt(partA + partB);
  return distance;
}

function vectorSubtraction(A: Vector, B: Vector): Vector {
  return { x: A.x - B.x, y: A.y - B.y };
}

function vectorAddition(A: Vector, B: Vector): Vector {
  return { x: A.x + B.x, y: A.y + B.y };
}

function scalarMultiplication(vector: Vector, scalar: number): Vector {
  return { x: vector.x * scalar, y: vector.y * scalar };
}

function vectorMagnitude(vector: Vector): number {
  return Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.y, 2));
}
