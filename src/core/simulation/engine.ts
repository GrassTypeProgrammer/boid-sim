import { debugValues, world, worldValues } from '../../state/world';
import { Vector } from '../math/vector';
import type { Boid } from './types';

// TODO: Cap speed between a min and a max but otherwise allow it to be variable. This should help them look more organic
// TODO: Have another look at border avoidance. see the webpage about what they do. At least add a border avoidance deistance
// TODO: refine values so the sim looks good
// TODO: Add a bias so that they prefer to be with their own group (see webpage). give groups colours so you can tell.
// TODO: Change the number of boids on the fly in debug? or add a button to reset the sim when you change it.
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
    for (let index = 0; index < 500; index++) {
      world.boids.push({
        position: new Vector(100 + 10 * index, 100 + 10 * index),
        velocity: new Vector(400, 0),
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
    let velocity: Vector = boid.velocity;

    // velocity = velocity.add(separation(boid));
    // velocity = velocity.add(alignment(boid));
    // velocity = velocity.add(cohesion(boid));
    // velocity = velocity.add(borderAvoidance(boid));

    // boid.velocity = velocity;
    // boid.direction = boid.velocity.normalised();

    // const speed = boid.velocity.magnitude();
    // console.log('speed: ' + speed);
    // if (speed > MAX_SPEED) {
    //   boid.velocity = boid.velocity
    //     .divideScalar(speed)
    //     .multiplyScalar(MAX_SPEED);
    // } else if (speed < MIN_SPEED) {
    //   boid.velocity = boid.velocity
    //     .divideScalar(speed)
    //     .multiplyScalar(MIN_SPEED);
    // }

    // boid.position = boid.position.add(boid.velocity);

    let acceleration = new Vector(0, 0);

    acceleration = acceleration.add(separation(boid));
    acceleration = acceleration.add(alignment(boid));
    acceleration = acceleration.add(cohesion(boid));
    acceleration = acceleration.add(borderAvoidance(boid));

    acceleration = limit(acceleration, worldValues.maxForce);

    velocity = velocity.add(acceleration.multiplyScalar(deltaTime));
    velocity = limit(velocity, worldValues.maxSpeed, worldValues.minSpeed);

    boid.velocity = velocity;
    boid.direction = velocity.normalised();
    boid.position = boid.position.add(velocity.multiplyScalar(deltaTime));
  }
}

function limit(vector: Vector, max: number, min: number = 0): Vector {
  const magnitude = vector.magnitude();

  if (magnitude > max) {
    return vector.divideScalar(magnitude).multiplyScalar(max);
  } else if (magnitude < min) {
    return vector.divideScalar(magnitude).multiplyScalar(min);
  }

  return vector;
}

function cohesion(boid: Boid) {
  // add all positions
  // dived by number of boids
  // move towards that position.
  let averagePos: Vector = new Vector(0, 0);
  let neighbours: number = 0;

  for (let index = 0; index < world.boids.length; index++) {
    const neighbour = world.boids[index];

    if (neighbour === boid) continue;

    const distance = boid.position.distance(neighbour.position);

    if (distance <= worldValues.neighbourDistance) {
      averagePos = averagePos.add(neighbour.position);
      neighbours++;
    }
  }

  if (neighbours === 0) {
    return new Vector(0, 0);
  }

  averagePos = averagePos.divideScalar(neighbours);
  const velocity: Vector = averagePos
    .subtract(boid.position)
    .multiplyScalar(worldValues.cohesionStrength);

  return velocity;
}

function separation(boid: Boid): Vector {
  // for the given boid, loop through the others to find the neighbours (if within x radius).
  // if closer than min distance, move away using a - b.
  let velocity: Vector = new Vector(0, 0);
  let close: Vector = new Vector(0, 0);

  for (let index = 0; index < world.boids.length; index++) {
    const neighbour = world.boids[index];
    if (neighbour === boid) continue;

    const distance = boid.position.distance(neighbour.position);

    if (distance <= worldValues.separationDistance) {
      close = close.add(boid.position.subtract(neighbour.position));
      // weight by distance
      // TODO: This wieghting has a big effect. if removed, you'll see what I mean. This is causing separation to behave differently to
      //      the others. Either they should all be weighted or none should (currently leaning towards none for now. When you add weighting
      //      to all, if should also be a debug value for how strong it is).
      // const weight = 1 / distance;
      // steering = steering.add(away.multiplyScalar(weight));
      velocity = close.multiplyScalar(worldValues.boidAvoidanceStrength);
    }
  }

  return velocity;
}

function alignment(boid: Boid) {
  // add all directions within range
  // divide by number of boids
  // get direction towards that point

  let averageVelocity: Vector = new Vector(0, 0);
  let neighbours: number = 0;

  for (let index = 0; index < world.boids.length; index++) {
    const neighbour = world.boids[index];

    if (neighbour === boid) continue;

    const distance = boid.position.distance(neighbour.position);

    if (distance <= worldValues.neighbourDistance) {
      averageVelocity = averageVelocity.add(neighbour.velocity);
      neighbours++;
    }
  }

  if (neighbours === 0) {
    return new Vector(0, 0);
  }

  averageVelocity = averageVelocity.divideScalar(neighbours);
  const velocity: Vector = averageVelocity
    .subtract(boid.velocity)
    .multiplyScalar(worldValues.alignmentStrength);

  return velocity;
}

function borderAvoidance(boid: Boid): Vector {
  const bounds = world.bounds;
  const borderMargin = worldValues.borderMargin;

  let force = new Vector(0, 0);

  // Left wall
  const distanceFromLeftWall = boid.position.x - bounds.min.x;
  if (distanceFromLeftWall < borderMargin) {
    const strength = 1 - distanceFromLeftWall / borderMargin;
    force = force.add(new Vector(worldValues.turnFactor * strength, 0));
  }

  // Right wall
  const distanceFromRightWall = bounds.max.x - boid.position.x;
  if (distanceFromRightWall < borderMargin) {
    const strength = 1 - distanceFromRightWall / borderMargin;
    force = force.subtract(new Vector(worldValues.turnFactor * strength, 0));
  }

  // Top wall
  const distanceFromTopWall = boid.position.y - bounds.min.y;
  if (distanceFromTopWall < borderMargin) {
    const strength = 1 - distanceFromTopWall / borderMargin;
    force = force.add(new Vector(0, worldValues.turnFactor * strength));
  }

  // Bottom wall
  const distanceFromBottomWall = bounds.max.y - boid.position.y;
  if (distanceFromBottomWall < borderMargin) {
    const strength = 1 - distanceFromBottomWall / borderMargin;
    force = force.subtract(new Vector(0, worldValues.turnFactor * strength));
  }

  return force;
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
