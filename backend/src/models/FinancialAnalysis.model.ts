import mongoose, { Schema, Document } from 'mongoose';

// Interface for TypeScript
export interface IFinancialAnalysis extends Document {
    userId?: string;
    sessionId: string;
    formData: {
        age: number;
        country: string;
        currency: string;
        investmentKnowledge: number;
        housingStatus: string;
        annualIncome: number;
        monthlyInvestmentCapacity: number;
        passiveIncomeDetails?: string;
        existingSavings: number;
        emergencyFundAmount: number;
        hasEmergencyFund: string;
        currentDebtSituation: string;
        outstandingLoansDetails?: string;
        primaryGoal: string;
        targetInvestmentAmount: number;
        targetYears: number;
        initialAmount: number;
        retirementAge: number;
        retirementLifestyle?: string;
        majorPlannedExpenses?: string;
        targetAnnualReturn: number;
        maxTolerableLoss: number;
        reactionToLoss: string;
        additionalContext?: string;
    };
    analysisResult: {
        feasibilityColor: string;
        feasibilityTitle: string;
        feasibilityExplanation: string;
        executiveSummary: string;
        projectedOutcome: string;
        investmentStrategy: Array<{
            title: string;
            allocationPercentage?: number;
            description: string;
            assets: string[];
        }>;
        riskAssessment: string;
        nextSteps: string[];
    };
    metadata: {
        ipAddress?: string;
        userAgent?: string;
        processingTime: number;
    };
    createdAt: Date;
    updatedAt: Date;
}

// MongoDB Schema
const FinancialAnalysisSchema = new Schema<IFinancialAnalysis>(
    {
        userId: {
            type: String,
            required: false,
            index: true,
        },
        sessionId: {
            type: String,
            required: true,
            index: true,
        },
        formData: {
            age: { type: Number, required: true },
            country: { type: String, required: true },
            currency: { type: String, required: true },
            investmentKnowledge: { type: Number, required: true, min: 1, max: 10 },
            housingStatus: { type: String, required: true },
            annualIncome: { type: Number, required: true },
            monthlyInvestmentCapacity: { type: Number, required: true },
            passiveIncomeDetails: { type: String },
            existingSavings: { type: Number, required: true },
            emergencyFundAmount: { type: Number, required: true },
            hasEmergencyFund: { type: String, required: true },
            currentDebtSituation: { type: String, required: true },
            outstandingLoansDetails: { type: String },
            primaryGoal: { type: String, required: true },
            targetInvestmentAmount: { type: Number, required: true },
            targetYears: { type: Number, required: true },
            initialAmount: { type: Number, required: true },
            retirementAge: { type: Number, required: true },
            retirementLifestyle: { type: String },
            majorPlannedExpenses: { type: String },
            targetAnnualReturn: { type: Number, required: true },
            maxTolerableLoss: { type: Number, required: true },
            reactionToLoss: { type: String, required: true },
            additionalContext: { type: String },
        },
        analysisResult: {
            feasibilityColor: { type: String, required: true },
            feasibilityTitle: { type: String, required: true },
            feasibilityExplanation: { type: String, required: true },
            executiveSummary: { type: String, required: true },
            projectedOutcome: { type: String, required: true },
            investmentStrategy: [
                {
                    title: { type: String, required: true },
                    allocationPercentage: { type: Number, min: 0, max: 100 },
                    description: { type: String, required: true },
                    assets: [{ type: String }],
                },
            ],
            riskAssessment: { type: String, required: true },
            nextSteps: [{ type: String }],
        },
        metadata: {
            ipAddress: { type: String },
            userAgent: { type: String },
            processingTime: { type: Number, required: true, default: 0 },
        },
    },
    {
        timestamps: true, // Adds createdAt and updatedAt automatically
    }
);

// Indexes for faster queries
FinancialAnalysisSchema.index({ createdAt: -1 });
FinancialAnalysisSchema.index({ sessionId: 1, createdAt: -1 });
FinancialAnalysisSchema.index({ userId: 1, createdAt: -1 });

// Create and export the model
export const FinancialAnalysis = mongoose.model<IFinancialAnalysis>(
    'FinancialAnalysis',
    FinancialAnalysisSchema,
    'financial_analyses'
);