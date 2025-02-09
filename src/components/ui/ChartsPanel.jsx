import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import useSimulationStore from '../../stores/simulationStore';
import Timer from '../ui/Timer';

const HighlightedDot = ({ cx, cy, payload, currentHour }) => {
    const isHighlighted = Math.floor(payload.hour) === Math.floor(currentHour);

    return (
        <circle
            cx={cx}
            cy={cy}
            r={isHighlighted ? 8 : 4} // Resalta el tamaño
            fill={isHighlighted ? "red" : "#8884d8"} // Resalta el color
            stroke="#000"
            strokeWidth={isHighlighted ? 2 : 1}
        />
    );
};

export default function ChartsPanel() {
    const { baseData, realDemand, currentHour } = useSimulationStore();

    // Elimina duplicados de datos y asegura que `hour` sea un entero
    const chartData = baseData
        .map(item => ({
            hour: Math.floor(item.hour),
            demand: item.demand,
        }))
        .filter((item, index, self) =>
            index === self.findIndex((t) => t.hour === item.hour)
        );

    return (
        <div style={{ width: '100%', height: 300, backgroundColor: '#fff', padding: 16 }}>
            <LineChart width={350} height={175} data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" domain={[0, 24]} tickCount={25} />
                <YAxis />
                <Tooltip />
                <Line
                    type="monotone"
                    dataKey="demand"
                    stroke="#8884d8"
                    dot={({ cx, cy, payload, index }) => (
                        <HighlightedDot
                            key={index} // Agregar un key único aquí
                            cx={cx}
                            cy={cy}
                            payload={payload}
                            currentHour={currentHour}
                        />
                    )}
                />
            </LineChart>
            <h4> Demanda actual: {realDemand}</h4>
            <Timer />
        </div>
    );
}











// import React from 'react';
// import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
// import useSimulationStore from '../../stores/simulationStore';
// import Timer from '../ui/Timer';

// // Filtra solo las propiedades necesarias para el punto resaltado
// const HighlightedDot = ({ cx, cy, payload, currentHour }) => {
//     const isHighlighted = Math.floor(payload.hour) === Math.floor(currentHour);

//     return (
//         <circle
//             cx={cx}
//             cy={cy}
//             r={isHighlighted ? 8 : 4} // Resalta el tamaño
//             fill={isHighlighted ? "red" : "#8884d8"} // Resalta el color
//             stroke="#000"
//             strokeWidth={isHighlighted ? 2 : 1}
//         />
//     );
// };

// export default function ChartsPanel() {
//     const { baseData, realDemand, currentHour } = useSimulationStore();

//     // Asegúrate de que `hour` sea un entero
//     const chartData = baseData.map(item => ({
//         hour: Math.floor(item.hour),
//         demand: item.demand,
//     }));

//     return (
//         <div style={{ width: '100%', height: 300, backgroundColor: '#fff', padding: 16 }}>
//             <LineChart width={350} height={175} data={chartData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="hour" />
//                 <YAxis />
//                 <Tooltip />
//                 <Line
//                     type="monotone"
//                     dataKey="demand"
//                     stroke="#8884d8"
//                     // Filtra las propiedades necesarias y pasa solo las válidas a HighlightedDot
//                     dot={({ cx, cy, payload, index }) => (
//                         <HighlightedDot
//                             key={index} // Agrega un key único basado en el índice
//                             cx={cx}
//                             cy={cy}
//                             payload={payload}
//                             currentHour={currentHour}
//                         />
//                     )}
//                 />
//             </LineChart>
//             <h4> Demanda actual: {realDemand}</h4>
//             <Timer />
//         </div>
//     );
// }

