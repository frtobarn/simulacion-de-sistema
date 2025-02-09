import React from 'react';
import { Slider, ButtonGroup, Button } from '@mui/material';
import useSimulationStore from '../../stores/simulationStore';

export default function ControlsPanel() {
    const {
        weather,
        setWeather,
        triggerAccident,
        simulationSpeed,
        setSimulationSpeed,
        updateRealDemand,
        transmiEffect,
        setTransmiEffect,
    } = useSimulationStore();

    const handleWeatherChange = (type) => {
        setWeather(type); // Actualiza el estado con el nuevo clima
        updateRealDemand();
    };

    const handleTransmiChange = (value) => {
        setTransmiEffect(value);
        updateRealDemand();
    };

    return (
        <div style={{ padding: 16, backgroundColor: '#f0f0f0', width: '100%' }}>
            <h3>Parámetros del Sistema</h3>

            <div style={{ marginBottom: 16 }}>
                <div style={{ marginBottom: 16 }}>
                    <label>Velocidad simulación: {simulationSpeed}</label>
                    <Slider
                        style={{ width: '80%' }}
                        min={1}
                        max={10}
                        step={1}
                        value={simulationSpeed}
                        onChange={(e, value) => setSimulationSpeed(value)} // Maneja ambos argumentos correctamente
                    />
                </div>

                <label>Condición Climática</label>
                <ButtonGroup variant="contained" style={{ marginLeft: 8 }}>
                    {['dry', 'rainy', 'storm'].map((type) => (
                        <Button
                            key={type}
                            color={weather === type ? 'primary' : 'inherit'}
                            onClick={() => handleWeatherChange(type)}
                            aria-pressed={weather === type}
                        >
                            {type === "dry" ? "Sol" : type === "rainy" ? "Lluvia" : "Tormenta"}
                        </Button>
                    ))}
                </ButtonGroup>

                <div style={{ marginTop: 16 }}>
                    <label>Efecto transmilenio: {transmiEffect * 100} %</label>
                    <Slider
                        style={{ width: '80%' }}
                        min={0}
                        max={1}
                        step={0.01}
                        value={transmiEffect}
                        onChange={(e, value) => handleTransmiChange(value)} // Usa el segundo argumento `value`
                    />
                </div>
            </div>

            {/* <Button variant="contained" color="error" onClick={triggerAccident}>
                Simular Accidente
            </Button> */}
        </div>
    );
}
