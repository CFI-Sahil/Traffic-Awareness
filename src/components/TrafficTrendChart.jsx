import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';



const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-gray-900 border border-gray-700 p-3 rounded-lg shadow-xl text-xs">
                <p className="font-bold text-gray-300 mb-2">{label}</p>
                <div className="flex items-center space-x-2 text-red-400">
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                    <span>Current: {payload[0].value}%</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-500 mt-1">
                    <span className="w-2 h-2 rounded-full bg-gray-500" />
                    <span>Avg: {payload[1].value}%</span>
                </div>
            </div>
        );
    }
    return null;
};

const TrafficTrendChart = ({ cityData }) => {
    // Generate deterministic trend data based on city name to ensure consistency
    const generateTrendData = (city) => {
        const seed = city ? city.name.length + city.center[0] : 10;

        // Base curve + city specific variation
        return [
            { time: '00:00', current: Math.max(5, (seed * 2) % 20), historical: 15 },
            { time: '03:00', current: Math.max(5, (seed * 1.5) % 15), historical: 8 },
            { time: '06:00', current: 20 + (seed % 10), historical: 20 },
            { time: '09:00', current: 70 + (seed % 25), historical: 75 },
            { time: '12:00', current: 60 + (seed % 15), historical: 70 },
            { time: '15:00', current: 50 + (seed % 20), historical: 60 },
            { time: '18:00', current: 80 + (seed % 15), historical: 85 },
            { time: '21:00', current: 40 + (seed % 10), historical: 45 },
            { time: '24:00', current: 20, historical: 20 },
        ];
    };

    const data = React.useMemo(() => generateTrendData(cityData), [cityData]);

    return (
        <div className="w-full bg-black/80 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-2xl">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-gray-300 font-bold text-lg">24-Hour Traffic Volume</h3>
                    <p className="text-xs text-gray-500">Congestion Index vs Historical Average ({cityData ? cityData.name : 'City'})</p>
                </div>
                <div className="flex space-x-4 text-xs">
                    <div className="flex items-center space-x-1">
                        <span className="w-3 h-3 bg-red-500 rounded-sm"></span>
                        <span className="text-gray-400">Live</span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <span className="w-3 h-3 bg-gray-600 rounded-sm"></span>
                        <span className="text-gray-400">Avg</span>
                    </div>
                </div>
            </div>

            <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                        <XAxis
                            dataKey="time"
                            stroke="#666"
                            tick={{ fontSize: 10 }}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#666"
                            tick={{ fontSize: 10 }}
                            tickLine={false}
                            axisLine={false}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                            type="monotone"
                            dataKey="current"
                            stroke="#ef4444"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorCurrent)"
                        />
                        <Area
                            type="monotone"
                            dataKey="historical"
                            stroke="#6b7280"
                            strokeWidth={2}
                            strokeDasharray="5 5"
                            fill="transparent"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default TrafficTrendChart;
