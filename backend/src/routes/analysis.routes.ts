import { Router } from 'express';
import { analyzeFinancialData } from '../services/gemini.service';
import { DatabaseService } from '../services/database.service';
import { v4 as uuidv4 } from 'uuid';
import { authenticate, AuthenticatedRequest } from '../middleware/auth.middleware';
import jwt from 'jsonwebtoken';

const router = Router();

// Generate session ID
const generateSessionId = (): string => {
  return `session_${uuidv4()}_${Date.now()}`;
};

// POST /api/analysis - Analyze financial data
router.post('/', async (req: AuthenticatedRequest, res) => {
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

    // ✅ Extract user ID from token (if present)
    let userId = null;
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
        userId = decoded.userId;
        console.log(`✅ Authenticated user: ${userId}`);
      } catch (error) {
        console.log('⚠️ Invalid token, proceeding as guest');
        // Continue without user ID
      }
    }

    console.log(`📊 Processing analysis request for ${userId ? 'user: ' + userId : 'guest'}, session: ${sessionId}`);
    
    // Call Gemini AI service
    const analysisResult = await analyzeFinancialData(formData);
    const processingTime = Date.now() - startTime;
    
    // Save to database
    await DatabaseService.saveAnalysis({
      sessionId,
      userId, // ✅ This will be null for guests, user ID for logged-in users
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
      userId, // ✅ Return userId so frontend knows
      processingTime: `${processingTime}ms`,
      savedToDatabase: true,
      authenticated: !!userId,
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

// GET /api/analysis/history - Get user's analysis history (requires auth)
router.get('/history', authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.userId;
    const limit = parseInt(req.query.limit as string) || 10;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    const analyses = await DatabaseService.getUserAnalyses(userId, limit);
    
    res.json({
      success: true,
      data: analyses.map((analysis: any) => ({
        id: analysis._id,
        sessionId: analysis.sessionId,
        goal: analysis.formData?.primaryGoal || 'Unknown',
        amount: analysis.formData?.targetInvestmentAmount || 0,
        years: analysis.formData?.targetYears || 0,
        feasibility: analysis.analysisResult?.feasibilityColor || 'UNKNOWN',
        createdAt: analysis.createdAt,
      })),
      count: analyses.length,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('❌ History error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch analysis history',
      details: error.message
    });
  }
});

// GET /api/analysis/:sessionId - Get specific analysis by session ID
router.get('/:sessionId', async (req: AuthenticatedRequest, res) => {
  try {
    const { sessionId } = req.params;
    let userId = null;
    
    // Check authentication
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
        userId = decoded.userId;
      } catch (error) {
        // Token invalid, continue as guest
      }
    }

    const analysis = await DatabaseService.getAnalysisBySessionId(sessionId);
    
    if (!analysis) {
      return res.status(404).json({
        success: false,
        error: 'Analysis not found'
      });
    }

    // Check ownership (only if user is authenticated)
    if (userId && analysis.userId && analysis.userId !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access this analysis'
      });
    }

    res.json({
      success: true,
      data: {
        ...analysis.toObject(),
        canEdit: !userId || (analysis.userId === userId)
      },
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch analysis',
      details: error.message
    });
  }
});

// GET /api/analysis/test - Test endpoint (public)
router.get('/test', (req, res) => {
  res.json({ 
    success: true,
    message: 'Financial Advisor API is working!',
    endpoints: {
      analyze: 'POST /api/analysis',
      history: 'GET /api/analysis/history (requires auth)',
      getAnalysis: 'GET /api/analysis/:sessionId',
      test: 'GET /api/analysis/test (public)',
      database: 'GET /api/db/stats'
    }
  });
});

export default router;