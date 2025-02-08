//Background de señales
import React from 'react';
import {  useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import useSimulationStore from '../stores/simulationStore';

export default function MarksPlane() {

    const { lanes, laneWidth } = useSimulationStore();
    const texture = useLoader(TextureLoader, '/textures/marks.png');
  
    return (
      <mesh position={[0, 0.05, 30 + ((lanes * (-laneWidth)) + (laneWidth / 2))]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[400, 60]} />
        <meshStandardMaterial
          map={texture}
          transparent={true}
        />
      </mesh>
    );
  }