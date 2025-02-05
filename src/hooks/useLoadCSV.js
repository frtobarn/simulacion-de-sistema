// hooks/useLoadCSV.js
import { useEffect } from 'react';
import { loadCSVData } from '../utils/dataParser';
import useSimulationStore from '../stores/simulationStore';

export default function useLoadCSV() {
  const setBaseData = useSimulationStore((state) => state.setBaseData);

  useEffect(() => {
    loadCSVData('/src/assets/data.csv')
      .then((data) => {
        setBaseData(data); // <-- Aquí actualizamos el estado global
      })
      .catch((error) => {
        console.error('Error loading CSV data:', error);
      });
  }, [setBaseData]);
}