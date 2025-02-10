import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CopyrightHeader } from './components/CopyrightHeader';
import { FooterDisclaimer } from './components/FooterDisclaimer';
import { AnalysisReport } from './components/AnalysisReport';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import FinancialForm from './components/FinancialForm';

// Protected Route wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    return <>{children}</>;
};

// Main App component
const AppContent: React.FC = () => {
    const { user } = useAuth();
    const [result, setResult] = React.useState<any>(null);

    // If there's a result, show it on the home page
    if (result) {
        return (
            <div className="min-h-screen flex flex-col">
                <CopyrightHeader />
                <main className="flex-grow bg-slate-50 py-12 px-4 sm:px-6">
                    <AnalysisReport data={result} onReset={() => setResult(null)} />
                </main>
                <FooterDisclaimer />
            </div>
        );
    }

    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected Routes */}
                <Route path="/dashboard" element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                } />

                {/* Home page - shows form by default */}
                <Route path="/" element={
                    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800">
                        <CopyrightHeader />
                        <main className="flex-grow container mx-auto px-4 py-8 max-w-3xl">
                            <div className="text-center mb-10">
                                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-2">Financial Advisor</h1>
                                <p className="text-slate-600">Advanced AI-Powered Investment Strategy & Forecasting</p>
                            </div>
                            <FinancialForm onAnalysisComplete={setResult} />
                        </main>
                        <FooterDisclaimer />
                    </div>
                } />

                {/* 404 */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
};

// Main App wrapper
const App: React.FC = () => {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
};

export default App;