import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenerativeAI } from "@google/generative-ai";

// -- Configuration & API Keys --
const API_KEYS = [
    import.meta.env.VITE_GEMINI_KEY_1,
    import.meta.env.VITE_GEMINI_KEY_2
];

const REPORT_PROMPT = `Role: You are an Emergency Roadside Response Specialist.
Context: You are analyzing an image uploaded by a user who is "Reporting" an incident. 

Tasks:
1. Classification: Determine if the image contains:
   a) A road accident (collisions, overturned vehicles, crash scenes, broken glass on road).
   b) A general traffic situation or traffic sign (no accident).
   c) Something completely unrelated (non-road/non-traffic image).

2. Response Logic:
   - If (a) ROAD ACCIDENT:
     - Set "type": "accident"
     - Provide "title": "Accident Scene Detected"
     - Provide "dos": ["Check for injuries immediately", "Call 108 for emergency medical assistance", "Turn on hazard lights if possible", "Place reflective triangles 30m away"]
     - Provide "donts": ["Do not move seriously injured people unless absolutely necessary", "Do not stand on the road to take photos", "Do not argue with other parties"]
   - If (b) TRAFFIC/SIGN ONLY:
     - Set "type": "traffic"
     - Provide "title": "I only provide accident reports"
     - Provide "message": "I only provide accident reports. Please use the 'Scan' button in the above navbar to get the information about the provided traffic image."
   - If (c) UNRELATED:
     - Set "type": "invalid"
     - Provide "title": "I only provide accident reports"
     - Provide "message": "I only provide accident reports. Please provide a clear image of a road accident scene for analysis."

Constraints:
- Return ONLY a valid JSON object.
- Keep tips concise.
- Use a helpful, urgent but calm tone.
`;

