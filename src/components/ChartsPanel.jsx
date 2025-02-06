// components/ChartsPanel.jsx
import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import useSimulationStore from '../stores/simulationStore';

export default function ChartsPanel() {
    const { baseData, currentHour } = useSimulationStore();

    // Supongamos que baseData es un array de objetos { hour, demand, density, ... }
    // Filtramos/transformamos si es necesario:
    const chartData = baseData.map(item => ({
        hour: item.hour,
        demand: item.demand,
    }));

    return (
        <div style={{ width: '100%', height: 300, backgroundColor: '#fff', padding: 16 }}>
            <LineChart width={350} height={175} data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="demand" stroke="#8884d8" />
            </LineChart>
            <p>Hora actual: {currentHour}</p>
        </div>
    );
}
