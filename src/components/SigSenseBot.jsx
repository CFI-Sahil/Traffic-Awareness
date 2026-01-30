import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenerativeAI } from "@google/generative-ai";
import sigSenseLogo from '../assets/sigsense_logo_cutout.png';

// -- Configuration & API Keys --
const API_KEYS = [
    import.meta.env.VITE_GEMINI_KEY_1,
    import.meta.env.VITE_GEMINI_KEY_2,
    import.meta.env.VITE_GEMINI_KEY_3,
    import.meta.env.VITE_GEMINI_KEY_4
];

const SYSTEM_PROMPT = `You are the "SigSense Traffic Safety Assistant."

CORE DIRECTIVE: Provide the answer EXACTLY as asked.
- NO greetings (e.g., "Hello", "Sure").
- NO filler phrases (e.g., "Here is the information", "I can help with that").
- NO elaboration unless explicitly asked.
- JUST THE FACTS.

SCOPE: Only Indian traffic laws, road safety, and driving rules.
If out of scope: "I only answer traffic rules and road safety questions."`;

const SigSenseBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([
        { role: 'bot', text: "I am SigSense AI. How may I help you with Indian traffic rules and road safety today?" }
    ]);
    const [isTyping, setIsTyping] = useState(false);

    // Rotation Management
    const keyIndexRef = useRef(0);
    const chatSessionRef = useRef(null);

    const inputRef = useRef(null);
    const scrollRef = useRef(null);

    // Initialize Chat Session with Current Key
    const initChat = useCallback(() => {
        try {
            const currentKey = API_KEYS[keyIndexRef.current];
            const genAI = new GoogleGenerativeAI(currentKey);
            const model = genAI.getGenerativeModel({
                model: "gemini-2.5-flash",
                systemInstruction: SYSTEM_PROMPT
            });

            chatSessionRef.current = model.startChat({
                history: [],
                generationConfig: {
                    temperature: 1.0,
                },
            });
            console.log(`SigSense: Initialized with Key Index ${keyIndexRef.current}`);
        } catch (error) {
            console.error("Failed to initialize chat session", error);
        }
    }, []);

    useEffect(() => {
        initChat();
    }, [initChat]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
        if (!isTyping && isOpen) {
            inputRef.current?.focus();
        }
    }, [messages, isTyping, isOpen]);

    const handleSend = async () => {
        if (!input.trim() || isTyping) return;

        const currentInput = input;
        setInput("");
        setMessages(prev => [...prev, { role: 'user', text: currentInput }]);
        setIsTyping(true);

        // Recursive function to handle API rotation on failure
        const attemptSendMessage = async (retryCount = 0) => {
            try {
                if (!chatSessionRef.current) initChat();

                const result = await chatSessionRef.current.sendMessageStream(currentInput);

                let fullText = "";
                setMessages(prev => [...prev, { role: 'bot', text: "" }]);

                for await (const chunk of result.stream) {
                    const chunkText = chunk.text();
                    if (chunkText) {
                        fullText += chunkText;
                        setMessages(prev => {
                            const newMessages = [...prev];
                            newMessages[newMessages.length - 1].text = fullText;
                            return newMessages;
                        });
                    }
                }
                setIsTyping(false);
            } catch (error) {
                // Check if error is Rate Limit (429), Quota, or Leaked (403)
                const isRetryable = error.message?.includes("429") ||
                    error.message?.includes("quota") ||
                    error.message?.includes("403") ||
                    error.message?.includes("forbidden") ||
                    error.message?.includes("leaked");

                if (isRetryable && retryCount < API_KEYS.length - 1) {
                    console.warn(`Key ${keyIndexRef.current} exhausted. Rotating...`);

                    // Move to next key
                    keyIndexRef.current = (keyIndexRef.current + 1) % API_KEYS.length;

                    // Re-init with new key and try again
                    initChat();
                    return attemptSendMessage(retryCount + 1);
                } else {
                    // Final error after all keys tried or non-quota error
                    const errorMessage = error.message || "Connection failed";
                    setMessages(prev => {
                        const filtered = prev.filter(m => m.text !== ""); // Remove empty streaming bubble
                        return [...filtered, {
                            role: 'bot',
                            text: `Error: ${errorMessage}. Please try again later.`
                        }];
                    });
                    setIsTyping(false);
                    initChat();
                }
            }
        };

        await attemptSendMessage();
        setTimeout(() => inputRef.current?.focus(), 100);
    };

    const clearChat = () => {
        setMessages([{ role: 'bot', text: "Chat history cleared." }]);
        initChat();
        inputRef.current?.focus();
    };

    return (
        <div className="fixed right-6 chatbot-toggle z-[1000]">
            {/* Toggle Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="bg-gradient-to-r from-[#0d181c] via-[#1f353d] to-[#0d181c] text-white p-2 rounded-2xl shadow-2xl flex cursor-pointer items-center justify-center transition-all border border-white/20 select-none overflow-hidden"
            >
                <img src={sigSenseLogo} alt="SigSense AI" className="w-10 h-10 md:w-14 md:h-14 object-cover mix-blend-screen scale-125" />
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="absolute bottom-20 right-0 w-[85vw] sm:w-[400px] bg-white rounded-3xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden"
                        style={{ height: '70vh', maxHeight: 'min(600px, 80vh)' }}
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-[#0d181c] via-[#233842] to-[#0d181c] p-4 px-6 text-white flex justify-between items-center shadow-md shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-inner border border-white/10 overflow-hidden bg-black/20">
                                    <img src={sigSenseLogo} alt="SigSense AI" className="w-full h-full object-cover mix-blend-screen scale-110" />
                                </div>
                                <div className="cursor-default">
                                    <h3 className="font-bold text-base tracking-tight leading-tight">SigSense AI</h3>
                                    <p className="text-[10px] text-blue-200 font-bold uppercase tracking-widest opacity-90">Traffic Assistant</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={clearChat}
                                    title="Clear Chat"
                                    className="hover:bg-white/10 p-2 rounded-xl transition-all active:scale-90 text-blue-200 hover:text-white cursor-pointer"
                                >
                                    <TrashIcon />
                                </button>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 hover:bg-white/10 rounded-xl transition-all cursor-pointer"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div ref={scrollRef} className="flex-1 p-5 overflow-y-auto bg-slate-50 space-y-4 scroll-smooth">
                            {messages.map((msg, i) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={i}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[85%] p-3.5 px-5 rounded-2xl text-[14px] leading-snug shadow-sm whitespace-pre-wrap ${msg.role === 'user'
                                        ? 'bg-gradient-to-r from-[#0d181c] via-[#1f353d] to-[#0d181c] text-white rounded-br-none shadow-gray-400'
                                        : 'bg-white text-slate-800 rounded-bl-none border border-slate-200'
                                        }`}>
                                        {msg.role === 'bot' ? (
                                            <div className="markdown-body">
                                                {msg.text.split('**').map((part, index) =>
                                                    index % 2 === 1 ? <strong key={index}>{part}</strong> : part
                                                )}
                                            </div>
                                        ) : msg.text}
                                    </div>
                                </motion.div>
                            ))}

                            {isTyping && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                                    <div className="bg-white border border-slate-200 p-3 px-4 rounded-3xl rounded-bl-none flex gap-1.5 shadow-sm items-center h-10">
                                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></div>
                                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-white border-t border-slate-100 flex gap-2 items-center shrink-0">
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Ask about traffic safety..."
                                className="flex-1 bg-slate-100 border-transparent border focus:border-blue-500/30 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-slate-400 text-slate-800"
                                disabled={isTyping}
                            />
                            <button
                                onClick={handleSend}
                                disabled={isTyping || !input.trim()}
                                className={`p-3 rounded-xl transition-all shadow-md flex items-center justify-center cursor-pointer ${isTyping || !input.trim()
                                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                                    : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95 shadow-blue-200'
                                    }`}
                            >
                                <SendIcon />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// -- Icons --
const TrashIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
    </svg>
);

const SendIcon = () => (
    <svg className="w-5 h-5 translate-x-0.5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z" />
    </svg>
);

export default SigSenseBot;
