import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import useSimulationStore from '../stores/simulationStore';

function SimulationUpdater() {
  const { updateVehicles } = useSimulationStore();
  // Usamos un ref para acumular el delta entre frames
  const accumulatorRef = useRef(0);
  // Umbral de tiempo para 20 fps (1/20 = 0.05 segundos)
  const threshold = 0.05;

  useFrame((state, delta) => {
    // Acumula el delta
    accumulatorRef.current += delta;
    
    // Si se ha acumulado al menos 0.05 segundos, actualizamos la simulación
    if (accumulatorRef.current >= threshold) {
      // Aquí puedes pasar el tiempo acumulado o simplemente el paso fijo
      updateVehicles(accumulatorRef.current);
      // Reiniciamos o restamos el umbral para mantener la precisión
      accumulatorRef.current = 0;
      // También podrías hacer: accumulatorRef.current -= threshold;
      // para mantener el excedente, en caso de que la suma supere levemente el umbral.
    }
  });

  return null;
}

export default SimulationUpdater;



// function SimulationUpdater() {
//   const { updateVehicles } = useSimulationStore();

//   // useFrame: se llama ~60 veces por segundo
//   useFrame((state, delta) => {
//     // Actualizamos la posición de los vehículos
//     updateVehicles(delta);

//     // (Opcional) Logica para activar un nuevo vehiculo cada N tiempo:
//     // if (Math.random() < 0.01) {
//     //   console.log("Trying to spawn vehicle")
//     //   activateVehicle();
//     // }
//   });

//   return null;
// }