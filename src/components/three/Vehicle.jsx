// components/Vehicle.jsx
import React from 'react';

export default function Vehicle({ position }) {
    // Aquí NO necesitamos useFrame, pues la posición se actualiza en el store
    // y la prop position se re-renderiza automáticamente. (OJO: ver nota abajo)

    return (
        <mesh position={position}>
            <boxGeometry args={[2, 1, 1]} />
            <meshStandardMaterial color="black" />
        </mesh>
    );
}
