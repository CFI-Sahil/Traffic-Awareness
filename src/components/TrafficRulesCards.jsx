import React from 'react';
import { motion } from 'framer-motion';

const TrafficRulesCards = () => {
    const rules = [
        {
            id: 1,
            title: "Follow Traffic Police",
            description: "Always follow the instructions and hand signals given by traffic police officers.",
            icon: (
                <svg className="w-16 h-16 text-slate-800" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
            )
        },
        {
            id: 2,
            title: "No Mobile Phones",
            description: "Do not use mobile phones while driving. It distracts and causes accidents.",
            icon: (
                <svg className="w-16 h-16 text-slate-800" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17 1H7c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2zm-5 21c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm5-5H7V4h10v13z" />
                </svg>
            )
        },
        {
            id: 3,
            title: "Rash Driving",
            description: "Avoid rash and aggressive driving. Patience on the road saves lives.",
            icon: (
                <svg className="w-16 h-16 text-slate-800" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.92,6.01C18.72,5.42 18.16,5 17.5,5H6.5C5.84,5 5.28,5.42 5.08,6.01L3,12V20C3,20.55 3.45,21 4,21H5C5.55,21 6,20.55 6,20V19H18V20C18,20.55 18.45,21 19,21H20C20.55,21 21,20.55 21,20V12L18.92,6.01ZM6.5,16C5.67,16 5,15.33 5,14.5C5,13.67 5.67,13 6.5,13C7.33,13 8,13.67 8,14.5C8,15.33 7.33,16 6.5,16ZM17.5,16C16.67,16 16,15.33 16,14.5C16,13.67 16.67,13 17.5,13C18.33,13 19,13.67 19,14.5C19,15.33 18.33,16 17.5,16ZM5,11L6.5,7H17.5L19,11H5Z" />
                </svg>
            )
        },
        {
            id: 4,
            title: "Valid Documents",
            description: "Carry valid driving documents (DL, RC, Insurance) at all times.",
            icon: (
                <svg className="w-16 h-16 text-slate-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
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
                ease: [0.215, 0.61, 0.355, 1]
            }
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-[90%] mx-auto">
            {rules.map((rule, idx) => (
                <motion.div
                    key={rule.id}
                    variants={cardVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    whileHover={{
                        y: -5,
                        boxShadow: "0 25px 50px -12px rgba(0,0,0,0.08)",
                        transition: { duration: 0.3 }
                    }}
                    className="bg-white p-8 lg:p-10 rounded-[1.5rem] shadow-[0_15px_45px_-15px_rgba(0,0,0,0.08)] border border-gray-50 flex flex-col relative overflow-hidden group"
                >
                    <div className="flex justify-between items-start ">
                        <div className="flex items-center gap-4">
                            <div className="bg-[#0d181c] text-white px-2.5 py-1  rounded-sm font-black text-lg tracking-tight">
                                {String(idx + 1).padStart(2, '0')}.
                            </div>
                            <h3 className="text-base lg:text-xl font-black text-[#1e293b] tracking-tight">
                                {rule.title}
                            </h3>
                        </div>

                        <div className="relative group-hover:scale-110 transition-transform duration-500">
                            <div className="absolute -inset-4 bg-blue-50 rounded-full opacity-40 blur-xl group-hover:opacity-70 transition-opacity"></div>
                            <div className="relative transform scale-75 lg:scale-90 origin-top-right">
                                {rule.icon}
                            </div>
                        </div>
                    </div>

                    <div className="mt-2 mb-4">
                        <p className="text-[#475569] text-base lg:text-lg font-bold leading-relaxed opacity-90">
                            {rule.description}
                        </p>
                    </div>

                    <div className="mt-auto">
                        <motion.div
                            initial={{ width: "30%" }}
                            whileInView={{ width: "100%" }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.2, ease: "easeOut", delay: 0.5 }}
                            className="h-[2px] bg-[#ef4444] opacity-40 rounded-full"
                        />
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

export default TrafficRulesCards;
