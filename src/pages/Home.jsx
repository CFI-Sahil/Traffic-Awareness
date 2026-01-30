import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import HeroBanner from '../components/HeroBanner';
import TrafficDashboard from '../components/TrafficDashboard';
import TrafficLightGuide from '../components/TrafficLightGuide';
import InteractiveMapSection from '../components/InteractiveMapSection';
import SafetyCarousel from '../components/SafetyCarousel';
import TrafficAwareness from '../components/TrafficAwareness';
import SafetyRulesCards from '../components/SafetyRulesCards';
import TrafficRulesCards from '../components/TrafficRulesCards';
import { CityConfig } from '../config/cityConfig';

const Home = ({ currentCity }) => {
    const cityData = CityConfig[currentCity];

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <>
            {/* hero banner */}
            <div className="w-[90%] mx-auto mt-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                    className="shadow-2xl rounded-xl overflow-hidden bg-white"
                >
                    <HeroBanner cityData={cityData} />
                </motion.div>
            </div>

            {/* Interactive Map Section */}
            <motion.section
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="w-[85%] 2xl:w-[80%] mx-auto my-10"
            >
                <InteractiveMapSection />
            </motion.section>

            {/* Dashboard Section */}
            <section id="traffic-insights" className="w-[90%] mx-auto my-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 px-2 border-l-4 border-red-500">Live Traffic Insights: {cityData.name}</h2>
                <TrafficDashboard cityData={cityData} />
            </section>

            {/* General Traffic Rules Section (Premium UI) */}
            <section className="w-[90%] mx-auto my-14">
                <div className="flex justify-between items-start mb-8 px-2">
                    <div>
                        <h2 className="text-xl lg:text-2xl font-bold text-gray-800 border-l-4 border-red-500 pl-2 lg:pl-3">Traffic Rules</h2>
                        <p className="text-gray-500 text-xs lg:text-sm mt-1 pl-3 lg:pl-4">Follow these rules to ensure safety on the road</p>
                    </div>
                </div>
                <TrafficRulesCards />
            </section>

            {/* Safety Rules Cards Section */}
            <section className="w-[90%] mx-auto my-14">
                <div className="flex justify-between items-start mb-8 px-2">
                    <div>
                        <h2 className="text-xl lg:text-2xl font-bold text-gray-800 border-l-4 border-red-500 pl-2 lg:pl-3">Road Safety Rules</h2>
                        <p className="text-gray-500 text-xs lg:text-sm mt-1 pl-3 lg:pl-4">Essential guidelines for safe commuting</p>
                    </div>
                    <Link to="/signs" className="text-[#0d181c] font-bold text-sm hover:underline flex items-center gap-1 mt-1 group">
                        View All
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
                    </Link>
                </div>
                <SafetyRulesCards />
            </section>


            {/* Traffic Light Guide Section */}
            <section className="w-[90%] mx-auto my-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 px-2 border-l-4 border-red-500">Traffic Signal Guide</h2>
                <TrafficLightGuide />
            </section>

            {/* Safety Reminders Carousel */}
            <section className="w-full xl:w-[90%] mx-auto my-10">
                <SafetyCarousel />
            </section>

            {/* Traffic Awareness Section (Tips & Fines) */}
            <section className="w-[85%] mx-auto my-10 mb-20">
                <TrafficAwareness />
            </section>
        </>
    );
};

export default Home;
