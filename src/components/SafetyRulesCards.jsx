import React from 'react';
import { motion } from 'framer-motion';

const SafetyRulesCards = () => {
    const rules = [
        {
            id: 1,
            title: "Emergency Vehicles",
            description: "Give way to Ambulance, fire brigade, police to save lives.",
            icon: (
                <svg className="w-16 h-16 text-slate-800" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22,14 L20,14 L20,10.6 C20,9.7 19.3,9 18.4,9 L15,9 L15,5 C15,4.4 14.6,4 14,4 L10,4 C9.4,4 9,4.4 9,5 L9,9 L5.6,9 C4.7,9 4,9.7 4,10.6 L4,17.4 C4,18.3 4.7,19 5.6,19 L7,19 C7,20.7 8.3,22 10,22 C11.7,22 13,20.7 13,19 L15,19 C15,20.7 16.3,22 18,22 C19.7,22 21,20.7 21,19 L22,19 C22.6,19 23,18.6 23,18 L23,15 C23,14.4 22.6,14 22,14 Z M10,20.5 C9.2,20.5 8.5,19.8 8.5,19 C8.5,18.2 9.2,17.5 10,17.5 C10.8,17.5 11.5,18.2 11.5,19 C11.5,19.8 10.8,20.5 10,20.5 Z M12,11.5 L12,14 L14.5,14 L14.5,16 L12,16 L12,18.5 L10,18.5 L10,16 L7.5,16 L7.5,14 L10,14 L10,11.5 L12,11.5 Z M18,20.5 C17.2,20.5 16.5,19.8 16.5,19 C16.5,18.2 17.2,17.5 18,17.5 C18.8,17.5 19.5,18.2 19.5,19 C19.5,19.8 18.8,20.5 18,20.5 Z M21,15 L21,17 L19,17 L19,11 L19,11 L18.4,11 L15,11 L15,17 L13,17 C13,15.6 11.7,14.3 10,14.1 L10,14.1 L10,11 L19,11 L21,15 Z" />
                </svg>
            )
        },
        {
            id: 2,
            title: "Drive on Left",
            description: "Ensures uniform flow and reduces accidents on Indian roads.",
            icon: (
                <svg className="w-16 h-16 text-slate-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 3v18M7 3l-3 3m3-3 3 3M17 21V3M17 21l-3-3m3 3 3-3" />
                </svg>
            )
        },
        {
            id: 3,
            title: "No Wrong Overtake",
            description: "Do not overtake from the wrong side, especially near curves.",
            icon: (
                <div className="relative">
                    <svg className="w-16 h-16 text-slate-800 opacity-20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.92,6.01C18.72,5.42 18.16,5 17.5,5H6.5C5.84,5 5.28,5.42 5.08,6.01L3,12V20C3,20.55 3.45,21 4,21H5C5.55,21 6,20.55 6,20V19H18V20C18,20.55 18.45,21 19,21H20C20.55,21 21,20.55 21,20V12L18.92,6.01ZM6.5,16C5.67,16 5,15.33 5,14.5C5,13.67 5.67,13 6.5,13C7.33,13 8,13.67 8,14.5C8,15.33 7.33,16 6.5,16ZM17.5,16C16.67,16 16,15.33 16,14.5C16,13.67 16.67,13 17.5,13C18.33,13 19,13.67 19,14.5C19,15.33 18.33,16 17.5,16ZM5,11L6.5,7H17.5L19,11H5Z" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 border-[6px] border-red-500 rounded-full flex items-center justify-center">
                            <div className="w-full h-[6px] bg-red-500 rotate-45 absolute"></div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 4,
            title: "Safety Gear",
            description: "Helmet for two-wheelers and seat belts for car passengers.",
            icon: (
                <svg className="w-16 h-16 text-slate-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="m9 12 2 2 4-4" />
                </svg>
            )
        }
    ];

    const cardVariants = {
        hidden: { opacity: 0, y: 40 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: [0.215, 0.61, 0.355, 1] // easeOutCubic for premium smoothness
            }
        }
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-[90%] lg:w-[95%] mx-auto">
            {rules.map((rule) => (
                <motion.div
                    key={rule.id}
                    variants={cardVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    whileHover={{
                        y: -8,
                        boxShadow: "0 20px 50px -20px rgba(0,0,0,0.15)",
                        transition: { duration: 0.3, ease: "easeOut" }
                    }}
                    className="bg-white p-8 rounded-[1.5rem] shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] border border-gray-100 flex flex-col items-center text-center group"
                >
                    <div className="mb-6 p-4 rounded-2xl bg-gray-50 text-gray-800 group-hover:scale-110 transition-transform duration-300">
                        {rule.icon}
                    </div>
                    <h3 className="text-xl font-black text-gray-800 mb-3 tracking-tight">
                        {rule.title}
                    </h3>
                    <p className="text-sm md:text-[15px] font-bold text-gray-400 leading-relaxed">
                        {rule.description}
                    </p>
                </motion.div>
            ))}
        </div>
    );
};

export default SafetyRulesCards;
