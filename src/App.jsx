import React, { useEffect } from 'react';
import useLoadCSV from './hooks/useLoadCSV';
import SimulationCanvas from './components/SimulationCanvas';
import ControlsPanel from './components/ui/ControlsPanel';
import ChartsPanel from './components/ui/ChartsPanel';
import './App.css';
import useSimulationStore from './stores/simulationStore';

function App() {
  useLoadCSV(); // Hook que maneja la carga del CSV y su estado

  const weather = useSimulationStore(state => state.weather)

  return (
    <div className={`app-container ${weather}`}>
      {/* Panel Izquierdo: Controles */}
      <div className="controls-panel">
        <ControlsPanel />
        <ChartsPanel />
      </div>

      {/* Canvas 3D  */}
      <div className="canvas-panel">
        <SimulationCanvas />
      </div>
    </div>
  );
}

export default App;
