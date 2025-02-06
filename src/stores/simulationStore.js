// stores/simulationStore.js
import { create } from 'zustand';

// Creamos el store:
const useSimulationStore = create((set, get) => ({
  // Parámetros ajustables
  weather: 'sunny',           // 'sunny', 'rainy', 'storm'
  criticalDensity: 170,       // densidad crítica
  lanes: 4,                   // número de carriles
  accident: false,            // booleana o algún factor de accidente

  // Datos estáticos
  baseData: [],               // array con datos de demanda, etc.
  currentHour: 0,             // hora simulada
  vehiclesPositions: [],      // posiciones calculadas (ej. [x,y,z]) de vehículos

  // =======================
  // ACTIONS (para mutar estado)
  // =======================

  setBaseData: (data) => set({ baseData: data }),

  setWeather: (value) => set({ weather: value }),

  setCriticalDensity: (value) => set({ criticalDensity: value }),

  setLanes: (value) => set({ lanes: value }),

  triggerAccident: () => {
    // EJ: un 50% de probabilidad de accidente
    const randomAcc = Math.random() > 0.5;
    set({ accident: randomAcc });
  },

  // =======================
  // GETTERS / SELECTORS
  // =======================

  getRealDemand: () => {
    const { baseData, currentHour, weather } = get();
    const weatherFactor = { sunny: 0.1, rainy: 0.3, storm: 0.5 }[weather] || 0;
    
    if (baseData[currentHour]?.demand) {
      return baseData[currentHour].demand * (1 + weatherFactor);
    }
    
    return 1000; // valor por defecto en caso de que no haya datos
  }, 

  // =======================
  // LÓGICA DE SIMULACIÓN
  // =======================

  updateVehicles: () => {
    // Ejemplo de "mover" vehículos en el eje X
    // En un caso real, harías cálculos de densidad, velocidad, etc.
    const { vehiclesPositions } = get();
    
    const newPositions = vehiclesPositions.map(pos => {
      return [pos[0] + 1, pos[1], pos[2]];
    });
    
    set({ vehiclesPositions: newPositions });
  },
}));

export default useSimulationStore;
