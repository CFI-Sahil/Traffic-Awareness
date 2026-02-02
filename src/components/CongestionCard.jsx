import React from 'react';
import { motion } from 'framer-motion';
const CongestionCard = ({ data }) => {
    const { congestionLevel, trend } = data || { congestionLevel: 0, trend: '+0%' };

    // Determine color based on level
    const getColor = (level) => {
        if (level <= 30) return '#4ade80'; // Green
        if (level <= 60) return '#facc15'; // Yellow
        return '#ef4444'; // Red
    };

    const color = getColor(congestionLevel);
    const radius = 80;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - ((congestionLevel / 100) * circumference) / 2; // Semi-circle logic adjustment

    // For a semi-circle gauge, we only show 50% of the circle, so we map 0-100% input to 0-50% strokeDasharray?
    // Actually, distinct SVG approach for semi-circle is better.
    // Let's stick to a clean circular gauge for simplicity or semi-circle path.
    // SVG Path for semi-circle: M 10,100 A 90,90 0 0 1 190,100

    // Calculating gauge path
    // Center at 100,100. Radius 80.
    // Start angle 180 deg (left), End angle 0 deg (right) for Full Semi-Circle.
    // We want to fill up to `congestionLevel` percent of that semi-circle.

    return (
        <div className="relative overflow-hidden rounded-2xl bg-black/80 backdrop-blur-xl border border-white/10 p-6 flex flex-col items-center justify-between shadow-2xl h-full min-h-[350px]">
            {/* Background Glow */}
            <div
                className="absolute top-[-20%] right-[-20%] w-[150%] h-[150%] rounded-full opacity-20 pointer-events-none blur-3xl transition-colors duration-1000"
                style={{ backgroundColor: color }}
            ></div>

            {/* Header */}
            <div className="text-center z-10 w-full flex justify-between items-start">
                <div className="text-left">
                    <h3 className="text-sm font-bold text-gray-400">Congestion Level</h3>
                    <div className="flex items-baseline mt-1 space-x-2">
                        <span className="text-3xl font-bold text-white transition-colors duration-500" style={{ color: color }}>
                            {congestionLevel}%
                        </span>
                        <span className={`text-xs font-medium ${trend.includes('+') ? 'text-red-400' : 'text-green-400'}`}>
                            {trend}
                        </span>
                    </div>
                </div>
                <div className="p-2 bg-white/5 rounded-lg border border-white/10">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                </div>
            </div>

            {/* Main Gauge Visual */}
            <div className="relative mt-8 z-10 flex flex-col items-center justify-center">
                <svg width="240" height="140" viewBox="0 0 240 140" className="overflow-visible">
                    {/* Definitions for gradients */}
                    <defs>
                        <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#4ade80" />
                            <stop offset="50%" stopColor="#facc15" />
                            <stop offset="100%" stopColor="#ef4444" />
                        </linearGradient>
                        <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/* Track */}
                    <path
                        d="M 20,130 A 100,100 0 0 1 220,130"
                        fill="none"
                        stroke="#333"
                        strokeWidth="15"
                        strokeLinecap="round"
                    />

                    {/* Filling Path */}
                    {/* We need to calculate the End Point based on percentage. 
                        Total Arc is 180 degrees (PI radians).
                        Angle = PI * (1 - percent/100) -- wait, 180 is start, 0 is end/360.
                        Math: Start at 180 deg (Left). Go Clockwise.
                        Current Angle = 180 + (percent/100 * 180) ?? No, SVG coords.
                        Let's use strokeDasharray on the path "M 20,130 A 100,100 0 0 1 220,130"
                        Path Length of semi-circle = PI * R = 3.14 * 100 = 314.
                    */}
                    <motion.path
                        d="M 20,130 A 100,100 0 0 1 220,130"
                        fill="none"
                        stroke="url(#gaugeGradient)"
                        strokeWidth="15"
                        strokeLinecap="round"
                        initial={{ strokeDasharray: "0, 1000" }}
                        animate={{ strokeDasharray: `${(congestionLevel / 100) * 314}, 1000` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        style={{ filter: "url(#neonGlow)" }}
                    />
                </svg>

                <div className="absolute top-[60%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                    <p className="text-gray-400 text-xs tracking-widest uppercase">Status</p>
                    <p className="text-white font-bold text-lg mt-1 tracking-wide" style={{ color: color }}>
                        {congestionLevel < 30 ? 'Smooth' : congestionLevel < 60 ? 'Moderate' : 'Heavy'}
                    </p>
                </div>
            </div>

            <div className="w-full grid grid-cols-2 gap-4 mt-6 z-10">
                <div className="bg-white/5 rounded-lg p-3 text-center border border-white/5">
                    <p className="text-[10px] text-gray-500 uppercase">Avg Speed</p>
                    <p className="text-xl font-bold text-white">42 <span className="text-xs font-normal text-gray-400">km/h</span></p>
                </div>
                <div className="bg-white/5 rounded-lg p-3 text-center border border-white/5">
                    <p className="text-[10px] text-gray-500 uppercase">Free Flow</p>
                    <p className="text-xl font-bold text-gray-300">65 <span className="text-xs font-normal text-gray-500">km/h</span></p>
                </div>
            </div>
        </div>
    );
};

export default CongestionCard;
