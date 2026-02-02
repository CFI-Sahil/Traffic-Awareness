import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ban2 from '../assets/b1.png';
import { fetchWeather } from '../services/weatherService';
const HeroBanner = ({ cityData }) => {
    const [weather, setWeather] = useState('Clear'); // 'Clear', 'Rain', 'Fog'

    useEffect(() => {
        // Fetch Weather
        const loadWeather = async () => {
            if (cityData) {
                const condition = await fetchWeather(cityData.center[0], cityData.center[1]);
                setWeather(condition);
            }
        };
        loadWeather();
    }, [cityData]); // Re-run when cityData changes

    return (
        <div className="w-full">
            <div className="relative w-full mx-auto">

                <div className="relative w-full h-[500px] bg-gray-900 overflow-hidden">
                    {/* Background Image */}
                    <img
                        src={ban2}
                        alt="Background"
                        className={`w-full h-full object-cover object-center transition-all duration-1000 ${weather === 'Fog' ? 'blur-sm grayscale' : ''
                            }`}
                    />

                    {/* Weather Overlay: Rain */}
                    {weather === 'Rain' && (
                        <div className="absolute inset-0 pointer-events-none z-10 bg-black/20">
                            {/* Simple CSS Rain Effect simulation via background image or particles */}
                            {/* Ideally canvas, but for simplicity using a tiled rain gif or css animation */}
                            <div className="absolute inset-0 opacity-50 bg-[url('https://cdn.dribbble.com/users/191295/screenshots/6262483/rain.gif')] bg-cover mix-blend-screen"></div>
                        </div>
                    )}

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10"></div>

                    {/* Content Overlay */}
                    <div className="absolute inset-0 z-20 flex items-center justify-between px-12 lg:px-24">
                        {/* Main Text Content */}
                        <div className="flex-1 ml-0 text-center md:text-left">

                            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black text-white leading-tight font-sans tracking-tight">
                                YOUR JOURNEY,<span className="text-cyan-400">YOUR SAFETY.</span><br />
                                DRIVE SMARTER.
                            </h1>

                            <p className="mt-6 text-gray-300 max-w-xl text-sm md:text-base leading-relaxed font-medium">
                                Real-time traffic monitoring powered by AI. Get live alerts, traffic-rule guidance, and road safety insights to help prevent accidents and ensure safer journeys.
                            </p>

                            <div className="mt-8 flex flex-wrap gap-4 justify-center md:justify-start">
                                <button
                                    onClick={() => {
                                        const target = document.getElementById('traffic-insights');
                                        if (target) {
                                            const navbarHeight = 100; // Offset for sticky navbar
                                            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                                            const startPosition = window.pageYOffset;
                                            const distance = targetPosition - startPosition;
                                            const duration = 1500; // Significantly increased duration
                                            let start = null;

                                            const animation = (timestamp) => {
                                                if (!start) start = timestamp;
                                                const progress = timestamp - start;
                                                const percentage = Math.min(progress / duration, 1);

                                                // Cubic bezier-like easing function (easeInOutCubic)
                                                const easing = percentage < 0.5
                                                    ? 4 * percentage * percentage * percentage
                                                    : 1 - Math.pow(-2 * percentage + 2, 3) / 2;

                                                window.scrollTo(0, startPosition + distance * easing);

                                                if (progress < duration) {
                                                    window.requestAnimationFrame(animation);
                                                }
                                            };
                                            window.requestAnimationFrame(animation);
                                        }
                                    }}
                                    className="bg-[#ff5757] hover:bg-[#ff4040] text-white px-8 py-3 rounded-full font-bold transition-all shadow-[0_0_20px_rgba(255,87,87,0.4)] hover:shadow-[0_0_30px_rgba(255,87,87,0.6)] hover:-translate-y-1 cursor-pointer"
                                >
                                    Live Alerts
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroBanner;
