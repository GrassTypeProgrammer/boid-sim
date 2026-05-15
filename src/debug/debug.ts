import GUI from 'lil-gui';
import { debugValues, worldValues } from '../state/world';

let gui: GUI | null = null;

export function getGUI() {
  if (!gui) {
    gui = new GUI();
    gui.add(worldValues, 'turnFactor', 0, 1);
    gui.add(worldValues, 'borderMargin', 1, 100);

    gui.add(worldValues, 'boidAvoidanceStrength', 0, 1);
    gui.add(worldValues, 'separationDistance', 0, 200);

    gui.add(worldValues, 'cohesionStrength', 0, 0.5);
    gui.add(worldValues, 'cohesionDistance', 0, 200);

    gui.add(worldValues, 'alignmentDistance', 0, 200);
    gui.add(worldValues, 'alignmentStrength', 0, 0.5);

    gui.add(debugValues, 'showNeighbours');
    gui.add(debugValues, 'pause');
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
