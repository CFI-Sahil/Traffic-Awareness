import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LiveTrafficMap from './LiveTrafficMap';

const AccidentCard = ({ data, center }) => {
    const { accidentCount, recentIncidents } = data || { accidentCount: 0, recentIncidents: [] };

    return (
        <div className="relative overflow-hidden rounded-2xl bg-black/80 backdrop-blur-xl border border-white/10 flex flex-col items-center justify-between shadow-2xl h-full min-h-[400px]">
            {/* Map Background */}
            <div className="absolute inset-0 z-0">
                <LiveTrafficMap incidents={recentIncidents} center={center} />
            </div>

            {/* Overlay Header */}
            <div className="absolute top-4 left-0 right-0 z-10 flex flex-col items-center pointer-events-none">
                <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 flex items-center space-x-3">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                    <span className="text-white font-bold text-xl drop-shadow-md">{accidentCount} <span className="text-xs font-normal text-gray-300 uppercase">Incidents</span></span>
                </div>
            </div>

            {/* Bottom Overlay Info - Only visible if user interacts or maybe static */}
            <div className="absolute bottom-0 w-full z-10 p-4 bg-gradient-to-t from-black/90 to-transparent pointer-events-none">
                <div className="flex justify-between items-end">
                    <div>
                        <p className="text-xs text-gray-400 mb-1">Latest Update</p>
                        <p className="text-sm text-white font-medium">{recentIncidents[0]?.location || 'Monitoring...'}</p>
                    </div>
                    <span className="text-[10px] text-gray-500">MapMyIndia Feed</span>
                </div>
            </div>
        </div>
    );
};

export default AccidentCard;
