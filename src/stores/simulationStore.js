// stores/simulationStore.js
import { create } from 'zustand';

// Cantidad máxima de vehículos que tendremos en el pool
const MAX_VEHICLES = 10;

// Creamos el store:
const useSimulationStore = create((set, get) => ({

  vehicles: [], // array con objetos { active, x, speed, ... }

  // Llamar esto una vez al inicio (o con useEffect) para crear el pool
  createVehiclesPool: () => {
    const initialVehicles = [];
    for (let i = 0; i < MAX_VEHICLES; i++) {
      initialVehicles.push({
        id: i,
        active: false,
        x: -100, // posición inicial en X (fuera de la vista)
        speed: Math.random() * 2 + 10, // velocidad aleatoria entre 1 y 3
        lane: Math.random() * 2 + 1,
        // puedes guardar más cosas como z, lane, color, etc.
      });
    }
    set({ vehicles: initialVehicles });
  },



  // Función para "activar" un vehículo del pool (por ejemplo al iniciar)
  activateVehicle: () => {
    const { vehicles } = get();
    const idx = vehicles.findIndex(v => v.active === false);
    if (idx !== -1) {
      // Hay un vehículo inactivo, lo activamos
      vehicles[idx].active = true;
      vehicles[idx].x = -100;            // reinicia su posición
      vehicles[idx].speed = Math.random() * 2 + 1; // nueva velocidad aleatoria
      set({ vehicles: [...vehicles] });  // disparar actualización
    }
  },


  // Parámetros ajustables
  weather: 'sunny',           // 'sunny', 'rainy', 'storm'
  criticalDensity: 170,       // densidad crítica
  lanes: 2,                   // número de carriles
  accident: false,            // booleana o algún factor de accidente

  // Datos estáticos
  baseData: [],               // array con datos de demanda, etc.
  currentHour: 0,             // hora simulada
  // vehiclesPositions: [],      // posiciones calculadas (ej. [x,y,z]) de vehículos

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


  // Actualiza posiciones y aplica lógica de "wrap" (volver al comienzo)
  updateVehicles: (delta) => {
    let { vehicles } = get();

    // Actualizar cada vehículo activo
    vehicles = vehicles.map((v) => {
      if (!v.active) return v; // si está inactivo, no lo movemos

      // mover en X
      v.x += v.speed * delta;

      // si llega a x >= 100 => desactivarlo (o reactivarlo)
      if (v.x >= 100) {
        // OPCIÓN 1: desactivarlo
        v.active = false;

        // OPCIÓN 2: volverlo a -100 (SIN desactivarlo):
        // v.x = -100;
      }

      return v;
    });

    set({ vehicles: [...vehicles] });
  },


  // updateVehicles: () => {
  //   // Ejemplo de "mover" vehículos en el eje X
  //   // En un caso real, harías cálculos de densidad, velocidad, etc.
  //   const { vehiclesPositions } = get();

  //   const newPositions = vehiclesPositions.map(pos => {
  //     return [pos[0] + 1, pos[1], pos[2]];
  //   });

  //   set({ vehiclesPositions: newPositions });
  // },
}));

export default useSimulationStore;
