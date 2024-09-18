import { GoogleGenAI, Type } from "@google/genai";
import { AIAnalysisResult, FinancialFormData } from "../types";

const processFinancialData = async (formData: FinancialFormData): Promise<AIAnalysisResult> => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        throw new Error("API_KEY environment variable is missing.");
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
    Act as a world-class senior financial advisor and quantitative analyst. 
    Analyze the following user financial profile and provide a sophisticated, actionable investment strategy.
    
    User Profile:
    ${JSON.stringify(formData, null, 2)}

    Your task is to:
    1. **Feasibility Analysis**: Determine if their goal is realistic (Red/Yellow/Green).
    2. **Strategic Allocation**: Propose a specific, advanced asset allocation strategy (e.g., "10% Gold, 40% US Tech Stocks, 30% Government Bonds, 20% Real Estate REITs"). Be very specific about *what* to buy, not just general categories.
    3. **Prediction**: Provide a financial projection. Predict where they will be in their target timeline if they follow your advice vs. if they do nothing. Use numbers and projected growth rates.
    4. **Action Plan**: Give step-by-step instructions.

    Ensure the advice is tailored to their risk tolerance (Age: ${formData.age}, Reaction to loss: ${formData.reactionToLoss}).
    
    Format the response strictly as JSON.
  `;

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    feasibilityColor: {
                        type: Type.STRING,
                        enum: ["RED", "YELLOW", "GREEN"],
                        description: "The traffic light status of the goal feasibility.",
                    },
                    feasibilityTitle: {
                        type: Type.STRING,
                        description: "A short headline for the feasibility assessment.",
                    },
                    feasibilityExplanation: {
                        type: Type.STRING,
                        description: "Why this color was chosen.",
                    },
                    executiveSummary: {
                        type: Type.STRING,
                        description: "A high-level overview of the user's situation.",
                    },
                    projectedOutcome: {
                        type: Type.STRING,
                        description: "A prediction of future wealth or goal completion status based on the strategy. E.g., 'By year 10, your portfolio is projected to grow to $X...'"
                    },
                    investmentStrategy: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                title: { type: Type.STRING, description: "Name of the asset class or strategy component" },
                                allocationPercentage: { type: Type.NUMBER, description: "0-100" },
                                description: { type: Type.STRING, description: "Why this is chosen and how it fits." },
                                assets: {
                                    type: Type.ARRAY,
                                    items: { type: Type.STRING },
                                    description: "Specific instruments to buy (e.g., 'GLD ETF', 'Vanguard Total Stock Market', 'Series I Bonds')",
                                },
                            },
                        },
                    },
                    riskAssessment: {
                        type: Type.STRING,
                        description: "Analysis of their risk profile vs. required risk.",
                    },
                    nextSteps: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                        description: "Actionable bullet points.",
                    },
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

    return JSON.parse(response.text) as AIAnalysisResult;
};

export { processFinancialData };