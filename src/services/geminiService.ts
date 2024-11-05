import { AIAnalysisResult, FinancialFormData } from '../types';

// Backend API URL (change if deploying)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const processFinancialData = async (formData: FinancialFormData): Promise<AIAnalysisResult> => {
    try {
        console.log('📤 Sending data to backend:', {
            age: formData.age,
            income: formData.annualIncome,
            target: formData.targetInvestmentAmount
        });

        const response = await fetch(`${API_BASE_URL}/analysis`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        // Handle HTTP errors
        if (!response.ok) {
            let errorMessage = `HTTP error! status: ${response.status}`;

            try {
                const errorData = await response.json();
                errorMessage = errorData.error || errorData.details || errorMessage;
            } catch (e) {
                // If response is not JSON, use status text
                errorMessage = response.statusText || errorMessage;
            }

            throw new Error(errorMessage);
        }

        // Parse successful response
        const result = await response.json();

        console.log('✅ Backend response received:', result.success ? 'SUCCESS' : 'FAILED');

        if (!result.success) {
            throw new Error(result.error || 'Analysis failed on server');
        }

        return result.data as AIAnalysisResult;

    } catch (error: any) {
        console.error('❌ Backend API call failed:', error.message);

        // Provide user-friendly error messages
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            throw new Error('Cannot connect to the server. Please check if the backend is running on http://localhost:5000');
        }

        if (error.message.includes('404')) {
            throw new Error('Server endpoint not found. Please check backend configuration.');
        }

        if (error.message.includes('500')) {
            throw new Error('Server error. Please try again later or contact support.');
        }

        // Re-throw the original error
        throw error;
    }
};

// Optional: Direct Gemini fallback (for development/testing)
export const processFinancialDataDirect = async (formData: FinancialFormData): Promise<AIAnalysisResult> => {
    // Only use this if you want a direct fallback during development
    console.warn('⚠️ Using direct Gemini API (development mode)');

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error("GEMINI_API_KEY is not set in frontend environment variables.");
    }

    const { GoogleGenAI, Type } = await import("@google/genai");
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
    Act as a world-class senior financial advisor and quantitative analyst. 
    Analyze the following user financial profile and provide a sophisticated, actionable investment strategy.
    
    User Profile:
    ${JSON.stringify(formData, null, 2)}

    Your task is to:
    1. **Feasibility Analysis**: Determine if their goal is realistic (Red/Yellow/Green).
    2. **Strategic Allocation**: Propose a specific, advanced asset allocation strategy.
    3. **Prediction**: Provide a financial projection with numbers.
    4. **Action Plan**: Give step-by-step instructions.
    
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

    return JSON.parse(response.text) as AIAnalysisResult;
};