import React, { useEffect, useState } from 'react';
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
        {
            id: 1,
            title: "Emergency Vehicles",
            desc: "Give way to Ambulance, Fire, Police.",
            longDesc: "Always pull over to the side of the road and stop to provide a clear path for emergency vehicles. Your swift action can save lives during critical situations.",
            icon: <img src={r1} alt="Emergency" className="w-full h-full object-contain p-2" />
        },
        {
            id: 2,
            title: "Zebra Crossing",
            desc: "Stop. Let pedestrians cross safely.",
            longDesc: "Yield to pedestrians at zebra crossings. It is mandatory to stop completely when a person is on the crossing, ensuring their safe passage without any intimidation.",
            icon: <img src={r2} alt="Crossing" className="w-full h-full object-contain p-2" />
        },
        {
            id: 3,
            title: "No Overtaking",
            desc: "Do not overtake from the wrong side.",
            longDesc: "Overtaking on bends, narrow roads, or from the left side in India is extremely dangerous. Always check your mirrors and signal long before making a safe overtaking maneuver.",
            icon: <img src={r3} alt="Overtaking" className="w-full h-full object-contain p-2" />
        },
        {
            id: 4,
            title: "Over Speeding",
            desc: "Do not overspeed. Follow posted limits.",
            longDesc: "High speeds significantly reduce your reaction time and increase the severity of accidents. Adhering to speed limits ensures safety for you and others on the road.",
            icon: <img src={r4} alt="Speeding" className="w-full h-full object-contain p-2" />
        },
        {
            id: 5,
            title: "Safe Distance",
            desc: "Maintain safe gap between vehicles.",
            longDesc: "Follow the 'two-second rule' to keep a safe buffer between you and the vehicle ahead. This provides enough space to stop safely if the vehicle in front brakes suddenly.",
            icon: <img src={r5} alt="Distance" className="w-full h-full object-contain p-2" />
        },
        {
            id: 6,
            title: "No Mobile Phone",
            desc: "Don't use phone while driving.",
            longDesc: "Using a mobile phone distracts you from the road and slows down your response time. Pull over to a safe area if you must take an urgent call or use navigation.",
            icon: <img src={r6} alt="Phone" className="w-full h-full object-contain p-2" />
        },
        {
            id: 7,
            title: "Lane Discipline",
            desc: "Stay to road lane safely.",
            longDesc: "Maintain a steady course within your lane and avoid weaving through traffic. Consistent lane discipline reduces the risk of side-swipe collisions and improves overall traffic flow.",
            icon: <img src={r7} alt="Lane" className="w-full h-full object-contain p-2" />
        },
        {
            id: 8,
            title: "Indicator Signals",
            desc: "Don't change lanes without signal.",
            longDesc: "Always indicate your intention to turn or change lanes well in advance. Signaling helps other drivers anticipate your moves, preventing confusion and potential accidents.",
            icon: <img src={r8} alt="Signal" className="w-full h-full object-contain p-2" />
        },
        {
            id: 9,
            title: "No Drunk Driving",
            desc: "Alcohol and driving don't mix.",
            longDesc: "Driving under the influence of alcohol significantly impairs your judgment, coordination, and vision. It is a major cause of fatal road accidents and is a serious legal offense.",
            icon: <img src={r9} alt="Drunk" className="w-full h-full object-contain p-2" />
        },
        {
            id: 10,
            title: "Seat-belt Safety",
            desc: "Always buckle up for safety.",
            longDesc: "Seat-belts are the most effective way to prevent serious injury during a collision. Ensure every passenger in the vehicle is buckled up properly before starting the journey.",
            icon: <img src={r10} alt="Seatbelt" className="w-full h-full object-contain p-2" />
        },
        {
            id: 11,
            title: "Speed Limit",
            desc: "Slow down within city limits.",
            longDesc: "Strictly follow the speed limits marked for residential and commercial areas. Lower speeds in these zones protect pedestrians, cyclists, and local residents.",
            icon: <img src={r11} alt="Limit" className="w-full h-full object-contain p-2" />
        },
        {
            id: 12,
            title: "No Parking",
            desc: "Unauthorized parking is prohibited.",
            longDesc: "Avoid parking your vehicle in 'No Parking' zones or on busy roads. Improper parking creates traffic bottlenecks and can lead to towing or heavy fines.",
            icon: <img src={r12} alt="Parking" className="w-full h-full object-contain p-2" />
        },
        {
            id: 13,
            title: "One-Way Traffic",
            desc: "Do not enter from the opposite side.",
            longDesc: "Observe 'No Entry' signs diligently. Entering a one-way street from the wrong direction pose a high risk of head-on collisions and disrupts the intended traffic flow.",
            icon: <img src={r13} alt="Oneway" className="w-full h-full object-contain p-2" />
        },
        {
            id: 14,
            title: "Pedestrian Priority",
            desc: "Give priority to people crossing.",
            longDesc: "Always be mindful of pedestrians, especially children, elderly, and disabled individuals. Slow down in areas with heavy foot traffic and give them the right of way.",
            icon: <img src={r14} alt="Pedestrian" className="w-full h-full object-contain p-2" />
        },
        {
            id: 15,
            title: "U-Turn Prohibited",
            desc: "U-turns are dangerous at this point.",
            longDesc: "Never attempt a U-turn where it is prohibited by signs or at busy intersections. Use designated U-turn points or take a longer route to ensure safety.",
            icon: <img src={r15} alt="U-Turn" className="w-full h-full object-contain p-2" />
        },
        {
            id: 16,
            title: "No Horn Zone",
            desc: "Silence requested in hospital zones.",
            longDesc: "Avoid unnecessary honking, especially near hospitals, schools, and silent zones. Excessive noise pollution is detrimental to health and causes significant stress to others.",
            icon: <img src={r16} alt="NoHorn" className="w-full h-full object-contain p-2" />
        },
        {
            id: 17,
            title: "School Zone",
            desc: "Drive slowly near school areas.",
            longDesc: "Exercise extreme caution when driving near schools. Children can be unpredictable; maintain a low speed and be prepared to stop instantly if necessary.",
            icon: <img src={r17} alt="School" className="w-full h-full object-contain p-2" />
        },
        {
            id: 18,
            title: "Narrow Path",
            desc: "Slow down on narrow sections.",
            longDesc: "On narrow roads, reduce your speed and be ready to pull over to let vehicles from the opposite direction pass. Patience is key to safely navigating tight spaces.",
            icon: <img src={r18} alt="Narrow" className="w-full h-full object-contain p-2" />
        },
        {
            id: 19,
            title: "Slippery Road",
            desc: "Be careful on wet or oily roads.",
            longDesc: "Wet, icy, or oily surfaces reduce tyre grip drastically. Drive at lower speeds, avoid sudden braking, and maintain extra distance from other vehicles in these conditions.",
            icon: <img src={r19} alt="Slippery" className="w-full h-full object-contain p-2" />
        },
        {
            id: 20,
            title: "Speed Breaker",
            desc: "Slow down for speed breakers ahead.",
            longDesc: "Always reduce speed when approaching a speed breaker to avoid vehicle damage and ensure passenger comfort. Speed breakers are placed to enforce safety in sensitive areas.",
            icon: <img src={r20} alt="SpeedBreaker" className="w-full h-full object-contain p-2" />
        }
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
                                            {rule.icon}
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
