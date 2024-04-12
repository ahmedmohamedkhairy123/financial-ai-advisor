import React, { useState } from 'react';
import { FinancialFormData, LossReaction } from './types';

// Initial state for the form
const initialFormData: FinancialFormData = {
    age: 30,
    country: '',
    currency: 'USD',
    investmentKnowledge: 5,
    housingStatus: 'Renting',
    annualIncome: 0,
    monthlyInvestmentCapacity: 0,
    passiveIncomeDetails: '',
    existingSavings: 0,
    emergencyFundAmount: 0,
    hasEmergencyFund: 'No',
    currentDebtSituation: 'Debt-free',
    outstandingLoansDetails: '',
    primaryGoal: 'Retirement',
    targetInvestmentAmount: 0,
    targetYears: 10,
    initialAmount: 0,
    retirementAge: 65,
    retirementLifestyle: '',
    majorPlannedExpenses: '',
    targetAnnualReturn: 8,
    maxTolerableLoss: 10,
    reactionToLoss: LossReaction.HOLD,
    additionalContext: '',
};

const App: React.FC = () => {
    const [formData, setFormData] = useState<FinancialFormData>(initialFormData);

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
            <div className="text-center max-w-2xl">
                <h1 className="text-4xl font-bold text-slate-900 mb-4">
                    Financial Advisor App
                </h1>
                <p className="text-slate-600 text-lg mb-8">
                    AI-Powered Investment Strategy & Forecasting
                </p>

                <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200">
                    <h2 className="text-2xl font-bold text-slate-800 mb-6">
                        Phase 3: TypeScript Types Complete! ✅
                    </h2>

                    <div className="space-y-4 text-left">
                        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                            <h3 className="font-semibold text-green-800">✅ TypeScript Types Created:</h3>
                            <ul className="list-disc pl-5 mt-2 text-green-700">
                                <li><code>FinancialFormData</code> - Complete form structure</li>
                                <li><code>AIAnalysisResult</code> - AI response format</li>
                                <li><code>FeasibilityStatus</code> - RED/YELLOW/GREEN enums</li>
                                <li><code>LossReaction</code> - User risk psychology</li>
                                <li><code>DebtOptions</code> - Debt level choices</li>
                            </ul>
                        </div>

                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <h3 className="font-semibold text-blue-800">📊 Form Data Preview:</h3>
                            <div className="mt-2 space-y-2 text-blue-700">
                                <div className="flex justify-between">
                                    <span>Age:</span>
                                    <span className="font-semibold">{formData.age}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Currency:</span>
                                    <span className="font-semibold">{formData.currency}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Risk Reaction:</span>
                                    <span className="font-semibold">{formData.reactionToLoss}</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                            <h3 className="font-semibold text-purple-800">🚀 Next Phase:</h3>
                            <p className="text-purple-700 mt-2">
                                Phase 4: Core Layout Components (CopyrightHeader, FooterDisclaimer, TrafficLight)
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <footer className="mt-12 text-sm text-slate-500">
                <p>Copyright © Ahmed Mohamed Khairy. All rights reserved.</p>
                <p className="text-xs mt-1">Phase 3: TypeScript Types & Data Models</p>
            </footer>
        </div>
    );
};

export default App;