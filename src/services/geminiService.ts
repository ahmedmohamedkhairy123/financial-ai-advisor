import { AIAnalysisResult, FinancialFormData } from '../types';

// Backend API URL (change if deploying)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const processFinancialData = async (formData: FinancialFormData): Promise<{data: AIAnalysisResult, sessionId: string}> => { // ✅ Updated return type
  try {
    const token = localStorage.getItem('token');
    
    console.log('🔑 Sending request with token:', token ? 'YES' : 'NO');

    const response = await fetch(`${API_BASE_URL}/analysis`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.details || errorMessage;
      } catch (e) {
        errorMessage = response.statusText || errorMessage;
      }
      
      throw new Error(errorMessage);
    }

    const result = await response.json();
    
    console.log('✅ Analysis saved:', result.savedToDatabase ? 'YES' : 'NO');
    console.log('👤 Session ID:', result.sessionId);
    
    // ✅ Return both data and sessionId
    return {
      data: result.data as AIAnalysisResult,
      sessionId: result.sessionId || `session_${Date.now()}`
    };
    
  } catch (error: any) {
    console.error('❌ Backend API call failed:', error.message);
    
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      throw new Error('Cannot connect to the server. Please check if the backend is running on http://localhost:5000');
    }
    
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