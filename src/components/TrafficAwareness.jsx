import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import brainIcon from '../assets/brain_icon.png';
import { useLanguage } from '../context/LanguageContext';
import InteractiveMapSection from './InteractiveMapSection';

const TrafficAwareness = () => {
    const { t } = useLanguage();

    const icons = ["⛑️", "🛡️", "⛑️️", "🛑", "🌙", "🌧️", "🚶", "🏍️", "↩️", "👶"];
    const colors = [
        "bg-blue-600", "bg-green-600", "bg-red-500", "bg-orange-500",
        "bg-indigo-600", "bg-cyan-600", "bg-yellow-500", "bg-purple-600",
        "bg-teal-600", "bg-pink-500"
    ];

    const translatedTopics = t('awareness.topics') || [];

    const awarenessTopics = translatedTopics.map((topic, index) => ({
        id: index + 1,
        tip: {
            title: topic.title,
            desc: topic.desc,
            icon: icons[index] || "💡",
            color: colors[index] || "bg-blue-600"
        },
        fact: topic.fact,
        fine: { offense: topic.offense, fine: topic.fine }
    }));

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
                        <h3 className="text-xl font-bold text-slate-800 tracking-tight">{t('awareness.daily_tip_title')}</h3>
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
                        <span className="text-blue-600 cursor-pointer">{t('awareness.know_more')}</span>
                        <button className="flex items-center space-x-1 hover:text-blue-600 transition-colors cursor-pointer">
                            <span>👍</span> <span>{t('awareness.share')}</span>
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
                        <h3 className="text-xl font-bold text-slate-800 tracking-tight">{t('awareness.did_you_know_title')}</h3>
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
                        {t('awareness.knowledge_save_lives')}
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
                        <h3 className="text-xl font-bold text-slate-800 tracking-tight">{t('awareness.fines_title')}</h3>
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
                                    <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">{t('awareness.penalty_up_to')}</span>
                                    <div className="text-4xl font-black text-red-600 mt-1 drop-shadow-sm">
                                        {currentFine.fine}
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Footer */}
                    <div className="bg-gray-50 p-4 border-t border-gray-100 flex justify-between items-center text-sm text-gray-500 font-medium">
                        <span className="text-red-500 font-bold animate-pulse">{t('awareness.stay_aware')}</span>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default TrafficAwareness;
