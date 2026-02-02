import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import TrafficDashboard from './components/TrafficDashboard';
import TrafficLightGuide from './components/TrafficLightGuide';
import InteractiveMapSection from './components/InteractiveMapSection';
import SafetyCarousel from './components/SafetyCarousel';
import TrafficAwareness from './components/TrafficAwareness';
import Footer from './components/Footer';
import { CityConfig } from './config/cityConfig';

import SigSenseBot from './components/SigSenseBot';
import RoadScanner from './components/RoadScanner';
import AccidentReporter from './components/AccidentReporter';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import TrafficSignsPage from './pages/TrafficSignsPage';
import SafeDrivingPage from './pages/SafeDrivingPage';

const queryClient = new QueryClient();

function App() {
  const [currentCity, setCurrentCity] = useState('delhi');
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <Router>
          <div className="min-h-screen">
            <Navbar
              currentCity={currentCity}
              onCityChange={setCurrentCity}
              onScanClick={() => setIsScannerOpen(true)}
              onReportClick={() => setIsReportOpen(true)}
            />

            <Routes>
              <Route path="/" element={<Home currentCity={currentCity} />} />
              <Route path="/signs" element={<TrafficSignsPage />} />
              <Route path="/safe-driving" element={<SafeDrivingPage />} />
            </Routes>

            <Footer />
            <SigSenseBot />
            <RoadScanner isOpen={isScannerOpen} onClose={() => setIsScannerOpen(false)} />
            <AccidentReporter
              isOpen={isReportOpen}
              onClose={() => setIsReportOpen(false)}
              onSwitchToScan={() => {
                setIsReportOpen(false);
                setIsScannerOpen(true);
              }}
            />
          </div>
        </Router>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
