import { useEffect, useRef } from 'react';
import {
  setupSimulation,
  updateSimulation,
} from '../../core/simulation/engine';
import { debugValues, world, worldValues } from '../../state/world';
import { Vector } from '../../core/math/vector';

export function Canvas() {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener('resize', resize);

    let frame: number;

    setupSimulation(canvas.height, canvas.width);

    let previousTimeStep = 0;

    const loop = (timeStep: number) => {
      const deltaTime = (timeStep - previousTimeStep) / 1000; // seconds
      previousTimeStep = timeStep;

      if (!debugValues.pause) {
        updateSimulation(deltaTime);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let index = 0; index < world.boids.length; index++) {
          const boid = world.boids[index];
          ctx.beginPath();

          const { front, left, right } = calculatTriangleCoordinates(
            boid.position,
            boid.direction,
            8,
          );

          ctx.moveTo(front.x, front.y);
          ctx.lineTo(right.x, right.y);
          ctx.lineTo(left.x, left.y);

          // TODO: If show neighbours is false, the else triggers every frame. You could improve performance by having it only happen
          //    when swappingfrom true to false.
          if (debugValues.showNeighbours) {
            if (index === 0) {
              ctx.fillStyle = '#87CEFA';
            } else if (boid.isNeighbour) {
              ctx.fillStyle = 'red';
            } else {
              ctx.fillStyle = '#121212';
            }
          } else {
            ctx.fillStyle = '#121212';
          }

          ctx.fill();
        }

        if (debugValues.neighbourRadius) {
          const boid = world.boids[0];
          ctx.beginPath();
          ctx.arc(
            boid.position.x,
            boid.position.y,
            worldValues.neighbourDistance,
            0,
            Math.PI * 2,
          );
          ctx.fillStyle = '#00000000';
          ctx.lineWidth = 2;
          ctx.strokeStyle = 'red';
          ctx.stroke();
          ctx.fill();
        }
      }

      frame = requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(frame);
    };
  }, []);

  return <canvas ref={ref} />;
}

function calculatTriangleCoordinates(
  position: Vector,
  direction: Vector,
  height: number,
): { front: Vector; left: Vector; right: Vector } {
  const front: Vector = position.add(direction.multiplyScalar(height));
  const back: Vector = position.subtract(direction.multiplyScalar(height));
  const left: Vector = back.add(
    direction.perpendicularAnticlockwise().multiplyScalar(height / 1.5),
  );
  const right: Vector = back.add(
    direction.perpendicularClockwise().multiplyScalar(height / 1.5),
  );

  return { front, left, right };
}
