import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import brainIcon from '../assets/brain_icon.png';
import InteractiveMapSection from './InteractiveMapSection';

const TrafficAwareness = () => {
    const awarenessTopics = [
        {
            id: 1,
            tip: {
                title: "Helmet Safety",
                desc: "Always wear a certified helmet. It reduces Head Injury risk by 70%.",
                icon: "⛑️",
                color: "bg-blue-600"
            },
            fact: "Every year, over 1.5 lakh people die in road accidents in India.",
            fine: { offense: "Driving without helmet", fine: "₹1,000 + 3 months disqualification" }
        },
        {
            id: 2,
            tip: {
                title: "Seatbelt First",
                desc: "Seatbelts reduce the risk of death among drivers by 45-50%.",
                icon: "🛡️",
                color: "bg-green-600"
            },
            fact: "In 2022, nearly 17,000 people died for not wearing seatbelts in India.",
            fine: { offense: "Driving without seatbelt", fine: "₹1,000" }
        },
        {
            id: 3,
            tip: {
                title: "Drink & Drive",
                desc: "Alcohol impairs judgment. Never drink and drive, no matter the distance.",
                icon: "⛑️️",
                color: "bg-red-500"
            },
            fact: "Even a small amount of alcohol can double the risk of a fatal crash.",
            fine: { offense: "Drunk Driving (1st offense)", fine: "₹10,000 and/or 6 months prison" }
        },
        {
            id: 4,
            tip: {
                title: "Speed Limits",
                desc: "Speeding is a major cause of fatal accidents. Stick to the limits.",
                icon: "🛑",
                color: "bg-orange-500"
            },
            fact: "Overspeeding accounts for over 70% of road accidents in India.",
            fine: { offense: "Overspeeding", fine: "₹1,000 - ₹2,000 (LMV)" }
        },
        {
            id: 5,
            tip: {
                title: "Night Vision",
                desc: "Use high beams responsibly. Dim lights for oncoming traffic.",
                icon: "🌙",
                color: "bg-indigo-600"
            },
            fact: "Night-time accidents are often more fatal due to visibility issues.",
            fine: { offense: "Improper use of high beam", fine: "₹500" }
        },
        {
            id: 6,
            tip: {
                title: "Rainy Roads",
                desc: "Slow down on wet roads to avoid aquaplaning and skidding.",
                icon: "🌧️",
                color: "bg-cyan-600"
            },
            fact: "Wet roads increase braking distance by up to 10 times.",
            fine: { offense: "Dangerous Driving", fine: "₹1,000 - ₹5,000" }
        },
        {
            id: 7,
            tip: {
                title: "Pedestrian Cross",
                desc: "Always stop for pedestrians at zebra crossings. It's their right.",
                icon: "🚶",
                color: "bg-yellow-500"
            },
            fact: "Pedestrians are the most vulnerable road users in urban areas.",
            fine: { offense: "Blocking Zebra Crossing", fine: "₹500" }
        },
        {
            id: 8,
            tip: {
                title: "Lane Discipline",
                desc: "Stay in your lane. Use indicators before changing directions.",
                icon: "🏍️",
                color: "bg-purple-600"
            },
            fact: "Sudden lane changes cause over 15% of highway accidents.",
            fine: { offense: "Wrong Lane Driving", fine: "₹500" }
        },
        {
            id: 9,
            tip: {
                title: "Wrong Way",
                desc: "Never drive against the traffic. It's extremely dangerous.",
                icon: "↩️",
                color: "bg-teal-600"
            },
            fact: "Driving on wrong side is a leading cause of head-on collisions.",
            fine: { offense: "Driving against traffic", fine: "₹5,000" }
        },
        {
            id: 10,
            tip: {
                title: "Child Safety",
                desc: "Children should always be in the back seat with adult supervision.",
                icon: "👶",
                color: "bg-pink-500"
            },
            fact: "Child restraints can reduce infant deaths by 70% in crashes.",
            fine: { offense: "Unsafe transport of children", fine: "₹1,000" }
        }
    ];

    const [tipIndex, setTipIndex] = useState(0);
    const [factIndex, setFactIndex] = useState(0);
    const [fineIndex, setFineIndex] = useState(0);

    const [isTipPaused, setIsTipPaused] = useState(false);
    const [isFactPaused, setIsFactPaused] = useState(false);
    const [isFinePaused, setIsFinePaused] = useState(false);

    // Tip Cycle
    useEffect(() => {
        if (isTipPaused) return;
        const interval = setInterval(() => {
            setTipIndex((prev) => (prev + 1) % awarenessTopics.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [isTipPaused]);

    // Fact Cycle
    useEffect(() => {
        if (isFactPaused) return;
        const interval = setInterval(() => {
            setFactIndex((prev) => (prev + 1) % awarenessTopics.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [isFactPaused]);

    // Fine Cycle
    useEffect(() => {
        if (isFinePaused) return;
        const interval = setInterval(() => {
            setFineIndex((prev) => (prev + 1) % awarenessTopics.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [isFinePaused]);

    const currentTopic = awarenessTopics[tipIndex] || { tip: {} };
    const currentTip = currentTopic.tip || {};

    const factTopic = awarenessTopics[factIndex] || {};
    const currentFact = factTopic.fact || "";

    const fineTopic = awarenessTopics[fineIndex] || { fine: {} };
    const currentFine = fineTopic.fine || {};

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const cardVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: [0.215, 0.61, 0.355, 1],
                delay: isMobile ? 0 : i * 0.2
            }
        })
    };

    return (
        <div className="w-full flex flex-col gap-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 w-full">
                {/* Card 1: Daily Safety Tip */}
                <motion.div
                    custom={0}
                    variants={cardVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 flex flex-col h-full transition-transform hover:scale-[1.01]"
                    onMouseEnter={() => setIsTipPaused(true)}
                    onMouseLeave={() => setIsTipPaused(false)}
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 flex items-center space-x-3 border-b border-blue-200">
                        <div className="bg-white p-2 rounded-full shadow-sm">
                            <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 tracking-tight">Daily Safety Tip</h3>
                    </div>

                    {/* Content */}
                    <div className="p-8 flex-1 flex flex-col justify-center">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentTip.title}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.4 }}
                            >
                                <div className="mb-4">
                                    <span className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-white text-lg font-semibold shadow-md ${currentTip.color}`}>
                                        <span>{currentTip.icon}</span>
                                        <span>{currentTip.title}</span>
                                    </span>
                                </div>

                                <h4 className="text-2xl font-bold text-gray-800 mb-2 leading-tight">
                                    {currentTip.title}
                                </h4>
                                <p className="text-gray-600 font-medium leading-relaxed">
                                    {currentTip.desc}
                                </p>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Footer */}
                    <div className="bg-gray-50 p-4 border-t border-gray-100 flex justify-between items-center text-sm text-gray-500 font-medium">
                        <span className="text-blue-600 cursor-pointer">Know More</span>
                        <button className="flex items-center space-x-1 hover:text-blue-600 transition-colors cursor-pointer">
                            <span>👍</span> <span>Share</span>
                        </button>
                    </div>
                </motion.div>

                {/* Card 2: Did You Know? */}
                <motion.div
                    custom={1}
                    variants={cardVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 flex flex-col h-full transition-transform hover:scale-[1.01]"
                    onMouseEnter={() => setIsFactPaused(true)}
                    onMouseLeave={() => setIsFactPaused(false)}
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 flex items-center space-x-3 border-b border-purple-200">
                        <div className="bg-white p-2 rounded-full shadow-sm">
                            <span className="text-xl">💡</span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 tracking-tight">Did You Know?</h3>
                    </div>

                    {/* Content */}
                    <div className="p-8 flex-1 flex flex-col justify-center text-center">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentFact}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.4 }}
                            >
                                <div className="mb-2 flex justify-center items-center">
                                    <img src={brainIcon} alt="Did you know?" className="w-32 h-32 object-contain opacity-90 drop-shadow-sm mix-blend-multiply" />
                                </div>
                                <p className="text-xl font-bold text-gray-700 leading-snug">
                                    "{currentFact}"
                                </p>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Footer */}
                    <div className="bg-gray-50 p-4 border-t border-gray-100 flex justify-center items-center text-sm text-purple-600 font-bold">
                        Let's use this knowledge to save lives!
                    </div>
                </motion.div>

                {/* Card 3: Fine Awareness */}
                <motion.div
                    custom={2}
                    variants={cardVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 flex flex-col h-full transition-transform hover:scale-[1.01]"
                    onMouseEnter={() => setIsFinePaused(true)}
                    onMouseLeave={() => setIsFinePaused(false)}
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-red-50 to-red-100 p-6 flex items-center space-x-3 border-b border-red-200">
                        <div className="bg-white p-2 rounded-full shadow-sm">
                            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 tracking-tight">Fines Awareness 2026</h3>
                    </div>

                    {/* Content */}
                    <div className="p-8 flex-1 flex flex-col justify-center text-center">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentFine.offense}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.4 }}
                            >
                                <div className="inline-block p-4 rounded-full bg-red-50 mb-4 ring-4 ring-red-100">
                                    <span className="text-4xl">👮‍♂️</span>
                                </div>
                                <h4 className="text-2xl font-black text-gray-800 mb-2 leading-tight">
                                    {currentFine.offense}
                                </h4>
                                <div className="mt-4">
                                    <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Penalty Up To</span>
                                    <div className="text-4xl font-black text-red-600 mt-1 drop-shadow-sm">
                                        {currentFine.fine}
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Footer */}
                    <div className="bg-gray-50 p-4 border-t border-gray-100 flex justify-between items-center text-sm text-gray-500 font-medium">
                        <span className="text-red-500 font-bold animate-pulse">Stay Aware, Stay Safe!</span>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default TrafficAwareness;
