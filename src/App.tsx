import React, { useState } from 'react';
import { CopyrightHeader } from './components/CopyrightHeader';
import { FooterDisclaimer } from './components/FooterDisclaimer';
import { FinancialFormData, LossReaction, DebtOptions } from './types';

// Initial state for the form - EXACTLY like your original
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

const housingOptions = ["Homeowner", "Renting", "Living with family"];
const goalOptions = ["Retirement", "Buying a Home", "Wealth Accumulation", "Education Fund", "Starting a Business"];

const App: React.FC = () => {
    const [formData, setFormData] = useState<FinancialFormData>(initialFormData);
    const [currentStep, setCurrentStep] = useState(1);

    // Helper to handle number inputs without leading zeros
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? (value === '' ? 0 : Number(value)) : value,
        }));
    };

    // Custom select change handler for "Other" option
    const handleCustomSelectChange = (field: keyof FinancialFormData, value: string, standardOptions: readonly string[]) => {
        if (value === 'Other_Input') {
            // Set to empty string if it was previously a standard option
            if (standardOptions.includes(formData[field] as string)) {
                setFormData(prev => ({ ...prev, [field]: '' }));
            }
        } else {
            setFormData(prev => ({ ...prev, [field]: value }));
        }
    };

    const isCustomValue = (value: string, standardOptions: readonly string[]) => {
        return !standardOptions.includes(value) && value !== '';
    };

    const nextStep = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setCurrentStep(prev => prev + 1);
    };

    const prevStep = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setCurrentStep(prev => prev - 1);
    };

    const totalSteps = 4;

    const renderStep1 = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center border-b pb-2">
                <h3 className="text-xl font-semibold text-gray-800">Basic Profile & Demographics</h3>
                <span className="text-sm text-gray-400 font-medium">1/{totalSteps}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                    <input
                        type="number"
                        name="age"
                        value={formData.age || ''}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country of Residence</label>
                    <input type="text" name="country" placeholder="e.g. USA, Canada, UK" value={formData.country} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Primary Currency</label>
                    <input type="text" name="currency" value={formData.currency} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Housing Status</label>
                    <select
                        value={housingOptions.includes(formData.housingStatus) ? formData.housingStatus : 'Other_Input'}
                        onChange={(e) => handleCustomSelectChange('housingStatus', e.target.value, housingOptions)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white mb-2"
                    >
                        {housingOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        <option value="Other_Input">Other...</option>
                    </select>
                    {(!housingOptions.includes(formData.housingStatus)) && (
                        <input
                            type="text"
                            placeholder="Please specify housing status..."
                            value={formData.housingStatus}
                            onChange={(e) => setFormData(prev => ({ ...prev, housingStatus: e.target.value }))}
                            className="w-full p-3 border border-blue-300 bg-blue-50 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    )}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Investment Knowledge (1-10)
                    <span className="text-xs text-gray-500 ml-2">(1 = Novice, 10 = Expert)</span>
                </label>
                <input
                    type="range"
                    min="1"
                    max="10"
                    name="investmentKnowledge"
                    value={formData.investmentKnowledge}
                    onChange={handleInputChange}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="text-center font-bold text-blue-600 mt-2">{formData.investmentKnowledge}</div>
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center border-b pb-2">
                <h3 className="text-xl font-semibold text-gray-800">Financial Health Check</h3>
                <span className="text-sm text-gray-400 font-medium">2/{totalSteps}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Approx. Annual Income</label>
                    <div className="relative">
                        <span className="absolute left-3 top-3 text-gray-400">$</span>
                        <input
                            type="number"
                            name="annualIncome"
                            value={formData.annualIncome || ''}
                            onChange={handleInputChange}
                            className="w-full p-3 pl-7 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Investable Amount</label>
                    <div className="relative">
                        <span className="absolute left-3 top-3 text-gray-400">$</span>
                        <input
                            type="number"
                            name="monthlyInvestmentCapacity"
                            value={formData.monthlyInvestmentCapacity || ''}
                            onChange={handleInputChange}
                            className="w-full p-3 pl-7 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Current Savings/Investments</label>
                    <div className="relative">
                        <span className="absolute left-3 top-3 text-gray-400">$</span>
                        <input
                            type="number"
                            name="existingSavings"
                            value={formData.existingSavings || ''}
                            onChange={handleInputChange}
                            className="w-full p-3 pl-7 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Debt Situation</label>
                    <select
                        value={DebtOptions.includes(formData.currentDebtSituation as any) ? formData.currentDebtSituation : 'Other_Input'}
                        onChange={(e) => handleCustomSelectChange('currentDebtSituation', e.target.value, DebtOptions)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white mb-2"
                    >
                        {DebtOptions.map(s => <option key={s} value={s}>{s}</option>)}
                        <option value="Other_Input">Other...</option>
                    </select>
                    {(!DebtOptions.includes(formData.currentDebtSituation as any)) && (
                        <input
                            type="text"
                            placeholder="Please specify debt situation..."
                            value={formData.currentDebtSituation}
                            onChange={(e) => setFormData(prev => ({ ...prev, currentDebtSituation: e.target.value }))}
                            className="w-full p-3 border border-blue-300 bg-blue-50 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    )}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Outstanding Loans/Debts Details</label>
                <textarea name="outstandingLoansDetails" rows={2} placeholder="e.g. $20k Student loan @ 5%, Car loan $10k..." value={formData.outstandingLoansDetails} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Do you have an emergency fund?</label>
                    <select name="hasEmergencyFund" value={formData.hasEmergencyFund} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                        <option value="Yes">Yes, fully funded</option>
                        <option value="Partial">Partially funded</option>
                        <option value="No">No</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Required Emergency Fund (Estimate)</label>
                    <div className="relative">
                        <span className="absolute left-3 top-3 text-gray-400">$</span>
                        <input
                            type="number"
                            name="emergencyFundAmount"
                            value={formData.emergencyFundAmount || ''}
                            onChange={handleInputChange}
                            className="w-full p-3 pl-7 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sources of Passive Income</label>
                <input type="text" name="passiveIncomeDetails" placeholder="e.g. Rental property ($1k/mo), Dividends..." value={formData.passiveIncomeDetails} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
        </div>
    );

    const renderStep3 = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center border-b pb-2">
                <h3 className="text-xl font-semibold text-gray-800">Goals & Aspirations</h3>
                <span className="text-sm text-gray-400 font-medium">3/{totalSteps}</span>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Primary Financial Goal</label>
                <select
                    value={goalOptions.includes(formData.primaryGoal) ? formData.primaryGoal : 'Other_Input'}
                    onChange={(e) => handleCustomSelectChange('primaryGoal', e.target.value, goalOptions)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white mb-2"
                >
                    {goalOptions.map(g => <option key={g} value={g}>{g}</option>)}
                    <option value="Other_Input">Other...</option>
                </select>
                {(!goalOptions.includes(formData.primaryGoal)) && (
                    <input
                        type="text"
                        placeholder="Please specify your goal..."
                        value={formData.primaryGoal}
                        onChange={(e) => setFormData(prev => ({ ...prev, primaryGoal: e.target.value }))}
                        className="w-full p-3 border border-blue-300 bg-blue-50 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Target Amount needed</label>
                    <div className="relative">
                        <span className="absolute left-3 top-3 text-gray-400">$</span>
                        <input
                            type="number"
                            name="targetInvestmentAmount"
                            value={formData.targetInvestmentAmount || ''}
                            onChange={handleInputChange}
                            className="w-full p-3 pl-7 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Initial Starting Amount</label>
                    <div className="relative">
                        <span className="absolute left-3 top-3 text-gray-400">$</span>
                        <input
                            type="number"
                            name="initialAmount"
                            value={formData.initialAmount || ''}
                            onChange={handleInputChange}
                            className="w-full p-3 pl-7 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Time Horizon (Years)</label>
                    <input
                        type="number"
                        name="targetYears"
                        value={formData.targetYears || ''}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Planned Major Expenses (Next 24 Months)</label>
                <textarea name="majorPlannedExpenses" placeholder="e.g. Wedding ($20k), New Car ($30k)..." value={formData.majorPlannedExpenses} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Planned Retirement Age</label>
                    <input
                        type="number"
                        name="retirementAge"
                        value={formData.retirementAge || ''}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Desired Retirement Lifestyle</label>
                    <input type="text" name="retirementLifestyle" placeholder="e.g. Travel often, simple life..." value={formData.retirementLifestyle} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800">
            <CopyrightHeader />

            <main className="flex-grow container mx-auto px-4 py-8 max-w-3xl">
                <div className="text-center mb-10">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-2">Financial Advisor</h1>
                    <p className="text-slate-600">Advanced AI-Powered Investment Strategy & Forecasting</p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
                    {/* Progress Bar */}
                    <div className="w-full bg-gray-100 h-2">
                        <div
                            className="bg-blue-600 h-2 transition-all duration-500 ease-out"
                            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                        ></div>
                    </div>

                    <div className="p-6 md:p-8">
                        <div className="mb-8">
                            {currentStep === 1 && renderStep1()}
                            {currentStep === 2 && renderStep2()}
                            {currentStep === 3 && renderStep3()}
                            {currentStep === 4 && <div>Step 4 (Risk Profile) coming in Phase 7...</div>}
                        </div>

                        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                            <button
                                onClick={prevStep}
                                disabled={currentStep === 1}
                                className={`px-6 py-2 rounded-lg font-medium transition-colors ${currentStep === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}
                            >
                                Back
                            </button>

                            {currentStep < totalSteps ? (
                                <button
                                    onClick={nextStep}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-blue-200 transition-all hover:translate-y-px"
                                >
                                    Next Step
                                </button>
                            ) : (
                                <button
                                    onClick={() => alert('Submit and Step 4 coming in Phase 7')}
                                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg shadow-green-200 transition-all hover:translate-y-px"
                                >
                                    Generate Analysis
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <FooterDisclaimer />
        </div>
    );
};

export default App;