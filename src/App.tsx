import React from 'react';

const App: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-slate-900 mb-4">
                    Financial Advisor App
                </h1>
                <p className="text-slate-600 text-lg">
                    AI-Powered Investment Strategy & Forecasting
                </p>
                <div className="mt-8 p-4 bg-blue-100 rounded-lg text-blue-800">
                    <p>✅ Phase 2: React + TypeScript Setup Complete!</p>
                    <p className="text-sm mt-2">Next: TypeScript Types & Data Models</p>
                </div>
            </div>

            <footer className="mt-12 text-sm text-slate-500">
                <p>Copyright © Ahmed Mohamed Khairy. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default App;