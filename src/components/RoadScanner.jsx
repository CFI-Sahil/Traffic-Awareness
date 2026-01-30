import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// 1. Change the import path and class name
import { GoogleGenerativeAI } from "@google/generative-ai";

// -- Configuration & API Keys --
const API_KEYS = [
    import.meta.env.VITE_GEMINI_KEY_1,
    import.meta.env.VITE_GEMINI_KEY_2
];

const SCAN_PROMPT = `Role: You are the Real-Time Computer Vision Engine for "SigSense" (Road Safety App).
Context: You receive images from a user's mobile camera via a "Scan" button. Your goal is to process the visual input and return a data object that populates the UI.

Constraints:
1. Schema Consistency: Always return a valid JSON object. No markdown, no "Here is your result" text.
2. Confidence Threshold: If image confidence is below 70%, set detection_status to "low_confidence" and provide a helpful tip for a better photo.
3. Localization: Interpret signs based on the Indian Road Congress (IRC) standards.
4. Performance: Keep descriptions concise (under 20 words) to ensure the UI remains scannable on mobile.

Output Schema:
{
  "detection_status": "success" | "low_confidence",
  "name": "Sign/Marking Name",
  "explanation": "Concise rule description (< 20 words)",
  "safety_tip": "Localized tip for Indian drivers",
  "better_photo_tip": "Optional: tip for better photo if status is low_confidence"
}`;

