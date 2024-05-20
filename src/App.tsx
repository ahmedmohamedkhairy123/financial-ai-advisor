import React, { useState } from 'react';
import { CopyrightHeader } from './components/CopyrightHeader';
import { FooterDisclaimer } from './components/FooterDisclaimer';
import { TrafficLight } from './components/TrafficLight';
import { FinancialFormData, LossReaction, FeasibilityStatus } from './types';

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
    const [selectedStatus, setSelectedStatus] = useState<FeasibilityStatus>(FeasibilityStatus.GREEN);

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800">
            <CopyrightHeader />

            <main className="flex-grow container mx-auto px-4 py-8 max-w-3xl">
                <div className="text-center mb-10">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-2">
                        Financial Advisor
                    </h1>
                    <p className="text-slate-600">Advanced AI-Powered Investment Strategy & Forecasting</p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 p-8">
                    <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">
                        Phase 4: Core Components Complete! ✅
                    </h2>

                    {/* Component Demos */}
                    <div className="space-y-8">

                        {/* Traffic Light Demo */}
                        <div className="border border-slate-200 rounded-xl p-6">
                            <h3 className="text-lg font-semibold text-slate-700 mb-4">🚦 Traffic Light Component</h3>
                            <div className="flex flex-wrap items-center justify-center gap-8">
                                <div className="text-center">
                                    <TrafficLight status={FeasibilityStatus.RED} />
                                    <p className="mt-2 text-sm text-red-600 font-medium">RED - Unrealistic</p>
                                </div>
                                <div className="text-center">
                                    <TrafficLight status={FeasibilityStatus.YELLOW} />
                                    <p className="mt-2 text-sm text-yellow-600 font-medium">YELLOW - Challenging</p>
                                </div>
                                <div className="text-center">
                                    <TrafficLight status={FeasibilityStatus.GREEN} />
                                    <p className="mt-2 text-sm text-green-600 font-medium">GREEN - On Track</p>
                                </div>
                            </div>

                            <div className="mt-4 text-center">
                                <p className="text-slate-600 text-sm">Interactive Demo:</p>
                                <div className="flex justify-center gap-4 mt-2">
                                    <button
                                        onClick={() => setSelectedStatus(FeasibilityStatus.RED)}
                                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                    >
                                        Set RED
                                    </button>
                                    <button
                                        onClick={() => setSelectedStatus(FeasibilityStatus.YELLOW)}
                                        className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                                    >
                                        Set YELLOW
                                    </button>
                                    <button
                                        onClick={() => setSelectedStatus(FeasibilityStatus.GREEN)}
                                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                                    >
                                        Set GREEN
                                    </button>
                                </div>
                                <div className="mt-4">
                                    <p className="text-slate-700">Current Status: <span className="font-bold">{selectedStatus}</span></p>
                                    <TrafficLight status={selectedStatus} />
                                </div>
                            </div>
                        </div>

                        {/* Form Data Preview */}
                        <div className="border border-slate-200 rounded-xl p-6">
                            <h3 className="text-lg font-semibold text-slate-700 mb-4">📊 Current Form Data</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <div className="bg-slate-50 p-3 rounded-lg">
                                    <p className="text-sm text-slate-500">Age</p>
                                    <p className="font-semibold">{formData.age}</p>
                                </div>
                                <div className="bg-slate-50 p-3 rounded-lg">
                                    <p className="text-sm text-slate-500">Currency</p>
                                    <p className="font-semibold">{formData.currency}</p>
                                </div>
                                <div className="bg-slate-50 p-3 rounded-lg">
                                    <p className="text-sm text-slate-500">Knowledge Level</p>
                                    <p className="font-semibold">{formData.investmentKnowledge}/10</p>
                                </div>
                                <div className="bg-slate-50 p-3 rounded-lg">
                                    <p className="text-sm text-slate-500">Risk Reaction</p>
                                    <p className="font-semibold text-sm">{formData.reactionToLoss}</p>
                                </div>
                                <div className="bg-slate-50 p-3 rounded-lg">
                                    <p className="text-sm text-slate-500">Target Return</p>
                                    <p className="font-semibold">{formData.targetAnnualReturn}%</p>
                                </div>
                                <div className="bg-slate-50 p-3 rounded-lg">
                                    <p className="text-sm text-slate-500">Max Loss Tolerance</p>
                                    <p className="font-semibold">{formData.maxTolerableLoss}%</p>
                                </div>
                            </div>
                        </div>

                        {/* Next Phase Info */}
                        <div className="border border-blue-200 bg-blue-50 rounded-xl p-6">
                            <h3 className="text-lg font-semibold text-blue-800 mb-2">🚀 Next Phase: Multi-Step Form</h3>
                            <p className="text-blue-700">
                                Phase 5: We'll build the multi-step financial form with 4 steps:
                            </p>
                            <ul className="list-disc pl-5 mt-2 text-blue-700">
                                <li>Step 1: Basic Profile & Demographics</li>
                                <li>Step 2: Financial Health Check</li>
                                <li>Step 3: Goals & Aspirations</li>
                                <li>Step 4: Risk Profile & Context</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </main>

            <FooterDisclaimer />
        </div>
    );
};

export default App;