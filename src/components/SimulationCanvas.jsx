import React, { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import useSimulationStore from '../stores/simulationStore';
import { OrbitControls, Environment } from '@react-three/drei';
import SimulationUpdater from './SimulationUpdater';
import MarksPlane from './three/MarksPlane';
import BuildingsPlane from './three/BuildingsPlane';


export default function SimulationCanvas() {
  const { lanes, laneWidth, isRunning } = useSimulationStore();
  const activateVehicle = useSimulationStore((state) => state.activateVehicle);

  useEffect(() => {
    // Activar 1 vehículo para empezar
    activateVehicle();
  }, [activateVehicle]);

  return (
    <Canvas camera={{ position: [0, 50, 100], fov: 60 }}>
      {/* Luces */}
      <directionalLight position={[100, 100, 100]} />

      {/* Ambiente (HDR) */}
      <Environment preset="city" />

      {/* OrbitControls para navegar la cámara 3D con mouse */}
      <OrbitControls
        minDistance={30}
        maxDistance={100}
        minPolarAngle={Math.PI / 11}
        maxPolarAngle={Math.PI / 3}
        minAzimuthAngle={-Math.PI / 3}
        maxAzimuthAngle={Math.PI / 3}
        enablePan={false}
      />

      {/* Ground */}
      <mesh
        key={"ground"}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.1, 200 + laneWidth / 2]}
      >
        <planeGeometry args={[2000, 400]} />
        <meshStandardMaterial color="black" />
      </mesh>

      {/* marcas */}
      <MarksPlane />

      {/* Edificios */}
      <BuildingsPlane />

      {/* Carriles */}
      {[...Array(lanes)].map((_, i) => (
        <mesh
          key={i}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0, 0 - i * laneWidth]}
        >
          <planeGeometry args={[600, laneWidth]} />
          <meshStandardMaterial color={i % 2 === 0 ? "#023408" : "#224418"} />
        </mesh>
      ))}

      {/* Carril transmi */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0 - lanes * laneWidth]}
      >
        <planeGeometry args={[600, laneWidth]} />
        <meshStandardMaterial color="red" />
      </mesh>

      {/* Lógica de simulación con instanced mesh */}
      {isRunning ? <SimulationUpdater /> : null}
    </Canvas>
  );
}
