import './App.css';
import { getGUI } from './debug/debug';
import { Canvas } from './render/canvas/Canvas';

getGUI();

function App() {
  return (
    <>
      <Canvas />
    </>
  );
}

export default App;
