import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import useSimulationStore from '../stores/simulationStore';

export default function SimulationUpdater() {
    const { vehicles, deactivateVehicle } = useSimulationStore();
    const meshRef = useRef();
    const accumulatorRef = useRef(0); // Acumulador para el delta
    const threshold = 0.02; // 20 FPS = 1/20 = 0.05 segundos

    // Inicializa todas las matrices al crearse
    useEffect(() => {
      if (meshRef.current) {
          for (let i = 0; i < 2000; i++) {
              const matrix = new THREE.Matrix4();
              matrix.makeTranslation(10000, 10000, 10000); // Mover todas las instancias fuera de la vista
              meshRef.current.setMatrixAt(i, matrix);
          }
          meshRef.current.instanceMatrix.needsUpdate = true; // Notifica que las matrices han cambiado
          console.log('Matrices inicializadas fuera de la vista');
      }
  }, []);

    // Actualización por frame
    useFrame((_, delta) => {
        // Acumula el delta del tiempo
        accumulatorRef.current += delta;

        // Si se supera el umbral, actualizamos
        if (accumulatorRef.current >= threshold) {
            // Actualiza la posición de los vehículos activos
            vehicles.forEach((vehicle, i) => {
                if (vehicle.active) {
                    vehicle.position.x += 2 * accumulatorRef.current; // Puedes usar `vehicle.speed`

                    // Si el vehículo sale del rango, desactívalo
                    if (vehicle.position.x > 200) {
                        deactivateVehicle(i);
                    }
                }
            });

            // Actualiza las matrices de las instancias activas
            if (meshRef.current) {
                vehicles.forEach((vehicle, i) => {
                    const matrix = new THREE.Matrix4();

                    if (vehicle.active) {
                        // Posición real para vehículos activos
                        matrix.makeTranslation(
                            vehicle.position.x,
                            vehicle.position.y,
                            vehicle.position.z
                        );
                    } else {
                        // Mover fuera de la vista los vehículos inactivos
                        matrix.makeTranslation(10000, 10000, 10000);
                    }

                    // Establece la matriz en el instanced mesh
                    meshRef.current.setMatrixAt(i, matrix);
                });

                // Notifica que las matrices han cambiado
                meshRef.current.instanceMatrix.needsUpdate = true;
            }

            // Reinicia el acumulador
            accumulatorRef.current = 0;
        }
    });

    return (
        <instancedMesh
            ref={meshRef}
            args={[
                new THREE.BoxGeometry(2, 1, 1), // Geometría del vehículo
                new THREE.MeshStandardMaterial({ color: 'red' }), // Material compartido
                2000, // Número máximo de instancias
            ]}
        />
    );
}

