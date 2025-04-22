import { Router } from 'express';
import { analyzeFinancialData } from '../services/gemini.service';
import { DatabaseService } from '../services/database.service';
import { v4 as uuidv4 } from 'uuid';
import { authenticate, AuthenticatedRequest } from '../middleware/auth.middleware';

const router = Router();

// Generate session ID
const generateSessionId = (): string => {
    return `session_${uuidv4()}_${Date.now()}`;
};

// POST /api/analysis - Analyze financial data
router.post('/', async (req, res) => {
    const startTime = Date.now();
    let sessionId = req.headers['x-session-id'] as string || generateSessionId();

    try {
        const formData = req.body;

        // Basic validation
        if (!formData || Object.keys(formData).length === 0) {
            return res.status(400).json({
                success: false,
                error: 'No form data provided'
            });
        }

        console.log('📊 Processing analysis request for session:', sessionId);

        // Call Gemini AI service
        const analysisResult = await analyzeFinancialData(formData);
        const processingTime = Date.now() - startTime;

        // Save to database
        await DatabaseService.saveAnalysis({
            sessionId,
            formData,
            analysisResult,
            processingTime,
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
        });

        // Return successful response
        res.json({
            success: true,
            data: analysisResult,
            sessionId,
            processingTime: `${processingTime}ms`,
            savedToDatabase: true,
            timestamp: new Date().toISOString()
        });

    } catch (error: any) {
        console.error('❌ Analysis error:', error);

        const processingTime = Date.now() - startTime;

        // Handle specific errors
        if (error.message.includes('API_KEY')) {
            return res.status(500).json({
                success: false,
                error: 'Server configuration error',
                details: 'API key missing or invalid',
                processingTime: `${processingTime}ms`
            });
        }

        // Generic error
        res.status(500).json({
            success: false,
            error: 'Failed to analyze financial data',
            details: error.message,
            processingTime: `${processingTime}ms`
        });
    }
});

// GET /api/analysis/history - Get user's analysis history
router.get('/history', authenticate, async (req: AuthenticatedRequest, res) => {
    try {
        const userId = req.userId;
        const limit = parseInt(req.query.limit as string) || 10;
        
        // Validate user ID
        if (!userId) {
            return res.status(400).json({
                success: false,
                error: 'User ID not found in request'
            });
        }

        console.log(`📋 Fetching analysis history for user: ${userId}, limit: ${limit}`);
        
        const analyses = await DatabaseService.getUserAnalyses(userId, limit);
        
        res.json({
            success: true,
            data: analyses,
            count: analyses.length,
            timestamp: new Date().toISOString()
        });
    } catch (error: any) {
        console.error('❌ Error fetching analysis history:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch analysis history',
            details: error.message
        });
    }
});

// GET /api/analysis/test - Test endpoint
router.get('/test', (req, res) => {
    res.json({
        success: true,
        message: 'Financial Advisor API is working!',
        endpoints: {
            analyze: 'POST /api/analysis',
            history: 'GET /api/analysis/history (authenticated)',
            test: 'GET /api/analysis/test',
            database: 'GET /api/db/stats'
        },
        authentication_required: {
            '/history': 'Requires valid JWT token'
        }
    });
});

export default router;