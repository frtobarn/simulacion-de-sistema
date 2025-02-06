// components/SimulationCanvas.jsx
import React, { useEffect } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';// Asegúrate de que Canvas esté importado correctamente
import { OrbitControls, Environment } from '@react-three/drei'; // Para controles y ambiente
import useSimulationStore from '../stores/simulationStore';
import VehiclesPool from './VehiclesPool';
import { useFrame } from '@react-three/fiber';

function BuildingsPlane() {

  const { lanes } = useSimulationStore();
  // Cargar la textura PNG con transparencia
  const texture = useLoader(TextureLoader, '/textures/buildings.png');

  return (
    <mesh position={[0, 25, lanes * (-5)]} rotation={[0, 0, 0]}>
      {/* Geometría del plano */}
      <planeGeometry args={[50, 50]} /> {/* Ajusta el tamaño según necesites */}
      {/* Material con la textura asignada */}
      <meshStandardMaterial
        map={texture} // Asigna la textura al material
        transparent={true} // Activa la transparencia
      />
    </mesh>
  );
}

// Componente que usará useFrame
function SimulationUpdater() {
  const { updateVehicles } = useSimulationStore();

  // useFrame: se llama ~60 veces por segundo
  useFrame((state, delta) => {
    // Actualizamos la posición de los vehículos
    updateVehicles(delta);

    // (Opcional) Logica para activar un nuevo vehiculo cada N tiempo:
    // if (Math.random() < 0.01) {
    //   activateVehicle();
    // }
  });

  return null; // Este componente solo se encarga de la lógica, no renderiza nada
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
      <ambientLight intensity={0.4} color={"#f0f0f0"} />
      {/* <directionalLight position={[100, 100, 100]} /> */}

      {/* Ambiente (HDR) */}
      {/* <Environment preset="city" /> */}

      {/* OrbitControls para navegar la cámara 3D con mouse */}
      <OrbitControls
        minDistance={30}
        maxDistance={100}
        minPolarAngle={Math.PI / 9} // Limita inclinación mínima (45°)
        maxPolarAngle={Math.PI / 3} // Limita inclinación máxima (90°)
        minAzimuthAngle={-Math.PI / 3} // Limita rotación izquierda (-45°)
        maxAzimuthAngle={Math.PI / 3} // Limita rotación derecha (45°)
      />


      {/* Ground */}
      <mesh
        key={"ground"}
        rotation={[-Math.PI / 2, 0, 0]}  // poner plano horizontal
        position={[0, 0, 202]}
      >
        <planeGeometry args={[2000, 400]} />
        <meshStandardMaterial color="black" />
      </mesh>

      {/* Buildings */}
      <BuildingsPlane />

      {/* Carriles (simples planos grises) */}
      {[...Array(lanes)].map((_, i) => (
        <mesh
          key={i}
          rotation={[-Math.PI / 2, 0, 0]}  // poner plano horizontal
          position={[0, 0, 0 - (i * 4)]}//i * 4 - (lanes * 4) / 2
        >
          <planeGeometry args={[300, 4]} />
          <meshStandardMaterial color={i == 0 ? "yellow" : i == 1 ? "blue" : i == 2 ? "red" : "green"} />
        </mesh>
      ))}

      {/* Dibujar vehículos */}
      <VehiclesPool />
      {/* {vehiclesPositions.map((pos, i) => (
        <Vehicle key={i} position={pos} />
      ))} */}



      {/* Lógica para actualizar la simulación */}
      <SimulationUpdater />
    </Canvas>
  );
}
