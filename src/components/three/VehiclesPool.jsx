// components/VehiclesPool.jsx
import React from 'react';
import useSimulationStore from '../../stores/simulationStore';
import Vehicle from './Vehicle';

export default function VehiclesPool() {
    const vehicles = useSimulationStore(state => state.vehicles);

    return (
        <>
            {vehicles.map((veh) => {
                if (!veh.active) return null; // no renderizar si está inactivo
                return (
                    <Vehicle
                        key={veh.id}
                        id={veh.id}
                        position={[veh.x, 0.5, 0]} // solo x para ejemplo
                    />
                );
            })}
        </>
    );
}
