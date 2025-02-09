import React from 'react';
import {  useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import useSimulationStore from '../../stores/simulationStore';

export default function BuildingsPlane() {
    const { lanes, laneWidth } = useSimulationStore();
    const texture = useLoader(TextureLoader, '/textures/buildings.png');

    return (
        <mesh position={[0, 10, (lanes * (-laneWidth)) + (laneWidth / 2) - laneWidth]} rotation={[0, 0, 0]}>
            <planeGeometry args={[400, 20]} />
            <meshStandardMaterial map={texture} transparent={true} />
        </mesh>
    );
}