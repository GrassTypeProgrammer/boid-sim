import GUI from 'lil-gui';
import { worldValues } from '../state/world';

let gui: GUI | null = null;

export function getGUI() {
  if (!gui) {
    gui = new GUI();
    gui.add(worldValues, 'borderAvoidanceStrength', 0, 1);
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
