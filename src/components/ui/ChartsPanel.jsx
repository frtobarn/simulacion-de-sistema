// components/ChartsPanel.jsx
import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import useSimulationStore from '../../stores/simulationStore';
import Timer from '../ui/Timer';

export default function ChartsPanel() {
    const { baseData, realDemand } = useSimulationStore();

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
            <h4> Demanda actual {realDemand}</h4>
            <Timer />
        </div>
    );
}
