import { world } from '../../state/world';

export function updateSimulation() {
  for (const boid of world.boids) {
    boid.x += boid.xv;
    boid.y += boid.yv;
  }
}
