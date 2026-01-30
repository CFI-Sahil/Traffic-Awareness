import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TrafficLightGuide = () => {
    const [activeLight, setActiveLight] = useState('red');
    const [isPaused, setIsPaused] = useState(false);
    const intervalRef = useRef(null);

    useEffect(() => {
        const cycle = () => {
            setActiveLight((prev) => {
                if (prev === 'red') return 'yellow';
                if (prev === 'yellow') return 'green';
                return 'red';
            });
        };

        if (!isPaused) {
            intervalRef.current = setInterval(cycle, 3000); // 3 seconds interval
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [isPaused]);

    const content = {
        red: {
            title: "STOP",
            badge: "Full Stop Required",
            theme: "red",
            icon: "⛔",
            dos: ["Stop completely before the stop line", "Wait for the green signal"],
            donts: ["Do not cross the intersection", "Do not honk impatiently"],
            applies: ["Car", "Bike", "Bus"],
            message: "Running a red light is a major cause of fatal accidents.",
            bg: "bg-red-50",
            border: "border-red-100",
            text: "text-red-700",
            badgeBg: "bg-red-100 text-red-800"
        },
        yellow: {
            title: "WAIT",
            badge: "Prepare to Stop",
            theme: "yellow",
            icon: "⚠️",
            dos: ["Slow down immediately", "Check your rear-view mirror"],
            donts: ["Do not accelerate to beat the light", "Do not brake suddenly if unsafe"],
            applies: ["Car", "Bike", "Bus"],
            message: "Yellow means stop, not speed up. Proceed only if unsafe to stop.",
            bg: "bg-yellow-50",
            border: "border-yellow-100",
            text: "text-yellow-700",
            badgeBg: "bg-yellow-100 text-yellow-800"
        },
        green: {
            title: "GO",
            badge: "Proceed with Caution",
            theme: "green",
            icon: "🚀",
            dos: ["Move forward smoothly", "Scan intersection for pedestrians"],
            donts: ["Do not block the box", "Do not overspeed"],
            applies: ["Car", "Bike", "Bus"],
            message: "Green does not mean safe automatically. Check left and right.",
            bg: "bg-green-50",
            border: "border-green-100",
            text: "text-green-700",
            badgeBg: "bg-green-100 text-green-800"
        }
    };

    const current = content[activeLight];

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1.5, ease: [0.215, 0.61, 0.355, 1] }}
            className="w-full relative rounded-3xl overflow-hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {/* DESKTOP VIEW: Interactive with Signal */}
            <div className={`hidden md:flex flex-col p-8 md:p-10 gap-8 relative z-10 border transition-colors duration-1000 ${current.bg} ${current.border} rounded-3xl shadow-xl`}>
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`, backgroundSize: '20px 20px' }}></div>

                <div className="flex flex-col md:flex-row gap-10">
                    {/* LEFT: Traffic Signal */}
                    <div className="flex-shrink-0 flex items-center justify-center">
                        <div className="bg-gray-800 p-4 rounded-[40px] shadow-2xl border-4 border-gray-700 flex flex-col gap-5">
                            <div
                                onMouseEnter={() => setActiveLight('red')}
                                className={`w-20 h-20 rounded-full border-4 border-black/20 transition-all duration-500 cursor-pointer ${activeLight === 'red' ? 'bg-red-600 shadow-[0_0_50px_rgba(220,38,38,0.9)] scale-105' : 'bg-red-950/40 hover:bg-red-900/60'}`}
                            />
                            <div
                                onMouseEnter={() => setActiveLight('yellow')}
                                className={`w-20 h-20 rounded-full border-4 border-black/20 transition-all duration-500 cursor-pointer ${activeLight === 'yellow' ? 'bg-yellow-400 shadow-[0_0_50px_rgba(250,204,21,0.9)] scale-105' : 'bg-yellow-950/40 hover:bg-yellow-900/60'}`}
                            />
                            <div
                                onMouseEnter={() => setActiveLight('green')}
                                className={`w-20 h-20 rounded-full border-4 border-black/20 transition-all duration-500 cursor-pointer ${activeLight === 'green' ? 'bg-green-500 shadow-[0_0_50px_rgba(34,197,94,0.9)] scale-105' : 'bg-green-950/40 hover:bg-green-900/60'}`}
                            />
                        </div>
                    </div>

                    {/* CENTRE: Detailed Guideline */}
                    <div className="flex-1 flex flex-col justify-start">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeLight}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.4 }}
                                className="w-full"
                            >
                                <div className="flex items-center space-x-4 mb-4">
                                    <h2 className={`text-6xl font-black tracking-tight ${current.text}`}>{current.title}</h2>
                                    <span className={`px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wide shadow-sm ${current.badgeBg} border border-white/20`}>
                                        {current.badge}
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                                    <div className="bg-white/60 p-5 rounded-2xl border border-white/50 backdrop-blur-sm shadow-sm">
                                        <h4 className="flex items-center text-green-700 font-bold mb-3">
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                            DO
                                        </h4>
                                        <ul className="space-y-2">
                                            {current.dos.map((item, i) => (
                                                <li key={i} className="text-gray-700 text-sm font-medium flex items-start">
                                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="bg-white/60 p-5 rounded-2xl border border-white/50 backdrop-blur-sm shadow-sm">
                                        <h4 className="flex items-center text-red-600 font-bold mb-3">
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                            DON'T
                                        </h4>
                                        <ul className="space-y-2">
                                            {current.donts.map((item, i) => (
                                                <li key={i} className="text-gray-700 text-sm font-medium flex items-start">
                                                    <span className="w-1.5 h-1.5 bg-red-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                {/* Applies To */}
                                <div className="mt-6 flex items-center space-x-4 text-gray-500 text-sm font-semibold">
                                    <span className="uppercase tracking-wider text-xs bg-white/50 px-2 py-1 rounded">Applies to:</span>
                                    <div className="flex space-x-3 text-lg opacity-80">
                                        <span title="Car">🚗</span>
                                        <span title="Bike">🏍️</span>
                                        <span title="Bus">🚌</span>
                                        <span title="Truck">🚛</span>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* RIGHT: Large Icon */}
                    <div className="hidden lg:flex flex-col items-center justify-center w-32 border-l border-black/5 pl-8">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={`icon-${activeLight}`}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                                transition={{ type: "spring", stiffness: 200 }}
                                className="text-8xl drop-shadow-xl filter"
                            >
                                {current.icon}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                {/* Internal Safety Note with HR */}
                <div className="w-full mt-4">
                    <hr className="border-t border-black/10 mb-6" />
                    <div className={`py-3 px-8 text-center text-sm font-bold tracking-wide rounded-2xl ${current.badgeBg} border border-black/5`}>
                        <span className="opacity-90">👮 Safety Note: {current.message}</span>
                    </div>
                </div>
            </div>
            {/* MOBILE VIEW: Static Vertical Stack */}
            <div className="flex md:hidden flex-col gap-6 mt-4">
                {Object.entries(content).map(([key, item]) => (
                    <motion.div
                        key={key}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.25 }}
                        transition={{ duration: 0.8, ease: [0.215, 0.61, 0.355, 1] }}
                        className={`rounded-3xl border p-6 shadow-md ${item.bg} ${item.border}`}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <span className="text-4xl">{item.icon}</span>
                                <h3 className={`text-4xl font-black ${item.text}`}>{item.title}</h3>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${item.badgeBg}`}>
                                {item.badge}
                            </span>
                        </div>

                        <div className="space-y-4">
                            {/* DOs */}
                            <div className="bg-white/60 p-4 rounded-xl border border-white/40">
                                <h4 className="flex items-center text-green-700 text-xs font-bold mb-2 uppercase tracking-wide">
                                    <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                    Dos
                                </h4>
                                <ul className="space-y-1.5">
                                    {item.dos.map((doItem, i) => (
                                        <li key={i} className="text-gray-700 text-sm font-medium flex items-start">
                                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                                            {doItem}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* DON'Ts */}
                            <div className="bg-white/60 p-4 rounded-xl border border-white/40">
                                <h4 className="flex items-center text-red-600 text-xs font-bold mb-2 uppercase tracking-wide">
                                    <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                    Don'ts
                                </h4>
                                <ul className="space-y-1.5">
                                    {item.donts.map((dontItem, i) => (
                                        <li key={i} className="text-gray-700 text-sm font-medium flex items-start">
                                            <span className="w-1.5 h-1.5 bg-red-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                                            {dontItem}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className={`mt-4 pt-3 border-t border-black/5 text-[11px] font-bold ${item.text} opacity-80`}>
                            👮 {item.message}
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

export default TrafficLightGuide;
