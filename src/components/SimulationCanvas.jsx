// components/SimulationCanvas.jsx
import React from 'react';
import { Canvas } from '@react-three/fiber'; // Asegúrate de que Canvas esté importado correctamente
import { OrbitControls, Environment } from '@react-three/drei'; // Para controles y ambiente
import useSimulationStore from '../stores/simulationStore';
import Vehicle from './Vehicle'; // Importar el componente de los vehículos

export default function SimulationCanvas() {
  const { vehiclesPositions, updateVehicles, lanes } = useSimulationStore();

  return (
    // El hook useFrame debe estar dentro de Canvas
    <Canvas camera={{ position: [0, 50, 100], fov: 60 }}>
      {/* Luces */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[100, 100, 100]} />

      {/* Ambiente (HDR) */}
      <Environment preset="city" />

      {/* OrbitControls para navegar la cámara 3D con mouse */}
      <OrbitControls minDistance={30} maxDistance={200} />

      {/* Carriles (simples planos grises) */}
      {[...Array(lanes)].map((_, i) => (
        <mesh
          key={i}
          rotation={[-Math.PI / 2, 0, 0]}  // poner plano horizontal
          position={[0, 0, i * 4 - (lanes*4)/2]}
        >
          <planeGeometry args={[200, 4]} />
          <meshStandardMaterial color="#333" />
        </mesh>
      ))}

      {/* Dibujar vehículos */}
      {vehiclesPositions.map((pos, i) => (
        <Vehicle key={i} position={pos} />
      ))}
    </Canvas>
  );
}
