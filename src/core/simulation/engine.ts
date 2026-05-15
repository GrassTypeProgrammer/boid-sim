import { debugValues, world, worldValues } from '../../state/world';
import { Vector } from '../math/vector';
import type { Boid } from './types';

// TODO: Have another look at border avoidance. see the webpage about what they do. At least add a border avoidance deistance
// TODO: refine values so the sim looks good
// TODO: Add a bias so that they prefer to be with their own group (see webpage). give groups colours so you can tell.
// TODO: Change the number of boids on the fly in debug? or add a button to reset the sim when you change it.
// TODO: Make the boids triangles.
// TODO: Make boids selectable.
//    this means also changing the values for that boid. Eg: group it's in, speed?, etc...?
//    selected boid has x colour/outline. neighbours have different colour/outline. too close ones have red colour/outline (leaning towards outline).
// TODO: Add obstacles and obstacle avoidance.
// TODO: Improve spawning so they're not just in a line.
// TODO: allow size change.
// TODO: organise debug.
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
    for (let index = 0; index < 50; index++) {
      world.boids.push({
        position: new Vector(100, 100),
        velocity: new Vector(0, 0),
        direction: new Vector(2 + index * 10, 1),
        speed: 100,
        isNeighbour: false,
      });
    }
  }
}

export function updateSimulation(deltaTime: number) {
  // debug
  if (debugValues.showNeighbours) {
    setNeighbours(world.boids[0]);
  }

  for (const boid of world.boids) {
    let steering: Vector = new Vector(boid.direction.x, boid.direction.y);

    steering = steering.add(
      borderAvoidance(boid).multiplyScalar(worldValues.turnFactor),
    );
    steering = steering.add(
      separation(boid).multiplyScalar(worldValues.boidAvoidanceStrength),
    );

    steering = steering.add(
      cohesion(boid).multiplyScalar(worldValues.cohesionStrength),
    );

    steering = steering.add(
      alignment(boid).multiplyScalar(worldValues.alignmentStrength),
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

    if (distance <= worldValues.neighbourDistance) {
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
      // TODO: This wieghting has a big effect. if removed, you'll see what I mean. This is causing separation to behave differently to
      //      the others. Either they should all be weighted or none should (currently leaning towards none for now. When you add weighting
      //      to all, if should also be a debug value for how strong it is).
      // const weight = 1 / distance;
      // steering = steering.add(away.multiplyScalar(weight));
      steering = steering.add(away);
    }
  }

  return steering;
}

function alignment(boid: Boid) {
  // add all directions within range
  // divide by number of boids
  // get direction towards that point

  let destination: Vector = new Vector(0, 0).add(boid.position);
  let neighbours: number = 0;

  for (let index = 0; index < world.boids.length; index++) {
    const neighbour = world.boids[index];

    if (neighbour === boid) continue;

    const distance = boid.position.distance(neighbour.position);

    if (distance <= worldValues.neighbourDistance) {
      destination = destination.add(neighbour.direction);
      neighbours++;
    }
  }

  if (neighbours === 0) {
    return new Vector(0, 0);
  }

  destination = destination.divideScalar(neighbours);
  const steering: Vector = destination.subtract(boid.position).normalised();

  return steering;
}

function borderAvoidance(boid: Boid): Vector {
  const bounds = world.bounds;
  const margin = worldValues.borderMargin;
  let steering = new Vector(0, 0);

  // Left wall
  if (boid.position.x < bounds.min.x + margin) {
    const distance = bounds.min.x + margin - boid.position.x;
    steering = steering.add(new Vector(distance / margin, 0));
  }

  // Right wall
  if (boid.position.x > bounds.max.x - margin) {
    const distance = boid.position.x - (bounds.max.x - margin);
    steering = steering.subtract(new Vector(distance / margin, 0));
  }

  // Top wall
  if (boid.position.y < bounds.min.y + margin) {
    const distance = bounds.min.y + margin - boid.position.y;
    steering = steering.add(new Vector(0, distance / margin));
  }

  // Bottom wall
  if (boid.position.y > bounds.max.y - margin) {
    const distance = boid.position.y - (bounds.max.y - margin);
    steering = steering.subtract(new Vector(0, distance / margin));
  }

  return steering;
}

function setNeighbours(boid: Boid): void {
  for (let index = 0; index < world.boids.length; index++) {
    const neighbour = world.boids[index];

    if (neighbour === boid) {
      neighbour.isNeighbour = false;
      continue;
    }

    const distance = boid.position.distance(neighbour.position);

    if (distance <= worldValues.neighbourDistance) {
      neighbour.isNeighbour = true;
    } else {
      neighbour.isNeighbour = false;
    }
  }
}
