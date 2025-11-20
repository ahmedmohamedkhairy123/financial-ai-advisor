import { GoogleGenAI, Type } from "@google/genai";
import { AIAnalysisResult, FinancialFormData, FeasibilityStatus } from '../types';

// Direct Gemini API call (no backend needed)
export const processFinancialData = async (formData: FinancialFormData): Promise<AIAnalysisResult> => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey) {
    // For demo mode, return mock data
    console.warn('⚠️ No Gemini API key found, using demo mode');
    return getMockAnalysis(formData);
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
      Act as a world-class senior financial advisor. Analyze this financial profile:
      
      Age: ${formData.age}, Country: ${formData.country}, Income: $${formData.annualIncome}
      Goal: ${formData.primaryGoal}, Target: $${formData.targetInvestmentAmount} in ${formData.targetYears} years
      Risk Tolerance: ${formData.reactionToLoss}
      
      Provide investment strategy with:
      1. Feasibility (RED/YELLOW/GREEN)
      2. Specific asset allocation with percentages
      3. Projected outcome with numbers
      4. Action steps
      
      Format as JSON.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            feasibilityColor: { type: Type.STRING, enum: ["RED", "YELLOW", "GREEN"] },
            feasibilityTitle: { type: Type.STRING },
            feasibilityExplanation: { type: Type.STRING },
            executiveSummary: { type: Type.STRING },
            projectedOutcome: { type: Type.STRING },
            investmentStrategy: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  allocationPercentage: { type: Type.NUMBER },
                  description: { type: Type.STRING },
                  assets: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
              },
            },
            riskAssessment: { type: Type.STRING },
            nextSteps: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: [
            "feasibilityColor",
            "feasibilityTitle",
            "feasibilityExplanation",
            "executiveSummary",
            "projectedOutcome",
            "investmentStrategy",
            "riskAssessment",
            "nextSteps",
          ],
        },
      },
    });

    if (!response.text) {
      throw new Error("No response from AI");
    }

    const result = JSON.parse(response.text) as AIAnalysisResult;
    
    // Save to local history
    saveToLocalHistory(formData, result);
    
    return result;
    
  } catch (error: any) {
    console.error('Gemini API error:', error);
    // Fallback to mock data
    return getMockAnalysis(formData);
  }
};

// Mock data for demo mode
const getMockAnalysis = (formData: FinancialFormData): AIAnalysisResult => {
  const isRealistic = formData.monthlyInvestmentCapacity > 500;
  
  return {
    feasibilityColor: isRealistic ? FeasibilityStatus.GREEN : FeasibilityStatus.YELLOW,
    feasibilityTitle: isRealistic ? "Goal Achievable with Discipline" : "Needs Adjustment",
    feasibilityExplanation: isRealistic 
      ? `With your current savings rate of $${formData.monthlyInvestmentCapacity}/month, you're on track to reach $${formData.targetInvestmentAmount} in ${formData.targetYears} years.`
      : `To reach $${formData.targetInvestmentAmount} in ${formData.targetYears} years, consider increasing your monthly contributions.`,
    executiveSummary: `You're a ${formData.age}-year-old ${formData.country} resident aiming for ${formData.primaryGoal}. Based on your risk profile, here's a tailored strategy.`,
    projectedOutcome: `At ${formData.targetAnnualReturn}% annual return, investing $${formData.monthlyInvestmentCapacity}/month for ${formData.targetYears} years could grow to approximately $${Math.round(formData.monthlyInvestmentCapacity * 12 * formData.targetYears * 1.8)}.`,
    investmentStrategy: [
      {
        title: "US Total Stock Market",
        allocationPercentage: 60,
        description: "Core growth component for long-term wealth accumulation.",
        assets: ["VTI (Vanguard Total Stock Market ETF)", "FSKAX (Fidelity Total Market Index Fund)"]
      },
      {
        title: "International Stocks",
        allocationPercentage: 20,
        description: "Geographic diversification to capture global growth.",
        assets: ["VXUS (Vanguard Total International Stock ETF)", "FTIHX (Fidelity Total International Index Fund)"]
      },
      {
        title: "Bonds & Fixed Income",
        allocationPercentage: 15,
        description: "Stability and income during market volatility.",
        assets: ["BND (Vanguard Total Bond Market ETF)", "VCIT (Vanguard Corporate Bond ETF)"]
      },
      {
        title: "Real Estate & Alternatives",
        allocationPercentage: 5,
        description: "Inflation hedge and income diversification.",
        assets: ["VNQ (Vanguard Real Estate ETF)", "GLD (SPDR Gold Shares)"]
      }
    ],
    riskAssessment: `Your risk tolerance (${formData.reactionToLoss}) suggests a balanced approach. The ${formData.maxTolerableLoss}% maximum loss tolerance aligns with this 75/25 stock/bond allocation.`,
    nextSteps: [
      "Open a brokerage account with a low-cost provider",
      "Set up automatic monthly investments",
      "Allocate funds according to the strategy above",
      "Review and rebalance portfolio annually",
      "Increase contributions by 3% each year"
    ]
  };
};

// Save analysis to localStorage
const saveToLocalHistory = (formData: FinancialFormData, result: AIAnalysisResult) => {
  try {
    const history = JSON.parse(localStorage.getItem('financialHistory') || '[]');
    const analysis = {
      id: `analysis_${Date.now()}`,
      timestamp: new Date().toISOString(),
      formData,
      result,
      userId: localStorage.getItem('currentUserId') || 'guest'
    };
    
    history.unshift(analysis); // Add to beginning
    localStorage.setItem('financialHistory', JSON.stringify(history.slice(0, 50))); // Keep last 50
  } catch (error) {
    console.error('Failed to save history:', error);
  }
};

// Get analysis history from localStorage
export const getAnalysisHistory = () => {
  try {
    return JSON.parse(localStorage.getItem('financialHistory') || '[]');
  } catch (error) {
    return [];
  }
};