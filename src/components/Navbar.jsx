import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import logo from '../assets/logo.png';
import { CityConfig } from '../config/cityConfig';

const Navbar = ({ currentCity, onCityChange, onScanClick, onReportClick }) => {
    const { language, toggleLanguage, t } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const containerVariants = {
        hidden: { y: -100, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.8,
                ease: "easeOut",
                when: "beforeChildren",
                staggerChildren: 0.1,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.5, ease: "easeOut" }
        }
    };

    const logoVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.8 }
        }
    };

    const buttonVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { duration: 0.6, ease: "easeIn" }
        }
    };

    return (
        <motion.nav
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="sticky top-0 z-50 bg-[#0d181c] text-white py-5 font-sans w-full  mx-auto shadow-md"
        >
            <div className="w-[90%] mx-auto flex justify-between items-center px-2 md:px-0">
                {/* Logo */}
                <motion.div variants={logoVariants} className="flex items-center">
                    <img src={logo} alt="Safe Roads India" className="h-8 lg:h-10 w-auto brightness-0 invert" />
                </motion.div>

                {/* Desktop Menu */}
                <div className="hidden lg:flex items-center space-x-8 text-gray-300 font-medium text-[16px]">
                    <motion.div variants={itemVariants}>
                        <Link to="/" className="hover:text-red-400 transition-colors cursor-pointer">{t('footer.home') || 'Home'}</Link>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <Link to="/signs" className="hover:text-red-400 transition-colors cursor-pointer">{t('navbar.traffic_rules')}</Link>
                    </motion.div>
                    <motion.div variants={itemVariants}><Link to="/safe-driving" className="hover:text-red-400 transition-colors cursor-pointer">{t('navbar.safety_rules')}</Link></motion.div>
                    {/* City Switcher */}
                    <motion.div variants={itemVariants} className="relative group">
                        <button className="flex items-center space-x-1 hover:text-white cursor-pointer">
                            <span>{CityConfig[currentCity].name}</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </button>
                        <div className="absolute top-full left-0 mt-2 w-32 bg-[#0d181c] border border-gray-700 rounded shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                            {Object.keys(CityConfig).map(cityKey => (
                                <button
                                    key={cityKey}
                                    onClick={() => onCityChange(cityKey)}
                                    className={`block w-full text-left px-4 py-2 hover:bg-gray-700 ${currentCity === cityKey ? 'text-red-400' : 'text-gray-300'}`}
                                >
                                    {CityConfig[cityKey].name}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                </div>

                <div className="hidden lg:flex items-center space-x-3">
                    <motion.button
                        variants={buttonVariants}
                        onClick={toggleLanguage}
                        className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 px-3 py-2 rounded-full transition-all text-xs font-black cursor-pointer flex items-center gap-2"
                    >
                        <span>{language === 'en' ? 'HI' : 'EN'}</span>
                    </motion.button>

                    <motion.button
                        variants={buttonVariants}
                        onClick={onScanClick}
                        className="border border-gray-500 hover:border-white hover:bg-white/10 text-white px-6 py-2 rounded-full transition-all text-sm font-medium cursor-pointer"
                    >
                        {t('navbar.scan')}
                    </motion.button>
                    <motion.button
                        variants={buttonVariants}
                        onClick={onReportClick}
                        className="bg-red-500 hover:bg-red-600 border border-red-500 text-white px-6 py-2 rounded-full transition-all text-sm font-medium cursor-pointer shadow-lg shadow-red-500/20"
                    >
                        {t('navbar.report')}
                    </motion.button>
                </div>

                <div className="lg:hidden flex items-center space-x-4 z-[60]">
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsOpen(!isOpen)}
                        className="text-gray-300 hover:text-white focus:outline-none cursor-pointer"
                    >
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}></path>
                        </svg>
                    </motion.button>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ y: '-100%', opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: '-100%', opacity: 0 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed inset-0 z-50 bg-[#0d181c] flex flex-col items-center justify-start py-5 p-4 space-y-5 text-center"
                    >
                        {/* Mobile Menu Header with Logo */}
                        <div className="w-full flex justify-between items-center mb-2 px-2">
                            <img src={logo} alt="Safe Roads India" className="h-8 w-auto brightness-0 invert" />
                            <div className="w-8"></div> {/* Spacer for the toggle icon which is z-60 */}
                        </div>

                        <div className="flex flex-col space-y-5 w-full max-w-sm">
                            <hr className="border-gray-800 w-full mb-2 opacity-50" />
                            <Link to="/" onClick={() => setIsOpen(false)} className="text-lg font-medium text-gray-300 hover:text-red-400 py-1 transition-colors">{t('footer.home') || 'Home'}</Link>

                            <Link to="/signs" onClick={() => setIsOpen(false)} className="text-lg font-medium text-gray-300 hover:text-red-400 py-1 transition-colors">{t('navbar.traffic_rules')}</Link>
                            <Link to="/safe-driving" onClick={() => setIsOpen(false)} className="text-lg font-medium text-gray-300 hover:text-red-400 py-1 transition-colors">{t('navbar.safety_rules')}</Link>

                            {/* Mobile City Selection */}
                            <div className="py-8 border-y border-gray-800 w-full">
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">{t('navbar.select_city')}</p>
                                <div className="flex flex-wrap justify-center gap-3">
                                    {Object.keys(CityConfig).map(cityKey => (
                                        <motion.button
                                            whileTap={{ scale: 0.95 }}
                                            key={cityKey}
                                            onClick={() => {
                                                onCityChange(cityKey);
                                                setIsOpen(false);
                                            }}
                                            className={`px-6 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${currentCity === cityKey
                                                ? 'bg-red-500 text-white shadow-lg shadow-red-500/20'
                                                : 'bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10'}`}
                                        >
                                            {CityConfig[cityKey].name}
                                        </motion.button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-col space-y-4 pt-4">
                                <motion.button
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => {
                                        toggleLanguage();
                                        setIsOpen(false);
                                        navigate('/');
                                    }}
                                    className="bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/20 px-8 py-3 rounded-full w-full text-lg font-bold flex items-center justify-center gap-3"
                                >
                                    <span>{language === 'en' ? 'हिन्दी (Hindi)' : 'English (EN)'}</span>
                                </motion.button>

                                <motion.button
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => {
                                        onScanClick();
                                        setIsOpen(false);
                                    }}
                                    className="border border-gray-600 hover:border-white text-white px-8 py-3 rounded-full w-full text-lg font-medium cursor-pointer transition-all"
                                >
                                    {t('navbar.scan')}
                                </motion.button>
                                <motion.button
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => {
                                        onReportClick();
                                        setIsOpen(false);
                                    }}
                                    className="bg-red-500 hover:bg-red-600 border border-red-500 text-white px-8 py-3 rounded-full w-full text-lg font-medium cursor-pointer transition-all shadow-lg shadow-red-500/20"
                                >
                                    {t('navbar.report')}
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
};

export default Navbar;
