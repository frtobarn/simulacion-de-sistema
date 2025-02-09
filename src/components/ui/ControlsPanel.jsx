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
        updateRealDemand
    } = useSimulationStore();


    const handleWeatherChange = (type) => {
        setWeather(type); // Actualiza el estado con el nuevo clima
        updateRealDemand()
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
                        onChange={(e, multiplier) => setSimulationSpeed(multiplier)}
                    />
                </div>

                <label>Condición Climática</label>
                <ButtonGroup variant="contained" style={{ marginLeft: 8 }}>
                    {['dry', 'rainy', 'storm'].map((type) => (
                        <Button
                            key={type}
                            color={weather === type ? 'primary' : 'inherit'}
                            onClick={() => handleWeatherChange(type)} // Usa una función anónima para pasar el argumento
                        >
                            {type == "dry" ? "Sol" : type == "rainy" ? "Lluvia" : "Tormenta"}
                        </Button>
                    ))}
                </ButtonGroup>
            </div>

            <Button variant="contained" color="error" onClick={triggerAccident}>
                Simular Accidente
            </Button>
        </div>
    );
}
