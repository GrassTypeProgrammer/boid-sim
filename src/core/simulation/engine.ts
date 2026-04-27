import { world } from '../../state/world';
import type { Boid, Vector } from './types';

// TODO: Get in a better way.
const MIN_DISTANCE: number = 150;

// TODO: have a restulf faux api to edit the bounds
export function setupSimulation(
  height: number,
  width: number,
  minX: number = 0,
  minY: number = 0,
) {
  world.bounds.min = { x: 0, y: 0 };
  world.bounds.height = height;
  world.bounds.width = width;
  world.bounds.max = { x: minX + width, y: minY + height };

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
    let steering: Vector = { x: boid.direction.x, y: boid.direction.y };
    steering = vectorAddition(steering, borderAvoidance(boid));
    steering = vectorAddition(steering, separation(boid));

    // Add all directions up and normalise once at the end, so all have equal weighting
    if (vectorMagnitude(steering) > 0) {
      boid.direction = normaliseVector(
        vectorAddition(boid.direction, steering),
      );
    }

    boid.direction = boid.velocity = scalarMultiplication(
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

function separation(boid: Boid): Vector {
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

  return steering;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function alignment(boid: Boid) {
  return boid;
}

function borderAvoidance(boid: Boid): Vector {
  // Improvement: Do the calculations before the pass the borders rather than after they pass them.
  let steering: Vector = { x: 0, y: 0 };

  const bounds = world.bounds;
  let distanceX: number = 1;
  const distanceY: number = 1;

  if (boid.position.x < bounds.min.x) {
    steering.x = bounds.min.x - boid.position.x;
    distanceX = boid.position.x - bounds.min.x;
  } else if (boid.position.x > bounds.max.x) {
    steering.x = bounds.max.x - boid.position.x;
    distanceX = boid.position.x - bounds.max.x;
  }

  if (boid.position.y < bounds.min.y) {
    steering.y = bounds.min.y - boid.position.y;
    distanceX = boid.position.y - bounds.min.y;
  } else if (boid.position.y > bounds.max.y) {
    steering.y = bounds.max.y - boid.position.y;
    distanceX = boid.position.y - bounds.max.y;
  }

  const weight = 1 / ((distanceX + distanceY) / 2);
  steering = normaliseVector(scalarMultiplication(steering, weight));

  return steering;
  // boid.direction = normaliseVector(
  //   vectorAddition(boid.direction, dirNormalised),
  // );
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
