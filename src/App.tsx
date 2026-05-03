import './App.css';
import { setupDebugGui } from './debug/debug';
import { Canvas } from './render/canvas/Canvas';

function App() {
  setupDebugGui();

  return (
    <>
      <Canvas />
    </>
  );
}

export default App;
