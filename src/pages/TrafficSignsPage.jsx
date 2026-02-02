import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
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
    const { t } = useLanguage();
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
        { id: 1, title: t('traffic_signs_page.sign1_title'), desc: t('traffic_signs_page.sign1_desc'), longDesc: t('traffic_signs_page.sign1_long'), icon: r1 },
        { id: 2, title: t('traffic_signs_page.sign2_title'), desc: t('traffic_signs_page.sign2_desc'), longDesc: t('traffic_signs_page.sign2_long'), icon: r2 },
        { id: 3, title: t('traffic_signs_page.sign3_title'), desc: t('traffic_signs_page.sign3_desc'), longDesc: t('traffic_signs_page.sign3_long'), icon: r3 },
        { id: 4, title: t('traffic_signs_page.sign4_title'), desc: t('traffic_signs_page.sign4_desc'), longDesc: t('traffic_signs_page.sign4_long'), icon: r4 },
        { id: 5, title: t('traffic_signs_page.sign5_title'), desc: t('traffic_signs_page.sign5_desc'), longDesc: t('traffic_signs_page.sign5_long'), icon: r5 },
        { id: 6, title: t('traffic_signs_page.sign6_title'), desc: t('traffic_signs_page.sign6_desc'), longDesc: t('traffic_signs_page.sign6_long'), icon: r6 },
        { id: 7, title: t('traffic_signs_page.sign7_title'), desc: t('traffic_signs_page.sign7_desc'), longDesc: t('traffic_signs_page.sign7_long'), icon: r7 },
        { id: 8, title: t('traffic_signs_page.sign8_title'), desc: t('traffic_signs_page.sign8_desc'), longDesc: t('traffic_signs_page.sign8_long'), icon: r8 },
        { id: 9, title: t('traffic_signs_page.sign9_title'), desc: t('traffic_signs_page.sign9_desc'), longDesc: t('traffic_signs_page.sign9_long'), icon: r9 },
        { id: 10, title: t('traffic_signs_page.sign10_title'), desc: t('traffic_signs_page.sign10_desc'), longDesc: t('traffic_signs_page.sign10_long'), icon: r10 },
        { id: 11, title: t('traffic_signs_page.sign11_title'), desc: t('traffic_signs_page.sign11_desc'), longDesc: t('traffic_signs_page.sign11_long'), icon: r11 },
        { id: 12, title: t('traffic_signs_page.sign12_title'), desc: t('traffic_signs_page.sign12_desc'), longDesc: t('traffic_signs_page.sign12_long'), icon: r12 },
        { id: 13, title: t('traffic_signs_page.sign13_title'), desc: t('traffic_signs_page.sign13_desc'), longDesc: t('traffic_signs_page.sign13_long'), icon: r13 },
        { id: 14, title: t('traffic_signs_page.sign14_title'), desc: t('traffic_signs_page.sign14_desc'), longDesc: t('traffic_signs_page.sign14_long'), icon: r14 },
        { id: 15, title: t('traffic_signs_page.sign15_title'), desc: t('traffic_signs_page.sign15_desc'), longDesc: t('traffic_signs_page.sign15_long'), icon: r15 },
        { id: 16, title: t('traffic_signs_page.sign16_title'), desc: t('traffic_signs_page.sign16_desc'), longDesc: t('traffic_signs_page.sign16_long'), icon: r16 },
        { id: 17, title: t('traffic_signs_page.sign17_title'), desc: t('traffic_signs_page.sign17_desc'), longDesc: t('traffic_signs_page.sign17_long'), icon: r17 },
        { id: 18, title: t('traffic_signs_page.sign18_title'), desc: t('traffic_signs_page.sign18_desc'), longDesc: t('traffic_signs_page.sign18_long'), icon: r18 },
        { id: 19, title: t('traffic_signs_page.sign19_title'), desc: t('traffic_signs_page.sign19_desc'), longDesc: t('traffic_signs_page.sign19_long'), icon: r19 },
        { id: 20, title: t('traffic_signs_page.sign20_title'), desc: t('traffic_signs_page.sign20_desc'), longDesc: t('traffic_signs_page.sign20_long'), icon: r20 }
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
                        {t('traffic_signs_page.title')}
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
                        {t('traffic_signs_page.tip')}
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
                                        <h4 className="text-lg font-black mb-3 uppercase tracking-wider text-white">{t('traffic_signs_page.detailed_guide')}</h4>
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
