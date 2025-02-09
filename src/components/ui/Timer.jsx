import { useEffect, useState } from "react";
import useSimulationStore from "../../stores/simulationStore";

function formatTime(time) {
  const hour = Math.floor(time);
  const minutes = Math.floor(60 * (time - hour));
  const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  return `${hour}:${paddedMinutes} horas`;
}

export default function Timer() {
  const { currentHour, setCurrentHour, isRunning, setIsRunning, updateRealDemand, realDemand } = useSimulationStore();
  const simulationSpeed = useSimulationStore((state) => state.simulationSpeed);

  const [prevHour, setPrevHour] = useState(-1);

  useEffect(() => {
    let worker;

    if (isRunning) {
      // Crear el worker cuando la simulación está en marcha
      const workerCode = `
        self.onmessage = function (e) {
          const { currentHour, simulationSpeed } = e.data;
          const intervalTime = 1000 * (1 / (simulationSpeed * simulationSpeed));

          let updatedHour = currentHour;

          const interval = setInterval(() => {
            updatedHour += 0.008;
            if (updatedHour >= 24) {
              updatedHour = 0;
            }
            self.postMessage(updatedHour);
          }, intervalTime);

          self.onmessage = function (e) {
            if (e.data === "stop") {
              clearInterval(interval);
              self.close();
            }
          };
        };
      `;

      const blob = new Blob([workerCode], { type: "application/javascript" });
      worker = new Worker(URL.createObjectURL(blob));

      worker.postMessage({ currentHour, simulationSpeed });

      worker.onmessage = (e) => {
        if (parseInt(e.data) != parseInt(prevHour)) {
          setPrevHour(parseInt(e.data));
          updateRealDemand()
        }
        setCurrentHour(e.data);
      };
    }

    return () => {
      if (worker) {
        worker.postMessage("stop");
        worker.terminate();
      }
    };
  }, [isRunning, currentHour, simulationSpeed, setCurrentHour, realDemand]);

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <h1 className="text-2xl font-bold">
        Hora actual{" "}
        <span style={{ color: isRunning ? "#0000ff" : "#000" }}>
          {formatTime(currentHour)}
        </span>
      </h1>
      <div className="flex gap-2">
        <h4 style={{ display: "inline-block", marginRight: "16px" }}> Simulación</h4>
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
