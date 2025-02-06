import React from 'react';
import { Slider, ButtonGroup, Button } from '@mui/material';
import useSimulationStore from '../stores/simulationStore';

export default function ControlsPanel() {
    const {
        weather,
        setWeather,
        criticalDensity,
        setCriticalDensity,
        triggerAccident,
    } = useSimulationStore();

    return (
        <div style={{ padding: 16, backgroundColor: '#f0f0f0', width: '100%' }}>
            <h3>Parámetros del Sistema</h3>

            <div style={{ marginBottom: 16 }}>
                <label>Condición Climática</label>
                <ButtonGroup variant="contained" style={{ marginLeft: 8 }}>
                    {['sunny', 'rainy', 'storm'].map((type) => (
                        <Button
                            key={type}
                            color={weather === type ? 'primary' : 'inherit'}
                            onClick={() => setWeather(type)}
                        >
                            {type == "sunny" ? "Sol" : type == "rainy" ? "Lluvia" : "Tormenta"}
                        </Button>
                    ))}
                </ButtonGroup>
            </div>

            <div style={{ marginBottom: 16 }}>
                <label>Densidad Crítica: {criticalDensity}</label>
                <Slider
                    style={{ width: '80%' }}
                    min={100}
                    max={300}
                    step={10}
                    value={criticalDensity}
                    onChange={(e, value) => setCriticalDensity(value)}
                />
            </div>

            <Button variant="contained" color="error" onClick={triggerAccident}>
                Simular Accidente
            </Button>
        </div>
    );
}
