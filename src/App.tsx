import React, { useState } from 'react';
import { CopyrightHeader } from './components/CopyrightHeader';
import { FooterDisclaimer } from './components/FooterDisclaimer';
import { AnalysisReport } from './components/AnalysisReport';
import { processFinancialData } from './services/geminiService';
import { DebtOptions, LossReaction, FinancialFormData, AIAnalysisResult } from './types';

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

const housingOptions = ["Homeowner", "Renting", "Living with family"];
const goalOptions = ["Retirement", "Buying a Home", "Wealth Accumulation", "Education Fund", "Starting a Business"];

const App: React.FC = () => {
    const [formData, setFormData] = useState<FinancialFormData>(initialFormData);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [result, setResult] = useState<AIAnalysisResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
    const [currentStep, setCurrentStep] = useState(1);

    // Helper to handle number inputs without leading zeros
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? (value === '' ? 0 : Number(value)) : value,
        }));
        // Clear validation error for this field when user types
        if (validationErrors[name]) {
            setValidationErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleCustomSelectChange = (field: keyof FinancialFormData, value: string, standardOptions: readonly string[]) => {
        if (value === 'Other_Input') {
            if (standardOptions.includes(formData[field] as string)) {
                setFormData(prev => ({ ...prev, [field]: '' }));
            }
        } else {
            setFormData(prev => ({ ...prev, [field]: value }));
        }
        // Clear validation error
        if (validationErrors[field]) {
            setValidationErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    // Validate mandatory fields
    const validateCurrentStep = (): boolean => {
        const errors: Record<string, string> = {};

        if (currentStep === 1) {
            if (formData.age <= 0 || formData.age > 120) errors.age = "Age must be between 1 and 120";
            if (!formData.country.trim()) errors.country = "Country is required";
            if (!formData.currency.trim()) errors.currency = "Currency is required";
            if (!formData.housingStatus.trim()) errors.housingStatus = "Housing status is required";
            if (formData.investmentKnowledge < 1 || formData.investmentKnowledge > 10) {
                errors.investmentKnowledge = "Investment knowledge must be between 1 and 10";
            }
        }

        if (currentStep === 2) {
            if (formData.annualIncome <= 0) errors.annualIncome = "Annual income must be greater than 0";
            if (formData.monthlyInvestmentCapacity < 0) errors.monthlyInvestmentCapacity = "Monthly investment capacity is required";
            if (formData.existingSavings < 0) errors.existingSavings = "Existing savings is required";
            if (!formData.currentDebtSituation.trim()) errors.currentDebtSituation = "Current debt situation is required";

            // Emergency fund amount required if they have emergency fund
            if (formData.hasEmergencyFund !== 'No' && formData.emergencyFundAmount <= 0) {
                errors.emergencyFundAmount = "Emergency fund amount is required";
            }
        }

        if (currentStep === 3) {
            if (!formData.primaryGoal.trim()) errors.primaryGoal = "Primary goal is required";
            if (formData.targetInvestmentAmount <= 0) errors.targetInvestmentAmount = "Target amount must be greater than 0";
            if (formData.targetYears <= 0) errors.targetYears = "Time horizon must be greater than 0";
            if (formData.initialAmount < 0) errors.initialAmount = "Initial amount is required";
            if (formData.retirementAge <= 0) errors.retirementAge = "Retirement age is required";
        }

        if (currentStep === 4) {
            if (formData.targetAnnualReturn <= 0) errors.targetAnnualReturn = "Target annual return is required";
            if (formData.maxTolerableLoss < 0) errors.maxTolerableLoss = "Max tolerable loss is required";
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Validate all steps before submission
    const validateAllSteps = (): boolean => {
        const errors: Record<string, string> = {};

        // Step 1 validations
        if (formData.age <= 0 || formData.age > 120) errors.age = "Age must be between 1 and 120";
        if (!formData.country.trim()) errors.country = "Country is required";
        if (!formData.currency.trim()) errors.currency = "Currency is required";
        if (!formData.housingStatus.trim()) errors.housingStatus = "Housing status is required";
        if (formData.investmentKnowledge < 1 || formData.investmentKnowledge > 10) {
            errors.investmentKnowledge = "Investment knowledge must be between 1 and 10";
        }

        // Step 2 validations
        if (formData.annualIncome <= 0) errors.annualIncome = "Annual income must be greater than 0";
        if (formData.monthlyInvestmentCapacity < 0) errors.monthlyInvestmentCapacity = "Monthly investment capacity is required";
        if (formData.existingSavings < 0) errors.existingSavings = "Existing savings is required";
        if (!formData.currentDebtSituation.trim()) errors.currentDebtSituation = "Current debt situation is required";

        if (formData.hasEmergencyFund !== 'No' && formData.emergencyFundAmount <= 0) {
            errors.emergencyFundAmount = "Emergency fund amount is required";
        }

        // Step 3 validations
        if (!formData.primaryGoal.trim()) errors.primaryGoal = "Primary goal is required";
        if (formData.targetInvestmentAmount <= 0) errors.targetInvestmentAmount = "Target amount must be greater than 0";
        if (formData.targetYears <= 0) errors.targetYears = "Time horizon must be greater than 0";
        if (formData.initialAmount < 0) errors.initialAmount = "Initial amount is required";
        if (formData.retirementAge <= 0) errors.retirementAge = "Retirement age is required";

        // Step 4 validations
        if (formData.targetAnnualReturn <= 0) errors.targetAnnualReturn = "Target annual return is required";
        if (formData.maxTolerableLoss < 0) errors.maxTolerableLoss = "Max tolerable loss is required";

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateAllSteps()) {
            setError("Please fill in all required fields before submitting.");
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        setIsSubmitting(true);
        setError(null);
        try {
            const analysis = await processFinancialData(formData);
            setResult(analysis);
        } catch (err: any) {
            setError(err.message || "An error occurred while analyzing your data. Please check your API key or try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const nextStep = () => {
        if (!validateCurrentStep()) {
            setError("Please correct the errors in the current step before proceeding.");
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }
        setError(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setCurrentStep(prev => prev + 1);
    };

    const prevStep = () => {
        setError(null);
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Age *</label>
                    <input
                        type="number"
                        name="age"
                        value={formData.age || ''}
                        onChange={handleInputChange}
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${validationErrors.age ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {validationErrors.age && <p className="text-red-500 text-xs mt-1">{validationErrors.age}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country of Residence *</label>
                    <input
                        type="text"
                        name="country"
                        placeholder="e.g. USA, Canada, UK"
                        value={formData.country}
                        onChange={handleInputChange}
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${validationErrors.country ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {validationErrors.country && <p className="text-red-500 text-xs mt-1">{validationErrors.country}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Primary Currency *</label>
                    <input
                        type="text"
                        name="currency"
                        value={formData.currency}
                        onChange={handleInputChange}
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${validationErrors.currency ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {validationErrors.currency && <p className="text-red-500 text-xs mt-1">{validationErrors.currency}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Housing Status *</label>
                    <select
                        value={housingOptions.includes(formData.housingStatus) ? formData.housingStatus : 'Other_Input'}
                        onChange={(e) => handleCustomSelectChange('housingStatus', e.target.value, housingOptions)}
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white mb-2 ${validationErrors.housingStatus ? 'border-red-500' : 'border-gray-300'}`}
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
                    {validationErrors.housingStatus && <p className="text-red-500 text-xs mt-1">{validationErrors.housingStatus}</p>}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Investment Knowledge (1-10) *
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
                {validationErrors.investmentKnowledge && <p className="text-red-500 text-xs mt-1 text-center">{validationErrors.investmentKnowledge}</p>}
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Approx. Annual Income *</label>
                    <div className="relative">
                        <span className="absolute left-3 top-3 text-gray-400">$</span>
                        <input
                            type="number"
                            name="annualIncome"
                            value={formData.annualIncome || ''}
                            onChange={handleInputChange}
                            className={`w-full p-3 pl-7 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${validationErrors.annualIncome ? 'border-red-500' : 'border-gray-300'}`}
                        />
                    </div>
                    {validationErrors.annualIncome && <p className="text-red-500 text-xs mt-1">{validationErrors.annualIncome}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Investable Amount *</label>
                    <div className="relative">
                        <span className="absolute left-3 top-3 text-gray-400">$</span>
                        <input
                            type="number"
                            name="monthlyInvestmentCapacity"
                            value={formData.monthlyInvestmentCapacity || ''}
                            onChange={handleInputChange}
                            className={`w-full p-3 pl-7 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${validationErrors.monthlyInvestmentCapacity ? 'border-red-500' : 'border-gray-300'}`}
                        />
                    </div>
                    {validationErrors.monthlyInvestmentCapacity && <p className="text-red-500 text-xs mt-1">{validationErrors.monthlyInvestmentCapacity}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Current Savings/Investments *</label>
                    <div className="relative">
                        <span className="absolute left-3 top-3 text-gray-400">$</span>
                        <input
                            type="number"
                            name="existingSavings"
                            value={formData.existingSavings || ''}
                            onChange={handleInputChange}
                            className={`w-full p-3 pl-7 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${validationErrors.existingSavings ? 'border-red-500' : 'border-gray-300'}`}
                        />
                    </div>
                    {validationErrors.existingSavings && <p className="text-red-500 text-xs mt-1">{validationErrors.existingSavings}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Debt Situation *</label>
                    <select
                        value={DebtOptions.includes(formData.currentDebtSituation as any) ? formData.currentDebtSituation : 'Other_Input'}
                        onChange={(e) => handleCustomSelectChange('currentDebtSituation', e.target.value, DebtOptions)}
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white mb-2 ${validationErrors.currentDebtSituation ? 'border-red-500' : 'border-gray-300'}`}
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
                    {validationErrors.currentDebtSituation && <p className="text-red-500 text-xs mt-1">{validationErrors.currentDebtSituation}</p>}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Outstanding Loans/Debts Details</label>
                <textarea name="outstandingLoansDetails" rows={2} placeholder="e.g. $20k Student loan @ 5%, Car loan $10k..." value={formData.outstandingLoansDetails} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Do you have an emergency fund? *</label>
                    <select name="hasEmergencyFund" value={formData.hasEmergencyFund} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                        <option value="Yes">Yes, fully funded</option>
                        <option value="Partial">Partially funded</option>
                        <option value="No">No</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Required Emergency Fund (Estimate) {formData.hasEmergencyFund !== 'No' && '*'}</label>
                    <div className="relative">
                        <span className="absolute left-3 top-3 text-gray-400">$</span>
                        <input
                            type="number"
                            name="emergencyFundAmount"
                            value={formData.emergencyFundAmount || ''}
                            onChange={handleInputChange}
                            className={`w-full p-3 pl-7 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${validationErrors.emergencyFundAmount ? 'border-red-500' : 'border-gray-300'}`}
                        />
                    </div>
                    {validationErrors.emergencyFundAmount && <p className="text-red-500 text-xs mt-1">{validationErrors.emergencyFundAmount}</p>}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Primary Financial Goal *</label>
                <select
                    value={goalOptions.includes(formData.primaryGoal) ? formData.primaryGoal : 'Other_Input'}
                    onChange={(e) => handleCustomSelectChange('primaryGoal', e.target.value, goalOptions)}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white mb-2 ${validationErrors.primaryGoal ? 'border-red-500' : 'border-gray-300'}`}
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
                {validationErrors.primaryGoal && <p className="text-red-500 text-xs mt-1">{validationErrors.primaryGoal}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Target Amount needed *</label>
                    <div className="relative">
                        <span className="absolute left-3 top-3 text-gray-400">$</span>
                        <input
                            type="number"
                            name="targetInvestmentAmount"
                            value={formData.targetInvestmentAmount || ''}
                            onChange={handleInputChange}
                            className={`w-full p-3 pl-7 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${validationErrors.targetInvestmentAmount ? 'border-red-500' : 'border-gray-300'}`}
                        />
                    </div>
                    {validationErrors.targetInvestmentAmount && <p className="text-red-500 text-xs mt-1">{validationErrors.targetInvestmentAmount}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Initial Starting Amount *</label>
                    <div className="relative">
                        <span className="absolute left-3 top-3 text-gray-400">$</span>
                        <input
                            type="number"
                            name="initialAmount"
                            value={formData.initialAmount || ''}
                            onChange={handleInputChange}
                            className={`w-full p-3 pl-7 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${validationErrors.initialAmount ? 'border-red-500' : 'border-gray-300'}`}
                        />
                    </div>
                    {validationErrors.initialAmount && <p className="text-red-500 text-xs mt-1">{validationErrors.initialAmount}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Time Horizon (Years) *</label>
                    <input
                        type="number"
                        name="targetYears"
                        value={formData.targetYears || ''}
                        onChange={handleInputChange}
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${validationErrors.targetYears ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {validationErrors.targetYears && <p className="text-red-500 text-xs mt-1">{validationErrors.targetYears}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Planned Retirement Age *</label>
                    <input
                        type="number"
                        name="retirementAge"
                        value={formData.retirementAge || ''}
                        onChange={handleInputChange}
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${validationErrors.retirementAge ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {validationErrors.retirementAge && <p className="text-red-500 text-xs mt-1">{validationErrors.retirementAge}</p>}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Planned Major Expenses (Next 24 Months)</label>
                <textarea name="majorPlannedExpenses" placeholder="e.g. Wedding ($20k), New Car ($30k)..." value={formData.majorPlannedExpenses} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Desired Retirement Lifestyle</label>
                <input type="text" name="retirementLifestyle" placeholder="e.g. Travel often, simple life..." value={formData.retirementLifestyle} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
        </div>
    );

    const renderStep4 = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center border-b pb-2">
                <h3 className="text-xl font-semibold text-gray-800">Risk Profile & Context</h3>
                <span className="text-sm text-gray-400 font-medium">4/{totalSteps}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Target Annual Return (%) *</label>
                    <input
                        type="number"
                        name="targetAnnualReturn"
                        value={formData.targetAnnualReturn || ''}
                        onChange={handleInputChange}
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${validationErrors.targetAnnualReturn ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {validationErrors.targetAnnualReturn && <p className="text-red-500 text-xs mt-1">{validationErrors.targetAnnualReturn}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Tolerable Loss in 1 Year (%) *</label>
                    <input
                        type="number"
                        name="maxTolerableLoss"
                        value={formData.maxTolerableLoss || ''}
                        onChange={handleInputChange}
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${validationErrors.maxTolerableLoss ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {validationErrors.maxTolerableLoss && <p className="text-red-500 text-xs mt-1">{validationErrors.maxTolerableLoss}</p>}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">If your portfolio lost 20% in a month, how would you react? *</label>
                <select name="reactionToLoss" value={formData.reactionToLoss} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                    {Object.values(LossReaction).map(r => <option key={r} value={r}>{r}</option>)}
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Any other financial context? (Optional)</label>
                <textarea
                    name="additionalContext"
                    rows={4}
                    placeholder="e.g. Expecting an inheritance, planning to move abroad, specific ethical investment requirements..."
                    value={formData.additionalContext}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
            </div>
        </div>
    );

    // Show result if available
    // Show result if available
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
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        <div className="mb-8">
                            {currentStep === 1 && renderStep1()}
                            {currentStep === 2 && renderStep2()}
                            {currentStep === 3 && renderStep3()}
                            {currentStep === 4 && renderStep4()}
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
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg shadow-green-200 transition-all hover:translate-y-px flex items-center"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Analyzing...
                                        </>
                                    ) : 'Generate Analysis'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-6 text-sm text-gray-500 text-center">
                    <p>* indicates required field</p>
                </div>
            </main>

            <FooterDisclaimer />
        </div>
    );
};

export default App;