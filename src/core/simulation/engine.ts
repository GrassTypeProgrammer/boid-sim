import { world, worldValues } from '../../state/world';
import { Vector } from '../math/vector';
import type { Boid } from './types';

// TODO: have a restulf faux api to edit the bounds
export function setupSimulation(
  height: number,
  width: number,
  minX: number = 0,
  minY: number = 0,
) {
  world.bounds.min = new Vector(0, 0);
  world.bounds.height = height;
  world.bounds.width = width;
  world.bounds.max = new Vector(minX + width, minY + height);

  if (world.boids.length === 0) {
    // TODO: Set these up better
    for (let index = 0; index < 50; index++) {
      world.boids.push({
        position: new Vector(100, 100),
        velocity: new Vector(0, 0),
        direction: new Vector(2 + index * 10, 1),
        speed: 100,
      });
    }
  }
}

export function updateSimulation(deltaTime: number) {
  for (const boid of world.boids) {
    let steering: Vector = new Vector(boid.direction.x, boid.direction.y);

    steering = steering.add(
      borderAvoidance(boid).multiplyScalar(worldValues.borderAvoidanceStrength),
    );

    steering = steering.add(
      separation(boid).multiplyScalar(worldValues.boidAvoidanceStrength),
    );

    steering = steering.add(
      cohesion(boid).multiplyScalar(worldValues.cohesionStrength),
    );

    // Add all directions up and normalise once at the end, so all have equal weighting
    if (steering.magnitude() > 0) {
      boid.direction = steering.add(boid.direction).normalised();
    }

    boid.velocity = boid.direction.multiplyScalar(boid.speed * deltaTime);
    boid.position = boid.position.add(boid.velocity);
  }
}

function cohesion(boid: Boid) {
  // add all positions
  // dived by number of boids
  // move towards that position.
  let center: Vector = new Vector(0, 0).add(boid.position);
  let neighbours: number = 0;

  for (let index = 0; index < world.boids.length; index++) {
    const neighbour = world.boids[index];

    if (neighbour === boid) continue;

    const distance = boid.position.distance(neighbour.position);

    if (distance <= worldValues.cohesionDistance) {
      center = center.add(neighbour.position);
      neighbours++;
    }
  }

  if (neighbours === 0) {
    return new Vector(0, 0);
  }

  center = center.divideScalar(neighbours);
  const steering: Vector = center.subtract(boid.position).normalised();

  return steering;
}

function separation(boid: Boid): Vector {
  // for the given boid, loop through the others to find the neighbours (if within x radius).
  // if closer than min distance, move away using a - b.
  let steering: Vector = new Vector(0, 0);

  for (let index = 0; index < world.boids.length; index++) {
    const neighbour = world.boids[index];
    if (neighbour === boid) continue;

    const distance = boid.position.distance(neighbour.position);

    if (distance <= worldValues.separationDistance) {
      const away = boid.position.subtract(neighbour.position).normalised();

      // weight by distance
      const weight = 1 / distance;
      steering = steering.add(away.multiplyScalar(weight));
    }
  }

  return steering;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function alignment(boid: Boid) {
  return boid;
}

function borderAvoidance(boid: Boid): Vector {
  const bounds = world.bounds;
  const MARGIN = 50;

  let steering = new Vector(0, 0);

  // Left wall
  if (boid.position.x < bounds.min.x + MARGIN) {
    const distance = bounds.min.x + MARGIN - boid.position.x;
    steering = steering.add(new Vector(distance / MARGIN, 0));
  }

  // Right wall
  if (boid.position.x > bounds.max.x - MARGIN) {
    const distance = boid.position.x - (bounds.max.x - MARGIN);
    steering = steering.subtract(new Vector(distance / MARGIN, 0));
  }

  // Top wall
  if (boid.position.y < bounds.min.y + MARGIN) {
    const distance = bounds.min.y + MARGIN - boid.position.y;
    steering = steering.add(new Vector(0, distance / MARGIN));
  }

  // Bottom wall
  if (boid.position.y > bounds.max.y - MARGIN) {
    const distance = boid.position.y - (bounds.max.y - MARGIN);
    steering = steering.subtract(new Vector(0, distance / MARGIN));
  }

  return steering;
}
