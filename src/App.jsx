import React, { useEffect } from 'react';
import useLoadCSV from './hooks/useLoadCSV';
import SimulationCanvas from './components/SimulationCanvas';
import ControlsPanel from './components/ControlsPanel';
import ChartsPanel from './components/ChartsPanel';
import './App.css';
import useSimulationStore from './stores/simulationStore';

function App() {
  useLoadCSV(); // Hook que maneja la carga del CSV y su estado

  // Obtener baseData desde zustand (estado global)
  const baseData = useSimulationStore(state => state.baseData);
  const weather = useSimulationStore(state => state.weather)

  // useEffect(() => {
  //   console.log("Base Data:", baseData); // Para verificar que los datos se cargaron correctamente
  // }, [baseData]);

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'row' }}>
      {/* Panel Izquierdo: Controles */}
      <div style={{ width: '35%', height: '100vh', marginRight: 16 }}>
        <ControlsPanel /> 
        <ChartsPanel />
      </div>

      {/* Canvas 3D al lado derecho */}
      <div style={{ width: '65%', height: '100vh', backgroundColor: weather == "sunny" ? "#8FCFFB" : weather == "rainy" ? "#87CEEB" : "#67AECB" }}>
        <SimulationCanvas />
      </div>
    </div>
  );
}

export default App;
