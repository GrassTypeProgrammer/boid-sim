import { useEffect, useRef } from 'react';
import {
  setupSimulation,
  updateSimulation,
} from '../../core/simulation/engine';
import { world } from '../../state/world';

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

      updateSimulation(deltaTime);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const boid of world.boids) {
        ctx.beginPath();
        ctx.arc(boid.x, boid.y, 5, 0, Math.PI * 2);
        ctx.fill();
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
