import React from 'react';
import SigSenseBot from './components/SigSenseBot';

const App = () => {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 md:p-6">
      {/* Main Chatbot Container */}
      <SigSenseBot />
    </div>
  );
};

export default App;