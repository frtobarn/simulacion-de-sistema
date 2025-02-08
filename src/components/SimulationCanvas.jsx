// components/SimulationCanvas.jsx
import React, { useEffect } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';// Asegúrate de que Canvas esté importado correctamente
import { OrbitControls, Environment } from '@react-three/drei'; // Para controles y ambiente
import useSimulationStore from '../stores/simulationStore';
import VehiclesPool from './VehiclesPool';
import { useFrame } from '@react-three/fiber';

//Background de edificios
function BuildingsPlane() {

  const { lanes } = useSimulationStore();
  const texture = useLoader(TextureLoader, '/textures/buildings.png');

  return (
    <mesh position={[0, 10, (lanes * (-4)) + 2]} rotation={[0, 0, 0]}>
      <planeGeometry args={[400, 20]} />
      <meshStandardMaterial
        map={texture}
        transparent={true}
      />
    </mesh>
  );
}

//Background de señales
function MarksPlane() {

  const { lanes } = useSimulationStore();
  const texture = useLoader(TextureLoader, '/textures/marks.png');

  return (
    <mesh position={[0, 0.05, 30 + ((lanes * (-4)) + 2)]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[400, 60]} />
      <meshStandardMaterial
        map={texture}
        transparent={true}
      />
    </mesh>
  );
}

// Componente que usa useFrame
// Este componente solo se encarga de la lógica, no renderiza nada
function SimulationUpdater() {
  const { updateVehicles } = useSimulationStore();

  // useFrame: se llama ~60 veces por segundo
  useFrame((state, delta) => {
    // Actualizamos la posición de los vehículos
    updateVehicles(delta);

    // (Opcional) Logica para activar un nuevo vehiculo cada N tiempo:
    // if (Math.random() < 0.01) {
    //   console.log("Trying to spawn vehicle")
    //   activateVehicle();
    // }
  });

  return null; 
}

export default function SimulationCanvas() {

  const { lanes } = useSimulationStore();


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
      />


      {/* Ground */}
      <mesh
        key={"ground"}
        rotation={[-Math.PI / 2, 0, 0]}  // poner plano horizontal
        position={[0, 0.1, 202]}
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
          position={[0, 0, 0 - (i * 4)]}//i * 4 - (lanes * 4) / 2
        >
          <planeGeometry args={[600, 4]} />
          <meshStandardMaterial color={i%2 == 0 ? "yellow" :  "green"} />
        </mesh>
      ))}

      {/* Dibujar vehículos */}
      <VehiclesPool />

      {/* Lógica para actualizar la simulación */}
      <SimulationUpdater />
    </Canvas>
  );
}
