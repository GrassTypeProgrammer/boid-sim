import GUI from 'lil-gui';
import { worldValues } from '../state/world';

const gui = new GUI();

export function setupDebugGui() {
  gui.add(worldValues, 'borderAvoidanceStrength', 0, 1);
  gui.show();
}
