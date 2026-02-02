import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import r1 from '../assets/r1.png';
import r2 from '../assets/r2.png';
import r3 from '../assets/r3.png';
import r4 from '../assets/r4.png';
import r5 from '../assets/r5.png';
import r6 from '../assets/r6.png';
import r7 from '../assets/r7.png';
import r8 from '../assets/r8.png';
import r9 from '../assets/r9.png';
import r10 from '../assets/r10.png';
import r11 from '../assets/r11.png';
import r12 from '../assets/r12.png';
import r13 from '../assets/r13.png';
import r14 from '../assets/r14.png';
import r15 from '../assets/r15.png';
import r16 from '../assets/r16.png';
import r17 from '../assets/r17.png';
import r18 from '../assets/r18.png';
import r19 from '../assets/r19.png';
import r20 from '../assets/r20.png';

const TrafficSignsPage = () => {
    const [activeFlippedId, setActiveFlippedId] = useState(null);
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

    useEffect(() => {
        window.scrollTo(0, 0);
        const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleCard = (id) => {
        if (!isDesktop) {
            setActiveFlippedId(prev => prev === id ? null : id);
        }
    };

    const rules = [
        { id: 1, title: "Stop", desc: "Mandatory stop", longDesc: "Drivers must bring their vehicle to a complete halt before the stop line or at the intersection.", icon: r1 },
        { id: 2, title: "Give Way", desc: "Yield right of way", longDesc: "Slow down or stop if necessary to let other vehicles pass before proceeding.", icon: r2 },
        { id: 3, title: "No Entry", desc: "No vehicles allowed", longDesc: "Vehicles are prohibited from entering this area from this direction.", icon: r3 },
        { id: 4, title: "Straight Prohibited", desc: "No forward movement", longDesc: "Vehicles are not allowed to move straight ahead; they must turn left or right.", icon: r4 },
        { id: 5, title: "One Way", desc: "Single direction only", longDesc: "Traffic is permitted in only one direction; vehicles must not travel in the opposite direction.", icon: r5 },
        { id: 6, title: "One Way", desc: "Single direction only", longDesc: "Traffic is permitted in only one direction from the other side. Entry prohibited here.", icon: r6 },
        { id: 7, title: "No U-Turn", desc: "180-degree turn forbidden", longDesc: "You must not perform a U-turn at this point or in this section of the road.", icon: r7 },
        { id: 8, title: "No Overtaking", desc: "Do not pass others", longDesc: "Drivers are prohibited from overtaking other vehicles for safety and traffic flow reasons.", icon: r8 },
        { id: 9, title: "No Horns", desc: "Silent zone", longDesc: "Sounding of horns is prohibited, typically near hospitals, schools, or residential areas.", icon: r9 },
        { id: 10, title: "No Parking", desc: "Waiting allowed only", longDesc: "Vehicles cannot be parked in this area, but short stops for loading/unloading might be allowed.", icon: r10 },
        { id: 11, title: "No Standing", desc: "No stopping allowed", longDesc: "Stopping or standing of vehicles is strictly prohibited in this specific zone.", icon: r11 },
        { id: 12, title: "Speed Limit 50", desc: "Max speed 50 km/h", longDesc: "The maximum speed allowed on this stretch of road is fifty kilometers per hour.", icon: r12 },
        { id: 13, title: "Right Turn Prohibited", desc: "No right turn", longDesc: "Making a right turn into the intersecting road is not allowed at this junction.", icon: r13 },
        { id: 14, title: "Left Turn Prohibited", desc: "No left turn", longDesc: "Making a left turn into the intersecting road is not allowed at this junction.", icon: r14 },
        { id: 15, title: "Compulsory Left Turn", desc: "Turn left only", longDesc: "All vehicles must turn left and follow the direction indicated by the arrow.", icon: r15 },
        { id: 16, title: "Narrow Bridge Ahead", desc: "Caution: Bridge narrow", longDesc: "The road ahead narrows for a bridge; prepare to slow down or yield to oncoming traffic.", icon: r16 },
        { id: 17, title: "School Ahead", desc: "Watch for children", longDesc: "A school is nearby. Reduce speed and be prepared to stop for children crossing.", icon: r17 },
        { id: 18, title: "Pedestrian Crossing", desc: "Zebra crossing", longDesc: "Yield to pedestrians who are crossing or waiting to cross the road.", icon: r18 },
        { id: 19, title: "Roundabout Ahead", desc: "Circle junction", longDesc: "Approaching a circular intersection. Give way to traffic already in the roundabout.", icon: r19 },
        { id: 20, title: "Steep Ascent", desc: "Uphill climb", longDesc: "Prepare for a steep incline ahead. Use lower gears if necessary for better control.", icon: r20 }
    ];

    const cardVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.1,
                duration: 0.6,
                ease: "easeOut"
            }
        })
    };

    return (
        <div className="min-h-screen bg-gray-50/50 py-16 px-2 md:px-0">
            <div className="w-[90%] mx-auto">
                <div className="text-center mb-6">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="text-4xl md:text-5xl font-black text-[#0d181c] mb-4 tracking-tight uppercase"
                    >
                        Traffic Signs
                    </motion.h1>
                    <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: 100 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="h-1.5 bg-gradient-to-r from-[#1f353d] via-[#6e6e6e] to-[#0d181c] mx-auto rounded-full"
                    />
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 1
                        }}
                        className="lg:hidden text-[#0D181C] font-bold mt-6 text-sm italic"
                    >
                        Tip: Click the card for more information
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 [perspective:1000px] mt-0 lg:mt-12">
                    {rules.map((rule, index) => {
                        return (
                            <motion.div
                                key={rule.id}
                                className="relative w-full h-[320px] cursor-pointer [perspective:1000px] group"
                                whileHover={isDesktop ? "flipped" : ""}
                                variants={cardVariants}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, margin: "-20px" }}
                                custom={index % 5}
                                onClick={() => toggleCard(rule.id)}
                            >
                                <motion.div
                                    className="relative w-full h-full"
                                    style={{ transformStyle: "preserve-3d" }}
                                    animate={!isDesktop ? (activeFlippedId === rule.id ? "flipped" : "initial") : undefined}
                                    variants={{
                                        flipped: { rotateY: 180 },
                                        initial: { rotateY: 0 }
                                    }}
                                    transition={{ duration: 0.6, ease: "easeInOut" }}
                                >
                                    <div
                                        className="absolute inset-0 w-full h-full p-8 rounded-[2rem] shadow-lg border border-gray-100 bg-white text-[#0d181c] flex flex-col items-center justify-center text-center"
                                        style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
                                    >
                                        <div className="bg-gray-50 text-[#0d181c] w-24 h-24 rounded-3xl flex items-center justify-center text-5xl mb-6 transition-transform duration-500 hover:scale-110">
                                            <img src={rule.icon} alt={rule.title} className="w-full h-full object-contain p-2" />
                                        </div>
                                        <h3 className="text-xl font-black tracking-tight uppercase mb-2">
                                            {rule.title}
                                        </h3>
                                        <p className="text-sm font-bold opacity-60 italic px-4">
                                            {rule.desc}
                                        </p>
                                    </div>

                                    <div
                                        className="absolute inset-0 w-full h-full p-8 rounded-[2rem] shadow-xl border border-gray-800 bg-[#0d181c] text-white flex flex-col items-center justify-center text-center"
                                        style={{
                                            backfaceVisibility: "hidden",
                                            WebkitBackfaceVisibility: "hidden",
                                            transform: "rotateY(180deg)"
                                        }}
                                    >
                                        <div className="mb-4 text-blue-400">
                                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <h4 className="text-lg font-black mb-3 uppercase tracking-wider text-white">Detailed Guide</h4>
                                        <p className="font-bold text-sm leading-relaxed opacity-90 italic px-4 text-white">
                                            {rule.longDesc}
                                        </p>
                                    </div>
                                </motion.div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default TrafficSignsPage;
