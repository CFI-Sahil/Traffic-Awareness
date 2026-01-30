import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';

const SafeDrivingPage = () => {
    const containerRef = useRef(null);
    const canvasRef = useRef(null);
    const [images, setImages] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [progress, setProgress] = useState(0);

    // Load  100 images
    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchImages = async () => {
            const imagePaths = Array.from({ length: 100 }, (_, i) => {
                const frameNum = String(i + 1).padStart(3, '0');
                // Use new URL for assets in Vite to ensure they are handled correctly
                return new URL(`../assets/new bike/ezgif-frame-${frameNum}.jpg`, import.meta.url).href;
            });

            try {
                const loadedImages = await Promise.all(
                    imagePaths.map(path => {
                        return new Promise((resolve) => {
                            const img = new Image();
                            img.src = path;
                            img.onload = () => resolve(img);
                            img.onerror = () => {
                                console.warn(`Failed to load frame: ${path}`);
                                resolve(null);
                            };
                        });
                    })
                );

                const validImages = loadedImages.filter(Boolean);
                setImages(validImages);
                setLoaded(true);
            } catch (err) {
                console.error("Error loading image sequence:", err);
            }
        };

        fetchImages();
    }, []);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // Extract progress for text animations
    useEffect(() => {
        const unsubscribe = scrollYProgress.on("change", (latest) => {
            setProgress(latest);
        });
        return () => unsubscribe();
    }, [scrollYProgress]);

    // Map scroll progress to frame index
    const frameIndex = useTransform(scrollYProgress, [0, 1], [0, 99]);

    // Opacity for side text - stays visible until the end
    const sideTextOpacity = useTransform(scrollYProgress, [0.97, 0.99], [1, 0]);

    // Smooth the frame scrubbing
    const smoothFrameIndex = useSpring(frameIndex, { stiffness: 400, damping: 40, mass: 1 });

    useEffect(() => {
        if (!loaded || images.length === 0) return;

        const render = (index) => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            const imgIdx = Math.min(Math.floor(index), images.length - 1);
            const img = images[imgIdx];

            if (img && ctx) {
                const canvasAspect = canvas.width / canvas.height;
                const imgAspect = img.width / img.height;
                let drawWidth = canvas.width;
                let drawHeight = canvas.height;
                let offsetX = 0;
                let offsetY = 0;

                // Center-Cover behavior
                if (imgAspect > canvasAspect) {
                    drawWidth = canvas.height * imgAspect;
                    offsetX = (canvas.width - drawWidth) / 2;
                } else {
                    drawHeight = canvas.width / imgAspect;
                    offsetY = (canvas.height - drawHeight) / 2;
                }

                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
            }
        };

        const unsubscribe = smoothFrameIndex.on("change", (latest) => {
            render(latest);
        });

        // Initial render
        render(0);

        return () => unsubscribe();
    }, [loaded, images, smoothFrameIndex]);

    useEffect(() => {
        const handleResize = () => {
            if (canvasRef.current) {
                canvasRef.current.width = window.innerWidth;
                canvasRef.current.height = window.innerHeight;
                // Re-draw current frame on resize
                const ctx = canvasRef.current.getContext('2d');
                const currentIdx = Math.min(Math.floor(smoothFrameIndex.get()), images.length - 1);
                if (images[currentIdx]) {
                    ctx.drawImage(images[currentIdx], 0, 0, canvasRef.current.width, canvasRef.current.height);
                }
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [loaded, images, smoothFrameIndex]);

    const textSequences = [
        { start: 0, end: 0.2, text: "SPEED IS A BLUR", sub: "Motion is powerful, but control is essential." },
        { start: 0.3, end: 0.5, text: "NAVIGATING CHAOS", sub: "In heavy traffic, awareness is your best gear." },
        { start: 0.6, end: 0.8, text: "STEADY PROGRESS", sub: "Stability comes when you slow down and see clearly." },
        { start: 0.9, end: 1.0, text: "ARRIVE SAFELY", sub: "The road belongs to those who respect it." }
    ];

    return (
        <div ref={containerRef} className="relative h-[950vh] bg-black -mt-[82px]">
            <div className="sticky top-0 left-0 w-full h-screen overflow-hidden flex items-center justify-center">
                {!loaded && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-50 bg-[#0d181c] text-white">
                        <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-red-600 shadow-[0_0_15px_rgba(239,68,68,0.5)]"
                                initial={{ width: "0%" }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 3, ease: "easeInOut" }}
                            />
                        </div>
                        <p className="mt-6 font-black tracking-[0.3em] text-[10px] opacity-70 uppercase animate-pulse">
                            Preparing Cinematic Sequence
                        </p>
                    </div>
                )}

                <motion.div
                    style={{
                        scale: useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [1.1, 1, 1, 1.1]),
                        opacity: useTransform(scrollYProgress, [0.97, 0.99], [1, 0])
                    }}
                    className="w-full h-full"
                >
                    <canvas
                        ref={canvasRef}
                        className={`w-full h-full object-cover transition-opacity duration-1000 ${loaded ? 'opacity-100' : 'opacity-0'}`}
                    />
                </motion.div>

                {/* Vignette Overlay for cinematic feel */}
                <motion.div
                    style={{ opacity: useTransform(scrollYProgress, [0.97, 0.99], [1, 0]) }}
                    className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle,transparent_20%,rgba(0,0,0,0.8)_100%)] z-10"
                />

                {/* Overlay Text */}
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center pointer-events-none px-6">
                    <AnimatePresence mode="wait">
                        {textSequences.map((seq, idx) => (
                            progress >= seq.start && progress <= seq.end && (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 50, filter: "blur(20px)", scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
                                    exit={{ opacity: 0, y: -50, filter: "blur(20px)", scale: 1.05 }}
                                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                                    className="max-w-4xl"
                                >
                                    <h1 className="text-5xl md:text-7xl lg:text-9xl font-[1000] text-white tracking-tighter mb-4 uppercase leading-[0.85] drop-shadow-2xl">
                                        {seq.text.split(" ").map((word, i) => (
                                            <span key={i} className={i % 2 === 1 ? "text-red-600" : ""}>{word} </span>
                                        ))}
                                    </h1>
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.5, duration: 1 }}
                                        className="text-base md:text-xl font-bold text-slate-200 uppercase tracking-[0.4em] mt-14"
                                    >
                                        {seq.sub}
                                    </motion.p>
                                </motion.div>
                            )
                        ))}
                    </AnimatePresence>
                </div>

                {/* Bottom UI - Progress */}
                <motion.div
                    style={{ opacity: useTransform(scrollYProgress, [0.95, 0.98], [1, 0]) }}
                    className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center"
                >
                    <span className="text-[9px] font-black text-white/60 tracking-[0.5em] mb-4 uppercase">Scroll Down</span>
                    <div className="w-1 h-12 bg-white/10 rounded-full relative overflow-hidden">
                        <motion.div
                            className="absolute top-0 left-0 w-full bg-red-500 rounded-full"
                            style={{ height: useTransform(scrollYProgress, [0, 1], ["0%", "100%"]) }}
                        />
                    </div>
                </motion.div>
                {/* Scene Description Card (Left Side) - Only visible after loading and during animation */}
                <AnimatePresence>
                    {loaded && (
                        <motion.div
                            style={{
                                opacity: sideTextOpacity
                            }}
                            initial={{ x: -100, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -100, opacity: 0 }}
                            transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
                            className="absolute top-[55%] -translate-y-1/2 left-12 z-30 hidden lg:block border-l-2 border-red-500 pl-6 h-32 flex flex-col justify-center"
                        >
                            <p className="text-white font-black text-base tracking-widest uppercase mb-2">Technical Insight</p>
                            <p className="text-red-500 text-lg max-w-[250px] font-medium leading-relaxed">
                                Visualizing the transition from <span className="text-white">High Velocity Blur</span> to <span className="text-white">Stable Awareness.</span>
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Traffic Fine Calculator Reveal - Fixed within the final scroll state */}
                <motion.div
                    style={{
                        opacity: useTransform(scrollYProgress, [0.98, 0.99], [0, 1]),
                        pointerEvents: progress > 0.98 ? 'auto' : 'none',
                        backgroundColor: '#E0E5EC'
                    }}
                    className="absolute top-0 left-0 w-full h-screen z-50 flex items-center justify-center"
                >
                    <div className="pt-[82px] w-full flex items-center justify-center">
                        <TrafficFineCalculator />
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

const TrafficFineCalculator = () => {
    const [vehicle, setVehicle] = useState('Bike');
    const [violation, setViolation] = useState('');
    const [fine, setFine] = useState(null);

    const violations = [
        { id: 'helmet', label: 'No Helmet', amount: 1000, vehicles: ['Bike'] },
        { id: 'seatbelt', label: 'No Seatbelt', amount: 1000, vehicles: ['Car'] },
        { id: 'speeding', label: 'Speeding', amount: 2000, vehicles: ['Bike', 'Car'] },
        { id: 'redlight', label: 'Red Light Jumping', amount: 5000, vehicles: ['Bike', 'Car'] },
        { id: 'drunk', label: 'Drunk Driving', amount: 10000, vehicles: ['Bike', 'Car'] },
        { id: 'license', label: 'Driving without License', amount: 5000, vehicles: ['Bike', 'Car'] },
        { id: 'insurance', label: 'No Insurance', amount: 2000, vehicles: ['Bike', 'Car'] }
    ];

    const filteredViolations = violations.filter(v => v.vehicles.includes(vehicle));

    const handleCalculate = () => {
        const selected = violations.find(v => v.label === violation);
        if (selected) {
            setFine(selected.amount);
        }
    };

    return (
        <section className="relative w-full flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="w-[92%] max-w-[480px] h-[540px] md:h-[650px] bg-white rounded-[32px] md:rounded-[40px] p-6 md:p-10 shadow-[20px_20px_60px_#bebebe,-20px_-20px_60px_#ffffff] flex flex-col relative z-10"
            >
                {/* Header */}
                <div className="mb-4 md:mb-6">
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4 shadow-md border border-red-100">
                        <svg className="w-6 h-6 md:w-7 md:h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h2 className="text-xl md:text-2xl font-[900] text-gray-800 tracking-tight uppercase leading-none text-center">
                        Traffic Fine <br />
                        <span className="text-red-600">Calculator</span>
                    </h2>
                    <p className="text-gray-400 text-[9px] md:text-[10px] font-bold tracking-[0.2em] mt-2 md:mt-3 uppercase text-center">Updated Penalties</p>
                </div>

                {/* Vehicle Selector */}
                <div className="flex bg-gray-100 rounded-2xl p-1 mb-4 md:mb-6">
                    {['Bike', 'Car'].map((type) => (
                        <button
                            key={type}
                            onClick={() => {
                                setVehicle(type);
                                setViolation('');
                                setFine(null);
                            }}
                            className={`flex-1 py-2.5 md:py-3 rounded-xl cursor-pointer font-black text-[10px] md:text-[12px] tracking-widest uppercase transition-all flex items-center justify-center gap-2 ${vehicle === type
                                ? 'bg-white text-red-600 shadow-md transform scale-[1.02]'
                                : 'text-gray-400 hover:text-gray-600'
                                }`}
                        >
                            <span>{type === 'Bike' ? '🏍️' : '🚗'}</span>
                            {type}
                        </button>
                    ))}
                </div>

                {/* Violation Selection - Scrollable Area */}
                <div className="flex-1 overflow-hidden flex flex-col mb-4 md:mb-6">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 block pl-2">Select Violation</label>
                    <div className="flex-1 overflow-y-auto pr-1 space-y-2 custom-scrollbar">
                        {filteredViolations.map((v) => (
                            <button
                                key={v.id}
                                onClick={() => {
                                    setViolation(v.label);
                                    setFine(null);
                                }}
                                className={`w-full text-left p-3 md:p-3.5 cursor-pointer rounded-xl border transition-all flex items-center justify-between group ${violation === v.label
                                    ? 'bg-red-50 border-red-200 text-gray-800'
                                    : 'bg-gray-50 border-gray-100 text-gray-500 hover:bg-gray-100'
                                    }`}
                            >
                                <span className={`text-[12px] md:text-[13px] font-bold ${violation === v.label ? 'translate-x-1' : 'group-hover:translate-x-1'} transition-transform`}>
                                    {v.label}
                                </span>
                                {violation === v.label && (
                                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Bottom Section - Result & Button */}
                <div className="mt-auto space-y-3 md:space-y-4">
                    <AnimatePresence mode="wait">
                        {fine !== null ? (
                            <motion.div
                                key="result"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="bg-gray-50 border border-gray-100 rounded-2xl p-4 md:p-5 text-center"
                            >
                                <p className="text-[8px] md:text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] mb-1">Estimated Fine</p>
                                <p className="text-2xl md:text-3xl font-black text-gray-800 tracking-tighter">
                                    <span className="text-red-600 mr-2 text-xl md:text-2xl">₹</span>
                                    {fine.toLocaleString()}
                                </p>
                            </motion.div>
                        ) : (
                            <button
                                key="btn"
                                onClick={handleCalculate}
                                disabled={!violation}
                                className="w-full bg-[#0d181c] hover:bg-[#060E10] disabled:bg-gray-200 disabled:text-gray-400 text-white font-black py-4 md:py-4.5 rounded-2xl shadow-xl transition-all active:scale-[0.98] tracking-widest uppercase text-[10px] md:text-xs cursor-pointer"
                            >
                                Calculate Fine
                            </button>
                        )}
                    </AnimatePresence>

                    <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest text-center leading-relaxed">
                        *Based on latest Motor Vehicles Act.
                    </p>
                </div>
            </motion.div>
        </section>
    );
};

export default SafeDrivingPage;
