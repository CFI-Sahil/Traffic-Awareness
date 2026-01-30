import React from 'react';
import { motion } from 'framer-motion';

const Footer = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
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
        <footer className="relative bg-[#0d181c] text-slate-300 font-sans pt-16 pb-8 overflow-hidden">
            {/* Texture Overlay (Optional subtle noise - simulated with CSS if needed, else plain color) */}
            <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] pointer-events-none"></div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.15 }}
                className="relative w-[85%] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-16 border-b border-white/10 pb-12"
            >
                {/* Column 1: Traffic Awareness */}
                <motion.div variants={itemVariants} className="lg:col-span-1">
                    <h3 className="text-white font-bold text-xl mb-6">Traffic Awareness</h3>
                    <ul className="space-y-3 text-sm">
                        <li><a href="#" className="hover:text-white transition-colors cursor-pointer">About Us</a></li>
                        <li><a href="#" className="hover:text-white transition-colors font-medium text-white cursor-pointer">Our Mission</a></li>
                        <li><a href="#" className="hover:text-white transition-colors cursor-pointer">Road Safety Initiative</a></li>
                        <li><a href="#" className="hover:text-white transition-colors cursor-pointer">Statistics & Reports</a></li>
                    </ul>
                    <p className="mt-6 text-xs leading-relaxed text-slate-400 opacity-80">
                        Promoting safer roads through awareness and responsibility.
                    </p>
                </motion.div>

                {/* Column 2: Learn */}
                <motion.div variants={itemVariants} className="lg:col-span-1">
                    <h3 className="text-white font-bold text-xl mb-6">Learn</h3>
                    <ul className="space-y-3 text-sm">
                        <li><a href="#" className="hover:text-white transition-colors cursor-pointer">Traffic Rules</a></li>
                        <li><a href="#" className="hover:text-white transition-colors cursor-pointer">Road Signs Guide</a></li>
                        <li><a href="#" className="hover:text-white transition-colors cursor-pointer">Pedestrian Safety</a></li>
                        <li><a href="#" className="hover:text-white transition-colors cursor-pointer">Two-Wheeler Safety</a></li>
                        <li><a href="#" className="hover:text-white transition-colors cursor-pointer">School Safety</a></li>
                    </ul>
                </motion.div>

                {/* Column 3: Help */}
                <motion.div variants={itemVariants} className="lg:col-span-1">
                    <h3 className="text-white font-bold text-xl mb-6">Help</h3>
                    <ul className="space-y-3 text-sm">
                        <li><a href="#" className="hover:text-white transition-colors cursor-pointer">FAQs</a></li>
                        <li><a href="#" className="hover:text-white transition-colors cursor-pointer">Report Unsafe Driving</a></li>
                        <li><a href="#" className="hover:text-white transition-colors cursor-pointer">Contact Support</a></li>
                        <li><a href="#" className="hover:text-white transition-colors cursor-pointer">Accessibility</a></li>
                        <li><a href="#" className="hover:text-white transition-colors cursor-pointer">Feedback</a></li>
                    </ul>
                </motion.div>

                {/* Column 4: Resources */}
                <motion.div variants={itemVariants} className="lg:col-span-1">
                    <h3 className="text-white font-bold text-xl mb-6">Resources</h3>
                    <ul className="space-y-3 text-sm">
                        <li><a href="#" className="hover:text-white transition-colors cursor-pointer">Laws & Penalties</a></li>
                        <li><a href="#" className="hover:text-white transition-colors cursor-pointer">Downloadables</a></li>
                        <li><a href="#" className="hover:text-white transition-colors cursor-pointer">Campaigns</a></li>
                        <li><a href="#" className="hover:text-white transition-colors cursor-pointer">Media & Press</a></li>
                        <li><a href="#" className="hover:text-white transition-colors cursor-pointer">Volunteer Program</a></li>
                    </ul>
                </motion.div>

                {/* Column 5: Stay Updated */}
                <motion.div variants={itemVariants} className="lg:col-span-1">
                    <h3 className="text-white font-bold text-xl mb-6">Stay Updated</h3>
                    <p className="mb-4 text-sm text-slate-400">Get updates on road safety campaigns and guidelines.</p>

                    <div className="flex space-x-4">
                        {/* Facebook Icon */}
                        <a href="#" className="bg-white/10 p-2 rounded hover:bg-white/20 transition-colors cursor-pointer">
                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path></svg>
                        </a>
                        {/* Twitter Icon */}
                        <a href="#" className="bg-white/10 p-2 rounded hover:bg-white/20 transition-colors cursor-pointer">
                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path></svg>
                        </a>
                        {/* Instagram Icon */}
                        <a href="#" className="bg-white/10 p-2 rounded hover:bg-white/20 transition-colors cursor-pointer">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                        </a>
                        {/* LinkedIn Icon */}
                        <a href="#" className="bg-white/10 p-2 rounded hover:bg-white/20 transition-colors cursor-pointer">
                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                        </a>
                    </div>
                </motion.div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.8, ease: [0.215, 0.61, 0.355, 1] }}
                className="relative w-[85%] mx-auto flex flex-col md:flex-row justify-between items-center text-xs text-slate-500"
            >
                <p>© 2026 Traffic Awareness Initiative. All Rights Reserved.</p>
                <div className="flex space-x-6 mt-4 md:mt-0">
                    <a href="#" className="hover:text-white transition-colors cursor-pointer">Privacy Policy</a>
                    <span className="text-slate-700">|</span>
                    <a href="#" className="hover:text-white transition-colors cursor-pointer">Terms of Service</a>
                    <span className="text-slate-700">|</span>
                    <a href="#" className="hover:text-white transition-colors cursor-pointer">Accessibility</a>
                </div>
            </motion.div>
        </footer>
    );
};

export default Footer;