const RoadScanner = ({ isOpen, onClose }) => {
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [result, setResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showCameraConfirm, setShowCameraConfirm] = useState(false);
    const keyIndexRef = useRef(0);
    const fileInputRef = useRef(null);
    const cameraInputRef = useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
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
        if (cameraInputRef.current) {
            cameraInputRef.current.click();
        }
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

                const result = await model.generateContent([
                    SCAN_PROMPT,
                    {
                        inlineData: {
                            data: base64Data,
                            mimeType: image.type,
                        },
                    },
                ]);

                const response = await result.response;
                const text = response.text();

                try {
                    // Clean markdown JSON formatting if present
                    const cleanJson = text.replace(/```json/g, "").replace(/```/g, "").trim();
                    const jsonResult = JSON.parse(cleanJson);
                    setResult(jsonResult);
                } catch (jsonErr) {
                    console.warn("JSON Parse Error, falling back to raw text", jsonErr);
                    setResult({
                        detection_status: "success",
                        name: "Sign Detected",
                        explanation: text.length > 100 ? text.substring(0, 100) + "..." : text,
                        safety_tip: "Observe standard precautions."
                    });
                }
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
                    console.warn(`RoadScanner: Key ${keyIndexRef.current} exhausted. Rotating...`);
                    keyIndexRef.current = (keyIndexRef.current + 1) % API_KEYS.length;
                    return attemptAnalysis(retryCount + 1);
                } else {
                    console.error("Analysis Error:", err);
                    setError("Failed to analyze image. Please try again.");
                }
            }
        };

        await attemptAnalysis();
        setIsLoading(false);
    };

    const clearScanner = () => {
        setImage(null);
        setPreview(null);
        setResult(null);
        setError(null);
        setShowCameraConfirm(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
        if (cameraInputRef.current) cameraInputRef.current.value = "";
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[60] flex items-start sm:items-center justify-center p-4 overflow-y-auto">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/70 backdrop-blur-md"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -50 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -50 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="relative w-[95%] max-w-sm sm:max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto sm:my-0"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-[#0d181c] via-[#1f353d] to-[#0d181c] p-6 text-white flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center border border-blue-500/30">
                                    <ScanIcon />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold">Road Sign Scanner</h2>
                                    <p className="text-xs text-blue-300 font-medium uppercase tracking-wider">AI Powered Analysis</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/10 rounded-xl transition-all cursor-pointer"
                            >
                                <CloseIcon />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
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
                                                    className="border-2 border-dashed border-blue-200 rounded-2xl flex flex-col items-center justify-center gap-3 hover:bg-blue-50 transition-all cursor-pointer group"
                                                >
                                                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                                                        <CameraIcon />
                                                    </div>
                                                    <p className="font-bold text-blue-800">Direct Capture</p>
                                                    <input
                                                        ref={cameraInputRef}
                                                        type="file"
                                                        accept="image/*"
                                                        capture="environment"
                                                        onChange={handleFileChange}
                                                        className="hidden"
                                                    />
                                                </button>
                                                <button
                                                    onClick={() => fileInputRef.current?.click()}
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
                                                        onChange={handleFileChange}
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
                                                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 mb-4 animate-bounce">
                                                    <CameraIcon />
                                                </div>
                                                <h3 className="text-lg font-bold text-gray-800 mb-2">Camera Access Required</h3>
                                                <p className="text-sm text-gray-500 mb-6 font-medium">SigSense needs your permission to open the camera and analyze road signs in real-time.</p>
                                                <div className="flex gap-3 w-full max-w-xs">
                                                    <button
                                                        onClick={() => setShowCameraConfirm(false)}
                                                        className="flex-1 py-3 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-100 cursor-pointer"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        onClick={confirmCamera}
                                                        className="flex-1 py-3 bg-blue-600 rounded-xl font-bold text-white hover:bg-blue-700 shadow-lg shadow-blue-200 cursor-pointer"
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
                                    {/* Image Preview */}
                                    <div className="relative rounded-2xl overflow-hidden border border-gray-100 shadow-lg h-48 mx-auto bg-gray-50">
                                        <img src={preview} alt="Upload Preview" className="w-full h-full object-cover" />
                                        <button
                                            onClick={clearScanner}
                                            className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600 transition-colors cursor-pointer"
                                        >
                                            <CloseIcon />
                                        </button>
                                    </div>

                                    {/* Action Button */}
                                    {!result && (
                                        <div className="flex justify-center">
                                            <button
                                                onClick={handleAnalyze}
                                                disabled={isLoading}
                                                className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-bold transition-all shadow-xl ${isLoading
                                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                                    : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95 shadow-blue-200'
                                                    }`}
                                            >
                                                {isLoading ? (
                                                    <>
                                                        <LoadingSpinner />
                                                        Analyzing...
                                                    </>
                                                ) : (
                                                    <>
                                                        <ScanIcon className="w-5 h-5" />
                                                        <p className='cursor-pointer'>Scan Now</p>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    )}

                                    {/* Error Message */}
                                    {error && (
                                        <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-center font-medium">
                                            {error}
                                        </div>
                                    )}

                                    {/* Result */}
                                    {result && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar"
                                        >
                                            <div className="flex items-center gap-2 mb-4">
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${result.detection_status === 'low_confidence'
                                                    ? 'bg-yellow-500/10 text-yellow-600'
                                                    : 'bg-green-500/10 text-green-600'
                                                    }`}>
                                                    {result.detection_status === 'low_confidence' ? <ScanIcon /> : <InfoIcon />}
                                                </div>
                                                <h3 className="font-bold text-gray-800">
                                                    {result.detection_status === 'low_confidence' ? 'Attention Needed' : 'Analysis Complete'}
                                                </h3>
                                            </div>

                                            <div className="space-y-4">
                                                <div>
                                                    <h4 className="text-lg md:text-xl font-bold text-gray-900">{result.name}</h4>
                                                    <p className="mt-1 text-sm md:text-base text-gray-600">
                                                        {result.explanation}
                                                    </p>
                                                </div>

                                                <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl">
                                                    <strong className="text-red-900 text-xs md:text-sm uppercase tracking-wider">Safety Protocol</strong>
                                                    <p className="text-red-700 font-medium text-sm md:text-base mt-1">
                                                        {result.safety_tip}
                                                    </p>
                                                </div>

                                                {result.detection_status === 'low_confidence' && result.better_photo_tip && (
                                                    <div className="p-4 bg-blue-50 border-l-4 border-blue-400 rounded-r-xl border-dashed">
                                                        <strong className="text-blue-900 text-sm uppercase tracking-wider">Improve Accuracy</strong>
                                                        <p className="text-blue-700 font-medium text-sm md:text-base mt-1 italic">
                                                            {result.better_photo_tip}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>

                                            <button
                                                onClick={clearScanner}
                                                className="mt-6 w-full py-4 bg-white border border-gray-200 text-gray-600 rounded-2xl hover:bg-gray-50 transition-all font-bold shadow-sm active:scale-[0.98] cursor-pointer"
                                            >
                                                Scan New Sign
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

const ScanIcon = ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

const CloseIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const CameraIcon = () => (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const GalleryIcon = () => (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

const InfoIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const LoadingSpinner = () => (
    <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

export default RoadScanner;
