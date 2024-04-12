export enum FeasibilityStatus {
    RED = "RED",
    YELLOW = "YELLOW",
    GREEN = "GREEN",
}

export enum LossReaction {
    SELL = "Sell immediately to prevent further losses",
    HOLD = "Do nothing and wait for recovery",
    BUY = "View it as a discount and buy more",
}

// Changed from enum to const array for options, but type is string to allow "Other"
export const DebtOptions = [
    "Debt-free",
    "Manageable (low interest/mortgage)",
    "Moderate (some credit card/student loans)",
    "High interest debt (struggling to pay)",
] as const;

export interface FinancialFormData {
    // Section 1: Demographics & Profile
    age: number;
    country: string;
    currency: string;
    investmentKnowledge: number; // 1-10
    housingStatus: string; // Homeowner, Renting, Family, Custom

    // Section 2: Income & Cash Flow
    annualIncome: number;
    monthlyInvestmentCapacity: number;
    passiveIncomeDetails: string; // "None" or description

    // Section 3: Assets & Liabilities
    existingSavings: number;
    emergencyFundAmount: number; // User perception of need
    hasEmergencyFund: string; // Yes/No/Partial
    currentDebtSituation: string; // Now string to support custom
    outstandingLoansDetails: string; // Specifics

    // Section 4: Goals & Timeline
    primaryGoal: string; // Or "Other"
    targetInvestmentAmount: number;
    targetYears: number;
    initialAmount: number;
    retirementAge: number;
    retirementLifestyle: string;
    majorPlannedExpenses: string; // Next 24 months

    // Section 5: Risk & Psychology
    targetAnnualReturn: number;
    maxTolerableLoss: number;
    reactionToLoss: LossReaction;

    // Section 6: Context
    additionalContext: string;
}

export interface AIAnalysisResult {
    feasibilityColor: FeasibilityStatus;
    feasibilityTitle: string;
    feasibilityExplanation: string;
    executiveSummary: string;
    projectedOutcome: string; // New prediction field
    investmentStrategy: Array<{
        title: string;
        allocationPercentage?: number;
        description: string;
        assets: string[];
    }>;
    riskAssessment: string;
    nextSteps: string[];
}