import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { fetchTrafficStats } from '../services/trafficService';
import AccidentCard from './AccidentCard';
import CongestionCard from './CongestionCard';
import TrafficTrendChart from './TrafficTrendChart';

const TrafficDashboard = ({ cityData }) => {
    // Poll every 30 seconds
    const { data, isLoading, isError } = useQuery({
        queryKey: ['trafficStats', cityData.name],
        queryFn: () => fetchTrafficStats({ center: cityData.center, bbox: cityData.bbox }),
        refetchInterval: 30000,
    });

    if (isLoading) return <div className="text-center py-10 text-gray-500">Live traffic data loading...</div>;
    if (isError) return <div className="text-center py-10 text-red-500">Error connecting to traffic servers.</div>;

    return (
        <div className="flex flex-col space-y-8 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full md:h-[400px]">
                {/* Left Block - Live Map with Incident Overlay */}
                <motion.div
                    initial={{ opacity: 0, x: typeof window !== 'undefined' && window.innerWidth >= 768 ? -50 : 0, y: typeof window !== 'undefined' && window.innerWidth < 768 ? 50 : 0 }}
                    whileInView={{ opacity: 1, x: 0, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="h-full"
                >
                    <AccidentCard data={data} center={cityData.center} />
                </motion.div>

                {/* Right Block - Congestion Gauge */}
                <motion.div
                    initial={{ opacity: 0, x: typeof window !== 'undefined' && window.innerWidth >= 768 ? 50 : 0, y: typeof window !== 'undefined' && window.innerWidth < 768 ? 50 : 0 }}
                    whileInView={{ opacity: 1, x: 0, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                    className="h-full"
                >
                    <div className="h-full">
                        <CongestionCard data={data} />
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default TrafficDashboard;