const AccidentReporter = ({ isOpen, onClose, onSwitchToScan }) => {
    const [preview, setPreview] = useState(null);
    const [image, setImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [showCameraConfirm, setShowCameraConfirm] = useState(false);
    const keyIndexRef = useRef(0);
    const fileInputRef = useRef(null);
    const cameraInputRef = useRef(null);

    const handleFile = (file) => {
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
            setResult(null);
            setError(null);
            setShowCameraConfirm(false);
        }
    };

    const handleCameraClick = () => {
        setShowCameraConfirm(true);
    };

    const confirmCamera = () => {
        cameraInputRef.current.click();
        setShowCameraConfirm(false);
    };

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result.split(',')[1]);
            reader.onerror = (error) => reject(error);
        });
    };

    const handleAnalyze = async () => {
        if (!image) return;
        setIsLoading(true);
        setError(null);

        const attemptAnalysis = async (retryCount = 0) => {
            try {
                const currentKey = API_KEYS[keyIndexRef.current];
                const genAI = new GoogleGenerativeAI(currentKey);
                const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
                const base64Data = await convertToBase64(image);

                const analysis = await model.generateContent([
                    REPORT_PROMPT,
                    {
                        inlineData: {
                            data: base64Data,
                            mimeType: image.type,
                        },
                    },
                ]);

                const response = await analysis.response;
                const text = response.text();

                const cleanJson = text.replace(/```json/g, "").replace(/```/g, "").trim();
                const jsonResult = JSON.parse(cleanJson);
                setResult(jsonResult);
            } catch (err) {
                // Check if error is Rate Limit (429), Quota, or Invalid/Leaked (400/403)
                const isRetryable = err.message?.includes("429") ||
                    err.message?.includes("quota") ||
                    err.message?.includes("400") ||
                    err.message?.includes("403") ||
                    err.message?.includes("invalid") ||
                    err.message?.includes("forbidden") ||
                    err.message?.includes("leaked");

                if (isRetryable && retryCount < API_KEYS.length - 1) {
                    keyIndexRef.current = (keyIndexRef.current + 1) % API_KEYS.length;
                    return attemptAnalysis(retryCount + 1);
                } else {
                    setError("Unable to process the report. Please try again with fresh API keys.");
                    console.error(err);
                }
            }
        };

        await attemptAnalysis();
        setIsLoading(false);
    };

    const clear = () => {
        setImage(null);
        setPreview(null);
        setResult(null);
        setError(null);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-start sm:items-center justify-center p-4 overflow-y-auto">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-[95%] max-w-sm sm:max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col my-auto sm:my-0"
                    >
                        {/* Header */}
                        <div className="bg-red-600 p-6 text-white flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                    <AlertIcon />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold">Report Incident</h2>
                                    <p className="text-xs opacity-80 uppercase tracking-widest font-bold">Emergency Support</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full cursor-pointer">
                                <CloseIcon />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            {!preview ? (
                                <div className="h-64 relative overflow-hidden bg-gray-50 rounded-2xl">
                                    <AnimatePresence mode="wait">
                                        {!showCameraConfirm ? (
                                            <motion.div
                                                key="selection"
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 20 }}
                                                className="grid grid-cols-2 gap-4 h-full p-1"
                                            >
                                                <button
                                                    onClick={handleCameraClick}
                                                    className="border-2 border-dashed border-red-200 rounded-2xl flex flex-col items-center justify-center gap-3 hover:bg-red-50 transition-all cursor-pointer group"
                                                >
                                                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600 group-hover:scale-110 transition-transform">
                                                        <CameraIcon />
                                                    </div>
                                                    <p className="font-bold text-red-800">Direct Capture</p>
                                                    <input
                                                        ref={cameraInputRef}
                                                        type="file"
                                                        accept="image/*"
                                                        capture="environment"
                                                        onChange={(e) => handleFile(e.target.files[0])}
                                                        className="hidden"
                                                    />
                                                </button>
                                                <button
                                                    onClick={() => fileInputRef.current.click()}
                                                    className="border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-3 hover:bg-gray-50 transition-all cursor-pointer group"
                                                >
                                                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 group-hover:scale-110 transition-transform">
                                                        <GalleryIcon />
                                                    </div>
                                                    <p className="font-bold text-gray-800">Upload Gallery</p>
                                                    <input
                                                        ref={fileInputRef}
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => handleFile(e.target.files[0])}
                                                        className="hidden"
                                                    />
                                                </button>
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="confirm"
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.9 }}
                                                className="flex flex-col items-center justify-center h-full p-8 text-center"
                                            >
                                                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-4 animate-bounce">
                                                    <CameraIcon />
                                                </div>
                                                <h3 className="text-lg font-bold text-gray-800 mb-2">Camera Access Required</h3>
                                                <p className="text-sm text-gray-500 mb-6 font-medium">Safe Roads India needs your permission to open the camera and document the incident scene.</p>
                                                <div className="flex gap-3 w-full max-w-xs">
                                                    <button
                                                        onClick={() => setShowCameraConfirm(false)}
                                                        className="flex-1 py-3 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-100 cursor-pointer"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        onClick={confirmCamera}
                                                        className="flex-1 py-3 bg-red-600 rounded-xl font-bold text-white hover:bg-red-700 shadow-lg shadow-red-200 cursor-pointer"
                                                    >
                                                        Open Camera
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="relative rounded-2xl overflow-hidden border border-gray-100 shadow-md h-48 bg-gray-50">
                                        <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                        {!result && !isLoading && (
                                            <button
                                                onClick={clear}
                                                className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full shadow-lg cursor-pointer"
                                            >
                                                <CloseIcon className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>

                                    {!result && (
                                        <button
                                            onClick={handleAnalyze}
                                            disabled={isLoading}
                                            className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${isLoading
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                : 'bg-red-600 text-white hover:bg-red-700 active:scale-95'
                                                }`}
                                        >
                                            {isLoading ? <Spinner className="w-5 h-5 animate-spin" /> : <ReportIcon className="w-5 h-5" />}
                                            {isLoading ? "Analyzing Scene..." : "Analyze Incident"}
                                        </button>
                                    )}

                                    {error && <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100">{error}</div>}

                                    {result && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="space-y-4 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar"
                                        >
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${result.type === 'accident' ? 'bg-red-500 animate-pulse' : 'bg-blue-500'}`} />
                                                <h3 className="text-lg font-bold text-gray-800">{result.title}</h3>
                                            </div>

                                            {result.type === 'accident' ? (
                                                <div className="space-y-4">
                                                    <div className="bg-green-50 rounded-2xl p-4 border border-green-100">
                                                        <h4 className="text-green-800 font-bold text-sm uppercase flex items-center gap-2 mb-2">
                                                            <CheckIcon className="w-4 h-4" /> What to do
                                                        </h4>
                                                        <ul className="space-y-2">
                                                            {result.dos.map((doItem, i) => (
                                                                <li key={i} className="text-green-700 text-sm font-medium flex gap-2">
                                                                    <span>•</span> {doItem}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                    <div className="bg-red-50 rounded-2xl p-4 border border-red-100">
                                                        <h4 className="text-red-800 font-bold text-sm uppercase flex items-center gap-2 mb-2">
                                                            <XIcon className="w-4 h-4" /> What NOT to do
                                                        </h4>
                                                        <ul className="space-y-2">
                                                            {result.donts.map((dontItem, i) => (
                                                                <li key={i} className="text-red-700 text-sm font-medium flex gap-2">
                                                                    <span>•</span> {dontItem}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100 text-center">
                                                    <div className="text-4xl mb-4">{result.type === 'traffic' ? "🚦" : "❓"}</div>
                                                    <p className="text-blue-800 font-bold leading-relaxed">{result.message}</p>
                                                    {result.type === 'traffic' && (
                                                        <button
                                                            onClick={() => { clear(); onSwitchToScan(); }}
                                                            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-full font-bold text-sm cursor-pointer shadow-lg shadow-blue-500/20"
                                                        >
                                                            Go to Scan
                                                        </button>
                                                    )}
                                                </div>
                                            )}

                                            <button
                                                onClick={clear}
                                                className="mt-4 w-full py-4 bg-white border border-red-500 text-red-600 rounded-2xl hover:bg-gray-50 transition-all font-bold shadow-sm active:scale-[0.98] cursor-pointer"
                                            >
                                                Start New Report
                                            </button>
                                        </motion.div>
                                    )}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

// -- Icons --
const AlertIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 15.318c-.77 1.333.192 3 1.732 3z" /></svg>
);
const CloseIcon = ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
);
const CameraIcon = () => (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
);
const GalleryIcon = () => (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
);
const ReportIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
);
const CheckIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
);
const XIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
);
const Spinner = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
);

export default AccidentReporter;
