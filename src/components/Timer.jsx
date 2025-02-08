import { useEffect } from "react";
import useSimulationStore from "../stores/simulationStore";

// Función para formatear la hora
function formatTime(time) {
  const hour = parseInt(time);
  const minutes = parseInt(60 * (time - hour));
  const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  return `${hour}:${paddedMinutes} horas`;
}

// Función auxiliar para iniciar el intervalo
function startTimerInterval(currentHour, setCurrentHour) {
  // Si la hora ya alcanzó o superó 24, reiniciamos inmediatamente
  if (currentHour >= 24) {
    setCurrentHour(0);
    // No creamos un intervalo en este caso
    return null;
  }
  // Creamos y devolvemos el intervalo
  return setInterval(() => {
    // Nota: Se usa el valor de currentHour capturado al crear el intervalo
    setCurrentHour(currentHour + 0.008);
  }, 1000);
}

export default function Timer() {
  const { currentHour, setCurrentHour, isRunning, setIsRunning } = useSimulationStore();

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = startTimerInterval(currentHour, setCurrentHour);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning, currentHour, setCurrentHour]);

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <h1 className="text-2xl font-bold">
        Hora actual <span style={{ color: isRunning ? "#0000ff" : "#000" }}> {formatTime(currentHour)}</span>
      </h1>
      <div className="flex gap-2">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => setIsRunning(true)}
        >
          Iniciar
        </button>
        <button
          className="px-4 py-2 bg-red-500 text-white rounded"
          onClick={() => setIsRunning(false)}
        >
          Pausar
        </button>
        <button
          className="px-4 py-2 bg-gray-500 text-white rounded"
          onClick={() => {
            setIsRunning(false);
            setCurrentHour(0);
          }}
        >
          Reiniciar
        </button>
      </div>
    </div>
  );
}
