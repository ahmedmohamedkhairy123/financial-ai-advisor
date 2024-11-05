import { Router } from 'express';
import { analyzeFinancialData } from '../services/gemini.service';

const router = Router();

// POST /api/analysis - Analyze financial data
router.post('/', async (req, res) => {
    try {
        const formData = req.body;

        // Basic validation
        if (!formData || Object.keys(formData).length === 0) {
            return res.status(400).json({ error: 'No form data provided' });
        }

        // Validate required fields
        const requiredFields = ['age', 'annualIncome', 'targetInvestmentAmount', 'targetYears'];
        for (const field of requiredFields) {
            if (!formData[field]) {
                return res.status(400).json({ error: `Missing required field: ${field}` });
            }
        }

        console.log('📊 Processing analysis request for age:', formData.age);

        // Call Gemini AI service
        const analysisResult = await analyzeFinancialData(formData);

        // Return successful response
        res.json({
            success: true,
            data: analysisResult,
            timestamp: new Date().toISOString()
        });

    } catch (error: any) {
        console.error('❌ Analysis error:', error);

        // Handle specific errors
        if (error.message.includes('API_KEY')) {
            return res.status(500).json({
                error: 'Server configuration error. Please contact administrator.',
                details: 'API key missing or invalid'
            });
        }

        if (error.message.includes('No response from AI')) {
            return res.status(503).json({
                error: 'AI service temporarily unavailable. Please try again.',
                details: 'No response from Gemini AI'
            });
        }

        // Generic error
        res.status(500).json({
            error: 'Failed to analyze financial data',
            details: error.message
        });
    }
});

// GET /api/analysis/test - Test endpoint
router.get('/test', (req, res) => {
    res.json({
        message: 'Financial Advisor API is working!',
        endpoints: {
            analyze: 'POST /api/analysis',
            test: 'GET /api/analysis/test'
        }
    });
});

export default router;