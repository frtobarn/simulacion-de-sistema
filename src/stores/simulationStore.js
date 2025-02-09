// stores/simulationStore.js
import { create } from 'zustand';

// Cantidad máxima de vehículos que tendremos en el pool
const MAX_VEHICLES = 2000;

// Creamos el store:
const useSimulationStore = create((set, get) => ({

  vehicles: Array.from({ length: MAX_VEHICLES }, (_, i) => ({
    id: i,
    active: false,
    position: { x: -1000, y: 0.5, z: 0 },
  })),

  activateVehicle: () => {
    const { vehicles } = get();
    const idx = vehicles.findIndex(v => !v.active);

    if (idx !== -1) {
      vehicles[idx].active = true;
      vehicles[idx].position = { x: -200, y: 0.5, z: 0 }; // Posición inicial de vehículos activos
      console.log(`Vehículo activado: ${JSON.stringify(vehicles[idx])}`);
      set({ vehicles: [...vehicles] });
    }
  },

  deactivateVehicle: (id) => {
    const { vehicles } = get();
    vehicles[id].active = false;
    set({ vehicles: [...vehicles] });
  },

  // Parámetros ajustables
  simulationSpeed: 1,         // Multimiplicador del delta time
  isRunning: false,           // Esta Corriendo la simulación?
  weather: 'dry',             // 'sunny', 'rainy', 'storm'
  transmiEffect: 0,
  criticalDensity: 170,       // densidad crítica
  lanes: 3,                   // número de carriles
  laneWidth: 3,               // ancho de cada carril
  accident: false,            // booleana o algún factor de accidente

  // Datos estáticos
  baseData: [],               // array con datos de demanda, etc.
  currentHour: 0,             // hora simulada

  // Datos dinámicos
  realDemand: 0,              // demanda inicial cero
  // vehiclesPositions: [],      // posiciones calculadas (ej. [x,y,z]) de vehículos

  // =======================
  // ACTIONS (para mutar estado)
  // =======================

  setSimulationSpeed: (multiplier) => set({ simulationSpeed: multiplier }),

  setIsRunning: (simulate) => set({ isRunning: simulate }),

  setCurrentHour: (time) => set({ currentHour: time }),

  setBaseData: (data) => set({ baseData: data }),

  setWeather: (value) => set({ weather: value }),

  setTransmiEffect: (value) => set({ transmiEffect: value }),

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

  updateRealDemand: () => {
    const { baseData, currentHour, weather, transmiEffect } = get();
    const weatherFactor = { dry: 0.1, rainy: 0.3, storm: 0.5 }[weather] || 0;


    if (baseData[parseInt(currentHour)]?.demand) {
      const _demand = baseData[parseInt(currentHour)].demand * (1 + weatherFactor) * (1 - transmiEffect);
      set({ realDemand: _demand });
      return _demand;
    }

    return 10; // valor por defecto en caso de que no haya datos
  },

  // =======================
  // LÓGICA DE SIMULACIÓN
  // =======================


  // Actualiza posiciones y aplica lógica de "wrap" (volver al comienzo)
  updateVehicles: (delta) => {
    let { vehicles } = get();

    // Actualizar cada vehículo activo
    vehicles = vehicles.map((v) => {
      if (!v.active) return v; // si está inactivo, no lo movemos

      // mover en X
      v.x += v.speed * delta;

      // si llega a x >= 100 => desactivarlo (o reactivarlo)
      if (v.x >= 200) {
        // OPCIÓN 1: desactivarlo
        // v.active = false;

        // OPCIÓN 2: volverlo a -100 (SIN desactivarlo):
        v.x = -200;
      }

      return v;
    });

    set({ vehicles: [...vehicles] });
  },


}));

export default useSimulationStore;
