// components/SimulationCanvas.jsx
import React, { useEffect } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import useSimulationStore from '../stores/simulationStore';
import { OrbitControls, Environment } from '@react-three/drei';
import VehiclesPool from './three/VehiclesPool';
import SimulationUpdater from './SimulationUpdater';
import MarksPlane from './three/MarksPlane';

//Background de edificios 
function BuildingsPlane() {

  const { lanes, laneWidth } = useSimulationStore();
  const texture = useLoader(TextureLoader, '/textures/buildings.png');

  return (
    <mesh position={[0, 10, (lanes * (-laneWidth)) + (laneWidth / 2) - laneWidth]} rotation={[0, 0, 0]}>
      <planeGeometry args={[400, 20]} />
      <meshStandardMaterial
        map={texture}
        transparent={true}
      />
    </mesh>
  );
}

export default function SimulationCanvas() {

  const { lanes, laneWidth, isRunning } = useSimulationStore();


  const createVehiclesPool = useSimulationStore(state => state.createVehiclesPool);
  const updateVehicles = useSimulationStore(state => state.updateVehicles);
  const activateVehicle = useSimulationStore(state => state.activateVehicle);

  useEffect(() => {
    // Crear 10 vehículos inactivos
    createVehiclesPool();

    // Activar 3 de ellos para empezar
    activateVehicle();
    activateVehicle();
    activateVehicle();
  }, [createVehiclesPool, activateVehicle]);




  return (
    // El hook useFrame debe estar dentro de Canvas
    <Canvas camera={{ position: [0, 50, 100], fov: 60, }} >
      {/* Luces */}
      {/* <ambientLight intensity={0.4} color={"#f0f0f0"} /> */}
      <directionalLight position={[100, 100, 100]} />

      {/* Ambiente (HDR) */}
      <Environment preset="city" />

      {/* OrbitControls para navegar la cámara 3D con mouse */}
      <OrbitControls
        minDistance={30}
        maxDistance={100}
        minPolarAngle={Math.PI / 11} // Limita inclinación mínima (45°)
        maxPolarAngle={Math.PI / 3} // Limita inclinación máxima (90°)
        minAzimuthAngle={-Math.PI / 3} // Limita rotación izquierda (-45°)
        maxAzimuthAngle={Math.PI / 3} // Limita rotación derecha (45°)
        enablePan={false} // bloquear movimiento
      />


      {/* Ground */}
      <mesh
        key={"ground"}
        rotation={[-Math.PI / 2, 0, 0]}  // poner plano horizontal
        position={[0, 0.1, 200 + (laneWidth / 2)]}
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
          rotation={[-Math.PI / 2, 0, 0]}  // poner plano horizontal
          position={[0, 0, 0 - (i * laneWidth)]}//Corriendo los carriles para que la orilla quede en el origen
        >
          <planeGeometry args={[600, laneWidth]} />
          <meshStandardMaterial color={i % 2 == 0 ? "#023408" : "#224418"} />
        </mesh>
      ))}

      {/* Carril transmi */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}  // poner plano horizontal
        position={[0, 0, 0 - (lanes * laneWidth)]}//Corriendo los carriles para que la orilla quede en el origen
      >
        <planeGeometry args={[600, laneWidth]} />
        <meshStandardMaterial color="red" />
      </mesh>

      {/* Dibujar vehículos */}
      <VehiclesPool /> 

      {/* Lógica para actualizar la simulación */}
      {isRunning ? <SimulationUpdater /> : null}

    </Canvas>
  );
}
