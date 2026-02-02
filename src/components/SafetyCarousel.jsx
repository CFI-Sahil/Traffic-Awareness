import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import ban1 from '../assets/ban1.png';
import ban2 from '../assets/ban2.png';
import ban3 from '../assets/ban3.png';
import logo from '../assets/logo.png';

const SafetyCarousel = () => {
    const { t } = useLanguage();
    const slides = [
        {
            id: 1,
            image: ban1,
            title: t('safety_carousel.buckle_up_title'),
            subtitle: t('safety_carousel.buckle_up_sub'),
            color: "bg-blue-600",
            icon: "🛡️"
        },
        {
            id: 2,
            image: ban2,
            title: t('safety_carousel.helmet_title'),
            subtitle: t('safety_carousel.helmet_sub'),
            color: "bg-orange-500",
            icon: "⛑️"
        },
        {
            id: 3,
            image: ban3,
            title: t('safety_carousel.stay_alert_title'),
            subtitle: t('safety_carousel.stay_alert_sub'),
            color: "bg-red-600",
            icon: "👀"
        }
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto-advance
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [slides.length]);

    const slide = slides[currentIndex];

    return (
        <div className="w-full px-0">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8, ease: [0.215, 0.61, 0.355, 1] }}
                className="flex flex-row items-center justify-center mb-6 md:mb-8 gap-1 md:gap-2 px-2 md:px-0"
            >
                <div className="h-10 md:h-14 bg-red-400 p-2 md:p-4 px-3 xl:px-6 rounded-l-full shadow-md flex items-center justify-center shrink-0">
                    <img src={logo} alt="Safe Roads India" className="h-full w-auto object-contain invert-0 brightness-600" />
                </div>
                <div className="h-10 md:h-14 bg-green-300 p-3 md:p-6 px-3 xl:px-10 rounded-r-full shadow-md flex items-center">
                    <h2 className="text-[14px] sm:text-lg md:text-xl font-bold text-gray-700 tracking-wide uppercase whitespace-nowrap">{t('home.safety_reminders')}</h2>
                </div>
            </motion.div>

            {/* Carousel Container */}
            <div className="relative w-full aspect-[16/9] md:aspect-[2.5/1] md:rounded-3xl overflow-hidden md:shadow-2xl md:border-4 md:border-white group">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6 }}
                        className="absolute inset-0"
                    >
                        <img
                            src={slide.image}
                            alt={slide.title}
                            className="w-full h-full object-cover"
                        />

                        {/* Overlay Gradient - Balanced for desktop visible elements */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                        {/* DESKTOP Content Badge (Hidden on mobile) */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center"
                        >
                            <div className="relative">
                                {/* Shield BG */}
                                <div className="absolute inset-0 bg-white rounded-t-lg transform skew-x-12 opacity-90 mx-auto w-3/4 -z-10 bottom-[-10px]"></div>

                                {/* Main Button */}
                                <div className={`flex items-center space-x-3 ${slide.color} px-8 py-3 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.3)] border-2 border-white/20 backdrop-blur-sm transform hover:scale-105 transition-transform`}>
                                    <span className="text-2xl">{slide.icon}</span>
                                    <div className="text-center">
                                        <h3 className="text-white font-black text-lg md:text-xl tracking-wider shadow-black drop-shadow-md">{slide.title}</h3>
                                    </div>
                                    <div className="bg-white/20 p-1 rounded-full">
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Pagination Dots */}
            <div className="flex justify-center mt-6 space-x-3">
                {slides.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`transition-all duration-300 rounded-full cursor-pointer h-2 ${idx === currentIndex ? 'w-6 bg-blue-600' : 'w-2 border border-blue-600 hover:bg-white'
                            }`}
                    />
                ))}
            </div>
        </div>
    );
};

export default SafetyCarousel;
