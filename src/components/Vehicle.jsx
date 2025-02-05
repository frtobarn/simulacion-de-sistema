// components/Vehicle.jsx
import React from 'react';

export default function Vehicle({ position = [0, 0, 0] }) {
    return (
        <mesh position={position}>
            <boxGeometry args={[2, 1, 1]} />
            <meshStandardMaterial color="red" />
        </mesh>
    );
}
