import GUI from 'lil-gui';
import { debugValues, worldValues } from '../state/world';

let gui: GUI | null = null;

export function getGUI() {
  if (!gui) {
    gui = new GUI();
    const boidFolder = gui.addFolder('Boids');
    const borderFolder = boidFolder.addFolder('Borders');
    // TODO: Rename turnfactor and borderMargin
    borderFolder.add(worldValues, 'turnFactor', 0, 1000);
    borderFolder.add(worldValues, 'borderMargin', 1, 1000);

    const distanceFolder = boidFolder.addFolder('Distances');
    distanceFolder
      .add(worldValues, 'separationDistance', 0, 50)
      .name('Separation');
    distanceFolder
      .add(worldValues, 'neighbourDistance', 0, 200)
      .name('Neighbour');

    const strengthFolder = boidFolder.addFolder('Strengths');
    strengthFolder
      .add(worldValues, 'cohesionStrength', 0, 100)
      .name('Cohesion');
    strengthFolder
      .add(worldValues, 'boidAvoidanceStrength', 0, 100)
      .name('Boid Avoidance');
    strengthFolder
      .add(worldValues, 'alignmentStrength', 0, 100)
      .name('Alignment');

    const speedFolder = boidFolder.addFolder('Speed');
    speedFolder.add(worldValues, 'maxSpeed', 0, 1000);
    speedFolder.add(worldValues, 'minSpeed', 0, 1000);
    speedFolder.add(worldValues, 'maxForce', 0, 1000);

    const debugGui: GUI = gui.addFolder('Debug');
    debugGui.add(debugValues, 'showNeighbours');
    debugGui.add(debugValues, 'pause');
    debugGui.add(debugValues, 'neighbourRadius');
  }

  return gui;
}

// HMR cleanup for this module
if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    if (gui) {
      gui.destroy();
      gui = null;
    }
  });
}
